import { useEffect, useState } from "react";

function NoteEditor({
  editingNote,
  note,
  categories = [],
  onClose,
  onSave,
  theme = "light",
  accent,
}) {
  /*
   * Support both prop names:
   *
   * editingNote={...}
   * note={...}
   *
   * This prevents the Edit window from
   * accidentally opening as a New Note.
   */
  const activeNote = editingNote || note || null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);

  /* =========================================================
     LOAD NOTE
  ========================================================= */

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title || "");

      setContent(activeNote.content || "");

      const existingCategory = categories.find(
        (item) =>
          Number(item.id) ===
          Number(activeNote.category_id)
      );

      setCategory(
        existingCategory?.name ||
          (typeof activeNote.category === "string"
            ? activeNote.category
            : activeNote.category?.name) ||
          ""
      );
    } else {
      setTitle("");
      setContent("");

      setCategory(
        categories[0]?.name || ""
      );
    }

    setSaving(false);
  }, [activeNote, categories]);

  /* =========================================================
     SUBMIT
  ========================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (!content.trim()) {
      alert("Please enter note content.");
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    const selectedCategory =
      categories.find(
        (item) =>
          item.name === category
      );

    if (!selectedCategory) {
      alert("Please select a valid category.");
      return;
    }

    const noteData = {
      title: title.trim(),

      content: content.trim(),

      category_id:
        selectedCategory.id,

      category:
        selectedCategory.name,

      color:
        selectedCategory.color ||
        "bg-purple-500",

      favorite: activeNote
        ? Boolean(activeNote.favorite)
        : false,

      pinned: activeNote
        ? Boolean(activeNote.pinned)
        : false,
    };

    try {
      setSaving(true);

      await onSave(noteData);
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     THEME
  ========================================================= */

  const isDark =
    theme === "dark";

  const safeAccent =
    accent || {
      button:
        "bg-purple-600 hover:bg-purple-700",
    };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div
          className={`w-full max-w-2xl rounded-3xl shadow-2xl ${
            isDark
              ? "bg-gray-800"
              : "bg-white"
          }`}
        >
          {/* HEADER */}

          <div
            className={`flex items-center justify-between p-6 border-b ${
              isDark
                ? "border-gray-700"
                : "border-gray-200"
            }`}
          >
            <div>
              <h2
                className={`text-2xl font-bold ${
                  isDark
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                {activeNote
                  ? "Edit Note"
                  : "New Note"}
              </h2>

              <p
                className={`mt-1 ${
                  isDark
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                {activeNote
                  ? "Make changes to your note."
                  : "Write down your thoughts and ideas."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className={`w-10 h-10 rounded-xl text-3xl leading-none transition ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              ×
            </button>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5"
          >
            {/* TITLE */}

            <div>
              <label
                className={`block mb-2 font-semibold ${
                  isDark
                    ? "text-gray-200"
                    : "text-gray-700"
                }`}
              >
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Enter note title..."
                disabled={saving}
                autoFocus
                className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-gray-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-gray-200"
                }`}
              />
            </div>

            {/* CONTENT */}

            <div>
              <label
                className={`block mb-2 font-semibold ${
                  isDark
                    ? "text-gray-200"
                    : "text-gray-700"
                }`}
              >
                Content
              </label>

              <textarea
                value={content}
                onChange={(event) =>
                  setContent(
                    event.target.value
                  )
                }
                placeholder="Write your note..."
                rows="8"
                disabled={saving}
                className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-gray-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-gray-200"
                }`}
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label
                className={`block mb-2 font-semibold ${
                  isDark
                    ? "text-gray-200"
                    : "text-gray-700"
                }`}
              >
                Category
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                disabled={
                  saving ||
                  categories.length === 0
                }
                className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-500"
                    : "bg-white border-gray-200 text-gray-900 focus:ring-gray-200"
                }`}
              >
                {categories.length === 0 ? (
                  <option value="">
                    No categories available
                  </option>
                ) : (
                  categories.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.name}
                      >
                        {item.name}
                      </option>
                    )
                  )
                )}
              </select>
            </div>

            {/* BUTTONS */}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className={`px-5 py-3 rounded-xl font-semibold transition ${
                  isDark
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-3 rounded-xl text-white font-semibold transition ${safeAccent.button}`}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : activeNote ? (
                  "Save Changes"
                ) : (
                  "Create Note"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;