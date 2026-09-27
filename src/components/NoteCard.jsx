import { useState } from "react";

function NoteCard({
  note,
  onEdit,
  onDelete,
  onToggleFavorite,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleEdit() {
    setMenuOpen(false);

    if (onEdit) {
      onEdit(note);
    }
  }

  function handleDelete() {
    setMenuOpen(false);

    if (onDelete) {
      onDelete(note.id);
    }
  }

  function handleFavorite() {
    if (onToggleFavorite) {
      onToggleFavorite(note.id);
    }
  }

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">

      {/* TOP */}
      <div className="flex items-start justify-between">

        <h2 className="text-xl font-semibold text-gray-900 pr-4">
          {note.title}
        </h2>

        <div className="flex items-center gap-3">

          {/* FAVORITE BUTTON */}
          <button
            onClick={handleFavorite}
            className={`text-2xl transition ${
              note.favorite
                ? "text-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            }`}
            title={
              note.favorite
                ? "Remove from Favorites"
                : "Add to Favorites"
            }
          >
            ★
          </button>

          {/* THREE DOT MENU */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none px-1"
            aria-label="Note menu"
          >
            ⋮
          </button>

        </div>

      </div>


      {/* MENU */}
      {menuOpen && (
        <div className="absolute right-5 top-14 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">

          {/* EDIT */}
          <button
            onClick={handleEdit}
            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
          >
            ✏️ Edit
          </button>

          {/* DELETE */}
          <button
            onClick={handleDelete}
            className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 transition"
          >
            🗑️ Delete
          </button>

        </div>
      )}


      {/* CONTENT */}
      <p className="mt-6 text-gray-500 leading-7">
        {note.content}
      </p>


      {/* BOTTOM */}
      <div className="mt-8 flex items-center justify-between">

        {/* CATEGORY */}
        <div className="flex items-center gap-2">

          <span
            className={`w-3 h-3 rounded-full ${note.color}`}
          ></span>

          <span className="text-sm font-medium text-gray-500">
            {note.category}
          </span>

        </div>


        {/* DATE */}
        <span className="text-sm text-gray-400">
          {note.date}
        </span>

      </div>

    </div>
  );
}

export default NoteCard;