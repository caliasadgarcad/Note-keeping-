const API_URL =
  "http://localhost:5000";

/* =========================================================
   RESPONSE HANDLER
========================================================= */

async function handleResponse(
  response,
  defaultMessage
) {
  let result;

  try {
    result =
      await response.json();
  } catch {
    throw new Error(
      defaultMessage
    );
  }

  if (!response.ok) {
    throw new Error(
      result?.error ||
        result?.message ||
        defaultMessage
    );
  }

  return (
    result?.data ||
    result?.note ||
    result?.notes ||
    result?.categories ||
    result
  );
}

/* =========================================================
   NOTES
========================================================= */

/*
   GET ALL NOTES
*/

export async function getNotes(
  accessToken
) {
  const response =
    await fetch(
      `${API_URL}/api/notes`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },
      }
    );

  return handleResponse(
    response,
    "Failed to load notes."
  );
}

/*
   GET ONE NOTE
*/

export async function getNote(
  accessToken,
  noteId
) {
  const response =
    await fetch(
      `${API_URL}/api/notes/${noteId}`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },
      }
    );

  return handleResponse(
    response,
    "Failed to load note."
  );
}

/*
   CREATE NOTE
*/

export async function createNote(
  accessToken,
  note
) {
  const response =
    await fetch(
      `${API_URL}/api/notes`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          note
        ),
      }
    );

  return handleResponse(
    response,
    "Failed to create note."
  );
}

/*
   UPDATE NOTE

   Used for:
   - Editing
   - Favorite
   - Pin
   - Restore
*/

export async function updateNote(
  accessToken,
  noteId,
  updates
) {
  const response =
    await fetch(
      `${API_URL}/api/notes/${noteId}`,
      {
        method: "PUT",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          updates
        ),
      }
    );

  return handleResponse(
    response,
    "Failed to update note."
  );
}

/*
   MOVE NOTE TO TRASH
*/

export async function deleteNote(
  accessToken,
  noteId
) {
  const response =
    await fetch(
      `${API_URL}/api/notes/${noteId}`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },
      }
    );

  return handleResponse(
    response,
    "Failed to move note to trash."
  );
}

/*
   PERMANENTLY DELETE NOTE
*/

export async function permanentlyDeleteNote(
  accessToken,
  noteId
) {
  const response =
    await fetch(
      `${API_URL}/api/notes/${noteId}/permanent`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },
      }
    );

  return handleResponse(
    response,
    "Failed to permanently delete note."
  );
}

/*
   RESTORE NOTE
*/

export async function restoreNote(
  accessToken,
  noteId
) {
  const response =
    await fetch(
      `${API_URL}/api/notes/${noteId}`,
      {
        method: "PUT",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          deleted: false,
        }),
      }
    );

  return handleResponse(
    response,
    "Failed to restore note."
  );
}

/* =========================================================
   CATEGORIES
========================================================= */

/*
   GET ALL CATEGORIES
*/

export async function getCategories(
  accessToken
) {
  const response =
    await fetch(
      `${API_URL}/api/categories`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },
      }
    );

  return handleResponse(
    response,
    "Failed to load categories."
  );
}

/*
   CREATE CATEGORY
*/

export async function createCategory(
  accessToken,
  category
) {
  const response =
    await fetch(
      `${API_URL}/api/categories`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          category
        ),
      }
    );

  return handleResponse(
    response,
    "Failed to create category."
  );
}

/*
   UPDATE CATEGORY
*/

export async function updateCategory(
  accessToken,
  categoryId,
  updates
) {
  const response =
    await fetch(
      `${API_URL}/api/categories/${categoryId}`,
      {
        method: "PUT",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          updates
        ),
      }
    );

  return handleResponse(
    response,
    "Failed to update category."
  );
}

/*
   DELETE CATEGORY
*/

export async function deleteCategory(
  accessToken,
  categoryId
) {
  const response =
    await fetch(
      `${API_URL}/api/categories/${categoryId}`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },
      }
    );

  return handleResponse(
    response,
    "Failed to delete category."
  );
}