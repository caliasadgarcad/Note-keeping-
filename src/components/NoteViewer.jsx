function NoteViewer({
  note,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onTogglePin,
  theme,
  accent,
}) {
  if (!note) {
    return null;
  }

  const isDark =
    theme === "dark";

  const modalBackground =
    isDark
      ? "bg-gray-800 text-white"
      : "bg-white text-gray-900";

  const secondaryText =
    isDark
      ? "text-gray-400"
      : "text-gray-500";

  const borderColor =
    isDark
      ? "border-gray-700"
      : "border-gray-200";

  const closeHover =
    isDark
      ? "hover:bg-gray-700 hover:text-white"
      : "hover:bg-gray-100 hover:text-gray-700";

  const neutralButton =
    isDark
      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200";

  function handleDelete() {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this note?"
      );

    if (!confirmed) return;

    onDelete(note.id);
    onClose();
  }

  function handleEdit() {
    onEdit(note);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${modalBackground}`}
      >
        {/* ==============================
            HEADER
        ============================== */}

        <div
          className={`flex items-center justify-between p-6 border-b ${borderColor}`}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`w-3 h-3 rounded-full ${
                note.color ||
                "bg-purple-500"
              }`}
            ></span>

            <span
              className={`text-sm ${secondaryText}`}
            >
              {note.category ||
                "Uncategorized"}
            </span>

            {note.pinned && (
              <span
                className={`text-sm font-semibold ${accent.text}`}
              >
                📌 Pinned
              </span>
            )}

            {note.favorite && (
              <span
                className={`text-sm font-semibold ${accent.text}`}
              >
                ★ Favorite
              </span>
            )}
          </div>

          {/* CLOSE */}

          <button
            type="button"
            onClick={onClose}
            className={`w-10 h-10 rounded-xl text-gray-400 transition ${closeHover}`}
          >
            ✕
          </button>
        </div>

        {/* ==============================
            CONTENT
        ============================== */}

        <div className="p-8">
          <h1
            className={`text-3xl font-bold ${
              isDark
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {note.title ||
              "Untitled Note"}
          </h1>

          <p
            className={`mt-3 text-sm ${secondaryText}`}
          >
            {note.date}
          </p>

          <div
            className={`mt-8 whitespace-pre-wrap leading-8 ${
              isDark
                ? "text-gray-300"
                : "text-gray-600"
            }`}
          >
            {note.content ||
              "This note has no content."}
          </div>
        </div>

        {/* ==============================
            ACTIONS
        ============================== */}

        <div
          className={`flex flex-wrap gap-3 p-6 border-t ${borderColor}`}
        >
          {/* PIN */}

          <button
            type="button"
            onClick={() =>
              onTogglePin(note.id)
            }
            className={`px-4 py-3 rounded-xl font-semibold transition ${
              note.pinned
                ? `${accent.lightBg} ${accent.text}`
                : neutralButton
            }`}
          >
            {note.pinned
              ? "📌 Unpin"
              : "📌 Pin"}
          </button>

          {/* FAVORITE */}

          <button
            type="button"
            onClick={() =>
              onToggleFavorite(
                note.id
              )
            }
            className={`px-4 py-3 rounded-xl font-semibold transition ${
              note.favorite
                ? `${accent.lightBg} ${accent.text}`
                : neutralButton
            }`}
          >
            {note.favorite
              ? "★ Remove Favorite"
              : "☆ Add Favorite"}
          </button>

          {/* EDIT */}

          <button
            type="button"
            onClick={handleEdit}
            className={`px-4 py-3 rounded-xl font-semibold text-white ${accent.button}`}
          >
            ✏️ Edit
          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-3 rounded-xl font-semibold bg-red-50 hover:bg-red-100 text-red-600 transition"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteViewer;