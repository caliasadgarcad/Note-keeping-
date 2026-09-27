function NotesGrid({
  notes = [],
  onEdit = () => {},
  onDelete = () => {},
  onRestore = () => {},
  onPermanentDelete = () => {},
  onToggleFavorite = () => {},
  onTogglePin = () => {},
  onView = () => {},
  theme = "light",
  accent,
}) {
  /* =========================================================
     SAFE ACCENT
  ========================================================= */

  const safeAccent =
    accent || {
      button:
        "bg-purple-600 hover:bg-purple-700",
      text: "text-purple-600",
      lightBg: "bg-purple-50",
      border: "border-purple-500",
    };

  /* =========================================================
     THEME
  ========================================================= */

  const isDark =
    theme === "dark";

  const cardBackground =
    isDark
      ? "bg-gray-800 border-gray-700 hover:border-gray-600"
      : "bg-white border-gray-200 hover:border-gray-300";

  const titleColor =
    isDark
      ? "text-white"
      : "text-gray-900";

  const contentColor =
    isDark
      ? "text-gray-400"
      : "text-gray-600";

  const dateColor =
    isDark
      ? "text-gray-500"
      : "text-gray-400";

  const neutralButton =
    isDark
      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200";

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (!notes || notes.length === 0) {
    return (
      <div
        className={`rounded-3xl border p-8 sm:p-12 text-center ${
          isDark
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        {/* ICON */}

        <div
          className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl ${
            isDark
              ? "bg-gray-700"
              : "bg-gray-100"
          }`}
        >
          📝
        </div>

        {/* TITLE */}

        <h2
          className={`mt-5 text-xl font-bold ${titleColor}`}
        >
          No notes found
        </h2>

        {/* DESCRIPTION */}

        <p
          className={`mt-2 text-sm max-w-md mx-auto ${contentColor}`}
        >
          You don't have any notes to display here yet.
        </p>
      </div>
    );
  }

  /* =========================================================
     CATEGORY HELPER
  ========================================================= */

  function getCategoryName(note) {
    if (
      typeof note.category ===
      "string"
    ) {
      return (
        note.category ||
        "Uncategorized"
      );
    }

    if (
      note.category &&
      typeof note.category ===
        "object"
    ) {
      return (
        note.category.name ||
        "Uncategorized"
      );
    }

    return "Uncategorized";
  }

  /* =========================================================
     CATEGORY COLOR
  ========================================================= */

  function getCategoryColor(note) {
    if (note.color) {
      return note.color;
    }

    if (
      note.category &&
      typeof note.category ===
        "object" &&
      note.category.color
    ) {
      return note.category.color;
    }

    return "bg-purple-500";
  }

  /* =========================================================
     DELETE HANDLER
  ========================================================= */

  function handleDelete(
    event,
    note
  ) {
    event.stopPropagation();

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this note?"
      );

    if (!confirmed) {
      return;
    }

    onDelete(note.id);
  }

  /* =========================================================
     PERMANENT DELETE
  ========================================================= */

  function handlePermanentDelete(
    event,
    note
  ) {
    event.stopPropagation();

    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete this note? This cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    onPermanentDelete(note.id);
  }

  /* =========================================================
     RESTORE
  ========================================================= */

  function handleRestore(
    event,
    note
  ) {
    event.stopPropagation();

    onRestore(note.id);
  }

  /* =========================================================
     EDIT
  ========================================================= */

  function handleEdit(
    event,
    note
  ) {
    event.stopPropagation();

    onEdit(note);
  }

  /* =========================================================
     FAVORITE
  ========================================================= */

  function handleFavorite(
    event,
    note
  ) {
    event.stopPropagation();

    onToggleFavorite(
      note.id
    );
  }

  /* =========================================================
     PIN
  ========================================================= */

  function handlePin(
    event,
    note
  ) {
    event.stopPropagation();

    onTogglePin(note.id);
  }

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {notes.map((note) => {
        const categoryName =
          getCategoryName(note);

        const categoryColor =
          getCategoryColor(note);

        return (
          <article
            key={note.id}
            onClick={() =>
              onView(note)
            }
            className={`group relative rounded-2xl border p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${cardBackground}`}
          >
            {/* =================================================
                TOP ROW
            ================================================= */}

            <div className="flex items-start justify-between gap-3">
              {/* CATEGORY */}

              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-3 h-3 rounded-full shrink-0 ${categoryColor}`}
                />

                <span
                  className={`text-xs font-semibold truncate ${
                    isDark
                      ? "text-gray-300"
                      : "text-gray-500"
                  }`}
                >
                  {categoryName}
                </span>
              </div>

              {/* PIN */}

              <button
                type="button"
                onClick={(event) =>
                  handlePin(
                    event,
                    note
                  )
                }
                className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition ${
                  note.pinned
                    ? `${safeAccent.lightBg} ${safeAccent.text}`
                    : neutralButton
                }`}
                title={
                  note.pinned
                    ? "Unpin note"
                    : "Pin note"
                }
                aria-label={
                  note.pinned
                    ? "Unpin note"
                    : "Pin note"
                }
              >
                📌
              </button>
            </div>

            {/* =================================================
                TITLE
            ================================================= */}

            <h2
              className={`mt-5 text-lg sm:text-xl font-bold line-clamp-2 ${titleColor}`}
            >
              {note.title ||
                "Untitled Note"}
            </h2>

            {/* =================================================
                CONTENT
            ================================================= */}

            <p
              className={`mt-3 text-sm leading-6 line-clamp-4 ${contentColor}`}
            >
              {note.content ||
                "This note has no content."}
            </p>

            {/* =================================================
                DATE
            ================================================= */}

            <div className="mt-5">
              <span
                className={`text-xs ${dateColor}`}
              >
                {note.date ||
                  "No date"}
              </span>
            </div>

            {/* =================================================
                STATUS
            ================================================= */}

            <div className="flex flex-wrap items-center gap-2 mt-4">
              {/* FAVORITE */}

              <button
                type="button"
                onClick={(event) =>
                  handleFavorite(
                    event,
                    note
                  )
                }
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  note.favorite
                    ? `${safeAccent.lightBg} ${safeAccent.text}`
                    : neutralButton
                }`}
                title={
                  note.favorite
                    ? "Remove favorite"
                    : "Add favorite"
                }
              >
                {note.favorite
                  ? "★ Favorite"
                  : "☆ Favorite"}
              </button>

              {/* PINNED */}

              {note.pinned && (
                <span
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${safeAccent.lightBg} ${safeAccent.text}`}
                >
                  📌 Pinned
                </span>
              )}
            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div
              className={`mt-5 pt-4 border-t flex flex-col sm:flex-row gap-2 ${
                isDark
                  ? "border-gray-700"
                  : "border-gray-100"
              }`}
            >
              {/* TRASH */}

              {note.deleted ? (
                <>
                  {/* RESTORE */}

                  <button
                    type="button"
                    onClick={(event) =>
                      handleRestore(
                        event,
                        note
                      )
                    }
                    className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${safeAccent.lightBg} ${safeAccent.text}`}
                  >
                    ↩ Restore
                  </button>

                  {/* PERMANENT DELETE */}

                  <button
                    type="button"
                    onClick={(event) =>
                      handlePermanentDelete(
                        event,
                        note
                      )
                    }
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-600 transition"
                  >
                    Delete Forever
                  </button>
                </>
              ) : (
                <>
                  {/* EDIT */}

                  <button
                    type="button"
                    onClick={(event) =>
                      handleEdit(
                        event,
                        note
                      )
                    }
                    className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold text-white transition ${safeAccent.button}`}
                  >
                    ✏️ Edit
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={(event) =>
                      handleDelete(
                        event,
                        note
                      )
                    }
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-600 transition"
                  >
                    🗑️ Delete
                  </button>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default NotesGrid;