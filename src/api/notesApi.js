/*
=========================================================
NOTE FLOW API
Production + Local Development
=========================================================
*/

/*
  When running locally:
  http://localhost:5000

  When deployed:
  VITE_API_URL should contain your Vercel backend URL.

  IMPORTANT:
  In Vercel, add:
  VITE_API_URL = https://noteflow-api-umber.vercel.app
*/

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


/* =========================================================
   RESPONSE HANDLER
========================================================= */

async function handleResponse(
  response,
  defaultMessage
) {
  let result = null;

  try {
    result = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(defaultMessage);
    }

    return null;
  }

  if (!response.ok) {
    throw new Error(
      result?.error ||
        result?.message ||
        defaultMessage
    );
  }

  /*
    Different backend endpoints may return:

    { data: ... }
    { note: ... }
    { notes: ... }
    { categories: ... }

    We support all of them.
  */

  if (result?.data !== undefined) {
    return result.data;
  }

  if (result?.note !== undefined) {
    return result.note;
  }

  if (result?.notes !== undefined) {
    return result.notes;
  }

  if (result?.categories !== undefined) {
    return result.categories;
  }

  return result;
}


/* =========================================================
   AUTH HEADER
========================================================= */

function getHeaders(accessToken) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization =
      `Bearer ${accessToken}`;
  }

  return headers;
}


/* =========================================================
   NOTES
========================================================= */


/*
=========================================================
GET ALL NOTES
=========================================================
*/

export async function getNotes(
  accessToken
) {
  const response = await fetch(
    `${API_URL}/api/notes`,
    {
      method: "GET",
      headers:
        getHeaders(accessToken),
    }
  );

  return handleResponse(
    response,
    "Failed to load notes."
  );
}


/*
=========================================================
GET ONE NOTE
=========================================================
*/

export async function getNote(
  accessToken,
  noteId
) {
  const response = await fetch(
    `${API_URL}/api/notes/${noteId}`,
    {
      method: "GET",
      headers:
        getHeaders(accessToken),
    }
  );

  return handleResponse(
    response,
    "Failed to load note."
  );
}


/*
=========================================================
CREATE NOTE
=========================================================
*/

export async function createNote(
  accessToken,
  note
) {
  const response = await fetch(
    `${API_URL}/api/notes`,
    {
      method: "POST",

      headers:
        getHeaders(accessToken),

      body: JSON.stringify(note),
    }
  );

  return handleResponse(
    response,
    "Failed to create note."
  );
}


/*
=========================================================
UPDATE NOTE

Used for:
- Editing
- Favorite
- Pin
- Restore
=========================================================
*/

export async function updateNote(
  accessToken,
  noteId,
  updates
) {
  const response = await fetch(
    `${API_URL}/api/notes/${noteId}`,
    {
      method: "PUT",

      headers:
        getHeaders(accessToken),

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
=========================================================
MOVE NOTE TO TRASH
=========================================================
*/

export async function deleteNote(
  accessToken,
  noteId
) {
  const response = await fetch(
    `${API_URL}/api/notes/${noteId}`,
    {
      method: "DELETE",

      headers:
        getHeaders(accessToken),
    }
  );

  return handleResponse(
    response,
    "Failed to move note to trash."
  );
}


/*
=========================================================
PERMANENTLY DELETE NOTE
=========================================================
*/

export async function permanentlyDeleteNote(
  accessToken,
  noteId
) {
  const response = await fetch(
    `${API_URL}/api/notes/${noteId}/permanent`,
    {
      method: "DELETE",

      headers:
        getHeaders(accessToken),
    }
  );

  return handleResponse(
    response,
    "Failed to permanently delete note."
  );
}


/*
=========================================================
RESTORE NOTE
=========================================================
*/

export async function restoreNote(
  accessToken,
  noteId
) {
  const response = await fetch(
    `${API_URL}/api/notes/${noteId}`,
    {
      method: "PUT",

      headers:
        getHeaders(accessToken),

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
=========================================================
GET ALL CATEGORIES
=========================================================
*/

export async function getCategories(
  accessToken
) {
  const response = await fetch(
    `${API_URL}/api/categories`,
    {
      method: "GET",

      headers:
        getHeaders(accessToken),
    }
  );

  return handleResponse(
    response,
    "Failed to load categories."
  );
}


/*
=========================================================
CREATE CATEGORY
=========================================================
*/

export async function createCategory(
  accessToken,
  category
) {
  const response = await fetch(
    `${API_URL}/api/categories`,
    {
      method: "POST",

      headers:
        getHeaders(accessToken),

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
=========================================================
UPDATE CATEGORY
=========================================================
*/

export async function updateCategory(
  accessToken,
  categoryId,
  updates
) {
  const response = await fetch(
    `${API_URL}/api/categories/${categoryId}`,
    {
      method: "PUT",

      headers:
        getHeaders(accessToken),

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
=========================================================
DELETE CATEGORY
=========================================================
*/

export async function deleteCategory(
  accessToken,
  categoryId
) {
  const response = await fetch(
    `${API_URL}/api/categories/${categoryId}`,
    {
      method: "DELETE",

      headers:
        getHeaders(accessToken),
    }
  );

  return handleResponse(
    response,
    "Failed to delete category."
  );
}


/* =========================================================
   DEBUG HELPER
========================================================= */

export function getApiUrl() {
  return API_URL;
}