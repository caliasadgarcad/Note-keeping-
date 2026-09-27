require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
  createClient,
} = require("@supabase/supabase-js");

const app = express();

/* =========================================================
   ENVIRONMENT
========================================================= */

const PORT =
  process.env.PORT || 5000;

const SUPABASE_URL =
  process.env.SUPABASE_URL;

const SUPABASE_PUBLISHABLE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL) {
  throw new Error(
    "SUPABASE_URL is missing from server/.env"
  );
}

if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    "SUPABASE_PUBLISHABLE_KEY is missing from server/.env"
  );
}

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(
  express.json()
);

/* =========================================================
   SUPABASE CLIENT
========================================================= */

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

/*
   Create a Supabase client using
   the user's access token.

   This means Supabase RLS still
   knows which authenticated user
   is making the request.
*/

function createSupabaseClient(
  accessToken
) {
  return createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },
      },
    }
  );
}

/* =========================================================
   AUTHENTICATION MIDDLEWARE
========================================================= */

async function authenticateUser(
  req,
  res,
  next
) {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        error:
          "Authentication token is required.",
      });
    }

    const accessToken =
      authorization.replace(
        "Bearer ",
        ""
      );

    if (!accessToken) {
      return res.status(401).json({
        error:
          "Authentication token is missing.",
      });
    }

    const {
      data,
      error,
    } = await supabase.auth.getUser(
      accessToken
    );

    if (error || !data?.user) {
      return res.status(401).json({
        error:
          "Invalid or expired authentication token.",
      });
    }

    req.user = data.user;

    req.supabase =
      createSupabaseClient(
        accessToken
      );

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    return res.status(401).json({
      error:
        "Authentication failed.",
    });
  }
}

/* =========================================================
   ROOT
========================================================= */

app.get("/", (req, res) => {
  res.json({
    message:
      "NoteFlow Node.js API is running.",
  });
});

/* =========================================================
   TEST SUPABASE
========================================================= */

app.get(
  "/api/test-supabase",
  authenticateUser,
  async (req, res) => {
    try {
      const {
        data,
        error,
      } = await req.supabase
        .from("notes")
        .select("id")
        .limit(1);

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(
        "Supabase test error:",
        error
      );

      res.status(500).json({
        error:
          error.message ||
          "Supabase test failed.",
      });
    }
  }
);

/* =========================================================
   NOTES
========================================================= */

/*
   GET ALL NOTES
*/

app.get(
  "/api/notes",
  authenticateUser,
  async (req, res) => {
    try {
      const {
        data,
        error,
      } = await req.supabase
        .from("notes")
        .select(`
          *,
          categories (
            id,
            name,
            color
          )
        `)
        .order(
          "updated_at",
          {
            ascending: false,
          }
        );

      if (error) {
        throw error;
      }

      res.json({
        data: data || [],
      });
    } catch (error) {
      console.error(
        "GET notes error:",
        error
      );

      res.status(500).json({
        error:
          error.message ||
          "Failed to load notes.",
      });
    }
  }
);

/*
   GET ONE NOTE
*/

app.get(
  "/api/notes/:id",
  authenticateUser,
  async (req, res) => {
    try {
      const noteId =
        req.params.id;

      const {
        data,
        error,
      } = await req.supabase
        .from("notes")
        .select(`
          *,
          categories (
            id,
            name,
            color
          )
        `)
        .eq(
          "id",
          noteId
        )
        .single();

      if (error) {
        throw error;
      }

      res.json({
        data,
      });
    } catch (error) {
      console.error(
        "GET note error:",
        error
      );

      res.status(500).json({
        error:
          error.message ||
          "Failed to load note.",
      });
    }
  }
);

/*
   CREATE NOTE
*/

app.post(
  "/api/notes",
  authenticateUser,
  async (req, res) => {
    try {
      const {
        title,
        content,
        category_id,
        favorite,
        pinned,
        deleted,
      } = req.body;

      if (
        !title ||
        !title.trim()
      ) {
        return res.status(400).json({
          error:
            "Note title is required.",
        });
      }

      const {
        data,
        error,
      } = await req.supabase
        .from("notes")
        .insert({
          title:
            title.trim(),

          content:
            content || "",

          category_id:
            category_id || null,

          favorite:
            favorite || false,

          pinned:
            pinned || false,

          deleted:
            deleted || false,

          user_id:
            req.user.id,
        })
        .select(`
          *,
          categories (
            id,
            name,
            color
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        data,
      });
    } catch (error) {
      console.error(
        "CREATE note error:",
        error
      );

      res.status(500).json({
        error:
          error.message ||
          "Failed to create note.",
      });
    }
  }
);

/*
   UPDATE NOTE

   Used for:
   - Edit
   - Favorite
   - Pin
   - Restore
*/

app.put(
  "/api/notes/:id",
  authenticateUser,
  async (req, res) => {
    try {
      const noteId =
        req.params.id;

      const allowedFields = [
        "title",
        "content",
        "category_id",
        "favorite",
        "pinned",
        "deleted",
      ];

      const updates = {};

      for (
        const field of allowedFields
      ) {
        if (
          Object.prototype.hasOwnProperty.call(
            req.body,
            field
          )
        ) {
          updates[field] =
            req.body[field];
        }
      }

      if (
        Object.keys(updates)
          .length === 0
      ) {
        return res.status(400).json({
          error:
            "No valid fields were provided.",
        });
      }

      if (
        Object.prototype.hasOwnProperty.call(
          updates,
          "title"
        )
      ) {
        if (
          !updates.title ||
          !updates.title.trim()
        ) {
          return res.status(400).json({
            error:
              "Note title cannot be empty.",
          });
        }

        updates.title =
          updates.title.trim();
      }

      updates.updated_at =
        new Date().toISOString();

      const {
        data,
        error,
      } = await req.supabase
        .from("notes")
        .update(updates)
        .eq(
          "id",
          noteId
        )
        .select(`
          *,
          categories (
            id,
            name,
            color
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      res.json({
        data,
      });
    } catch (error) {
      console.error(
        "UPDATE note error:",
        error
      );

      res.status(500).json({
        error:
          error.message ||
          "Failed to update note.",
      });
    }
  }
);

/*
   MOVE NOTE TO TRASH

   DELETE request does not permanently
   remove the note.
*/

app.delete(
  "/api/notes/:id",
  authenticateUser,
  async (req, res) => {
    try {
      const noteId =
        req.params.id;

      const {
        data,
        error,
      } = await req.supabase
        .from("notes")
        .update({
          deleted: true,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          noteId
        )
        .select(`
          *,
          categories (
            id,
            name,
            color
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      res.json({
        data,
      });
    } catch (error) {
      console.error(
        "DELETE note error:",
        error
      );

      res.status(500).json({
        error:
          error.message ||
          "Failed to move note to trash.",
      });
    }
  }
);

/*
   PERMANENTLY DELETE NOTE

   POST /api/notes/:id/permanent-delete
*/

app.delete(
  "/api/notes/:id/permanent",
  authenticateUser,
  async (req, res) => {
    try {
      const noteId =
        req.params.id;

      const {
        data,
        error,
      } = await req.supabase
        .from("notes")
        .delete()
        .eq(
          "id",
          noteId
        )
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      res.json({
        data,
      });
    } catch (error) {
      console.error(
        "PERMANENT DELETE note error:",
        error
      );

      res.status(500).json({
        error:
          error.message ||
          "Failed to permanently delete note.",
      });
    }
  }
);

/* =========================================================
   CATEGORIES
========================================================= */

/*
   GET ALL CATEGORIES
*/

app.get(
  "/api/categories",
  authenticateUser,
  async (req, res) => {
    try {
      const {
        data,
        error,
      } = await req.supabase
        .from("categories")
        .select("*")
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

      if (error) {
        throw error;
      }

      res.json({
        data: data || [],
      });
    } catch (error) {
      console.error(
        "GET categories error:",
        error
      );

      res.status(500).json({
        error:
          error.message ||
          "Failed to load categories.",
      });
    }
  }
);

/*
   CREATE CATEGORY
*/

app.post(
  "/api/categories",
  authenticateUser,
  async (req, res) => {
    try {
      const {
        name,
        color,
      } = req.body;

      if (
        !name ||
        !name.trim()
      ) {
        return res.status(400).json({
          error:
            "Category name is required.",
        });
      }

      const {
        data,
        error,
      } = await req.supabase
        .from("categories")
        .insert({
          name:
            name.trim(),

          color:
            color ||
            "bg-purple-500",

          user_id:
            req.user.id,
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        data,
      });
    } catch (error) {
      console.error(
        "CREATE category error:",
        error
      );

      res.status(500).json({
        error:
          error.message ||
          "Failed to create category.",
      });
    }
  }
);

/*
   UPDATE CATEGORY
*/

app.put(
  "/api/categories/:id",
  authenticateUser,
  async (req, res) => {
    try {
      const categoryId =
        req.params.id;

      const updates = {};

      if (
        Object.prototype.hasOwnProperty.call(
          req.body,
          "name"
        )
      ) {
        if (
          !req.body.name ||
          !req.body.name.trim()
        ) {
          return res.status(400).json({
            error:
              "Category name cannot be empty.",
          });
        }

        updates.name =
          req.body.name.trim();
      }

      if (
        Object.prototype.hasOwnProperty.call(
          req.body,
          "color"
        )
      ) {
        updates.color =
          req.body.color;
      }

      if (
        Object.keys(updates)
          .length === 0
      ) {
        return res.status(400).json({
          error:
            "No category fields were provided.",
        });
      }

      const {
        data,
        error,
      } = await req.supabase
        .from("categories")
        .update(updates)
        .eq(
          "id",
          categoryId
        )
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      res.json({
        data,
      });
    } catch (error) {
      console.error(
        "UPDATE category error:",
        error
      );

      res.status(500).json({
        error:
          error.message ||
          "Failed to update category.",
      });
    }
  }
);

/*
   DELETE CATEGORY

   Notes using this category have
   category_id automatically set to NULL
   because of ON DELETE SET NULL.
*/

app.delete(
  "/api/categories/:id",
  authenticateUser,
  async (req, res) => {
    try {
      const categoryId =
        req.params.id;

      const {
        data,
        error,
      } = await req.supabase
        .from("categories")
        .delete()
        .eq(
          "id",
          categoryId
        )
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      res.json({
        data,
      });
    } catch (error) {
      console.error(
        "DELETE category error:",
        error
      );

      res.status(500).json({
        error:
          error.message ||
          "Failed to delete category.",
      });
    }
  }
);

/* =========================================================
   404
========================================================= */

app.use(
  (req, res) => {
    res.status(404).json({
      error:
        "API endpoint not found.",
    });
  }
);

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Unhandled server error:",
      error
    );

    res.status(500).json({
      error:
        error.message ||
        "Internal server error.",
    });
  }
);

/* =========================================================
   START SERVER
========================================================= */

app.listen(
  PORT,
  () => {
    console.log(
      `NoteFlow server running on http://localhost:${PORT}`
    );
  }
);