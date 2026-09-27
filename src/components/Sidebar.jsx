import { useState } from "react";
import logo from "../assets/noteflow-logo.png";

function Sidebar({
  currentPage,
  onNavigate,
  onNewNote,
  trashCount = 0,
  categories = [],
  notes = [],
  onAddCategory,
  theme = "light",
  accent,
  mobileOpen = false,
  onClose = () => {},
  onLogout = () => {},
}) {
  /* =========================================================
     CATEGORY MODAL
  ========================================================= */

  const [
    isCategoryModalOpen,
    setIsCategoryModalOpen,
  ] = useState(false);

  const [
    categoryName,
    setCategoryName,
  ] = useState("");

  const [
    selectedColor,
    setSelectedColor,
  ] = useState(
    "bg-purple-500"
  );

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

  const sidebarBackground =
    isDark
      ? "bg-gray-900 border-gray-700"
      : "bg-white border-gray-200";

  const textColor =
    isDark
      ? "text-gray-200"
      : "text-gray-700";

  const secondaryText =
    isDark
      ? "text-gray-400"
      : "text-gray-500";

  const hoverBackground =
    isDark
      ? "hover:bg-gray-800"
      : "hover:bg-gray-100";

  const categoryHover =
    isDark
      ? "hover:bg-gray-800"
      : "hover:bg-gray-50";

  const modalBackground =
    isDark
      ? "bg-gray-800 text-white"
      : "bg-white text-gray-900";

  const inputBackground =
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400";

  /* =========================================================
     COLORS
  ========================================================= */

  const colors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-cyan-500",
  ];

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const mainNavigation = [
    {
      id: "notes",
      icon: "📝",
      label: "All Notes",
    },
    {
      id: "favorites",
      icon: "★",
      label: "Favorites",
    },
    {
      id: "pinned",
      icon: "📌",
      label: "Pinned",
    },
    {
      id: "trash",
      icon: "🗑️",
      label: "Trash",
    },
  ];

  /* =========================================================
     CATEGORY COUNT
  ========================================================= */

  function getCategoryCount(
    categoryId
  ) {
    return notes.filter(
      (note) =>
        note.category_id ===
          categoryId &&
        !note.deleted
    ).length;
  }

  /* =========================================================
     HANDLE NAVIGATION
  ========================================================= */

  function handleNavigation(
    page
  ) {
    onNavigate(page);
    onClose();
  }

  /* =========================================================
     NEW NOTE
  ========================================================= */

  function handleNewNote() {
    onNewNote();
    onClose();
  }

  /* =========================================================
     ADD CATEGORY
  ========================================================= */

  async function handleCreateCategory(
    event
  ) {
    event.preventDefault();

    const name =
      categoryName.trim();

    if (!name) {
      return;
    }

    await onAddCategory({
      name,
      color: selectedColor,
    });

    setCategoryName("");
    setSelectedColor(
      "bg-purple-500"
    );
    setIsCategoryModalOpen(false);
  }

  /* =========================================================
     LOGOUT
  ========================================================= */

  async function handleLogoutClick() {
    const confirmed =
      window.confirm(
        "Are you sure you want to log out?"
      );

    if (!confirmed) {
      return;
    }

    await onLogout();
  }

  /* =========================================================
     SIDEBAR
  ========================================================= */

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed lg:sticky
          top-0 left-0
          z-50
          w-72 lg:w-64
          h-screen
          shrink-0
          border-r
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarBackground}
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="px-5 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between gap-3">
            {/* LOGO */}

            <div className="flex items-center gap-3 min-w-0">
              <img
                src={logo}
                alt="NoteFlow"
                className="w-11 h-11 rounded-xl object-cover shrink-0"
              />

              <div className="min-w-0">
                <h1
                  className={`font-bold text-lg truncate ${
                    isDark
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  NoteFlow
                </h1>

                <p
                  className={`text-xs truncate ${secondaryText}`}
                >
                  Your simple notes
                </p>
              </div>
            </div>

            {/* MOBILE CLOSE */}

            <button
              type="button"
              onClick={onClose}
              className={`lg:hidden shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition ${
                isDark
                  ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                  : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              }`}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ===================================================
            NEW NOTE
        =================================================== */}

        <div className="px-4 pt-5">
          <button
            type="button"
            onClick={handleNewNote}
            className={`w-full px-4 py-3 rounded-xl text-white font-semibold shadow-sm transition ${safeAccent.button}`}
          >
            + New Note
          </button>
        </div>

        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <nav className="px-3 pt-5">
          <div className="space-y-1">
            {mainNavigation.map(
              (item) => {
                const isActive =
                  currentPage ===
                  item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      handleNavigation(
                        item.id
                      )
                    }
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition ${
                      isActive
                        ? `${safeAccent.lightBg} ${safeAccent.text} font-semibold`
                        : `${textColor} ${hoverBackground}`
                    }`}
                  >
                    <span className="w-6 text-center text-base">
                      {item.icon}
                    </span>

                    <span className="flex-1">
                      {item.label}
                    </span>

                    {item.id ===
                      "trash" &&
                      trashCount > 0 && (
                        <span
                          className={`min-w-6 h-6 px-1.5 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive
                              ? `${safeAccent.text} bg-white`
                              : isDark
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {trashCount}
                        </span>
                      )}
                  </button>
                );
              }
            )}
          </div>
        </nav>

        {/* ===================================================
            CATEGORIES
        =================================================== */}

        <div className="px-3 pt-6 flex-1 min-h-0 overflow-y-auto">
          <div className="flex items-center justify-between px-3 mb-2">
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${secondaryText}`}
            >
              Categories
            </h2>

            <button
              type="button"
              onClick={() =>
                setIsCategoryModalOpen(
                  true
                )
              }
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-lg transition ${
                isDark
                  ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                  : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              }`}
              title="Add category"
            >
              +
            </button>
          </div>

          <div className="space-y-1">
            {categories.length ===
            0 ? (
              <p
                className={`px-3 py-2 text-sm ${secondaryText}`}
              >
                No categories yet.
              </p>
            ) : (
              categories.map(
                (category) => {
                  const pageId =
                    `category:${category.id}`;

                  const isActive =
                    currentPage ===
                    pageId;

                  const count =
                    getCategoryCount(
                      category.id
                    );

                  return (
                    <button
                      key={
                        category.id
                      }
                      type="button"
                      onClick={() =>
                        handleNavigation(
                          pageId
                        )
                      }
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
                        isActive
                          ? `${safeAccent.lightBg} ${safeAccent.text} font-semibold`
                          : `${textColor} ${categoryHover}`
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          category.color ||
                          "bg-purple-500"
                        }`}
                      />

                      <span className="flex-1 min-w-0 truncate">
                        {category.name}
                      </span>

                      <span
                        className={`text-xs ${secondaryText}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                }
              )
            )}
          </div>
        </div>

        {/* ===================================================
            BOTTOM
        =================================================== */}

        <div
          className={`p-3 border-t ${
            isDark
              ? "border-gray-700"
              : "border-gray-200"
          }`}
        >
          {/* SETTINGS */}

          <button
            type="button"
            onClick={() =>
              handleNavigation(
                "settings"
              )
            }
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition ${
              currentPage ===
              "settings"
                ? `${safeAccent.lightBg} ${safeAccent.text} font-semibold`
                : `${textColor} ${hoverBackground}`
            }`}
          >
            <span className="w-6 text-center">
              ⚙️
            </span>

            <span>
              Settings
            </span>
          </button>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={
              handleLogoutClick
            }
            className={`w-full flex items-center gap-3 px-3 py-3 mt-1 rounded-xl text-left transition ${
              isDark
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="w-6 text-center">
              🚪
            </span>

            <span>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* =====================================================
          CATEGORY MODAL
      ===================================================== */}

      {isCategoryModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() =>
            setIsCategoryModalOpen(
              false
            )
          }
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className={`w-full max-w-md rounded-3xl shadow-2xl p-6 ${modalBackground}`}
          >
            {/* HEADER */}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Add Category
                </h2>

                <p
                  className={`text-sm mt-1 ${secondaryText}`}
                >
                  Create a category for your notes.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsCategoryModalOpen(
                    false
                  )
                }
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                  isDark
                    ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                ✕
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleCreateCategory
              }
              className="mt-6"
            >
              {/* NAME */}

              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDark
                    ? "text-gray-200"
                    : "text-gray-700"
                }`}
              >
                Category name
              </label>

              <input
                type="text"
                value={categoryName}
                onChange={(event) =>
                  setCategoryName(
                    event.target.value
                  )
                }
                placeholder="e.g. University"
                autoFocus
                className={`w-full px-4 py-3 rounded-xl border outline-none transition focus:ring-2 ${inputBackground} ${
                  safeAccent.text.replace(
                    "text-",
                    "focus:ring-"
                  )
                }`}
              />

              {/* COLORS */}

              <div className="mt-5">
                <label
                  className={`block text-sm font-semibold mb-3 ${
                    isDark
                      ? "text-gray-200"
                      : "text-gray-700"
                  }`}
                >
                  Choose color
                </label>

                <div className="flex flex-wrap gap-3">
                  {colors.map(
                    (color) => {
                      const selected =
                        selectedColor ===
                        color;

                      return (
                        <button
                          key={
                            color
                          }
                          type="button"
                          onClick={() =>
                            setSelectedColor(
                              color
                            )
                          }
                          className={`w-10 h-10 rounded-full ${color} transition hover:scale-110 ${
                            selected
                              ? "ring-4 ring-gray-400 ring-offset-2"
                              : ""
                          }`}
                          title={
                            color
                          }
                        >
                          {selected && (
                            <span className="text-white font-bold">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-7">
                <button
                  type="button"
                  onClick={() =>
                    setIsCategoryModalOpen(
                      false
                    )
                  }
                  className={`w-full sm:w-auto px-5 py-3 rounded-xl font-semibold transition ${
                    isDark
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    !categoryName.trim()
                  }
                  className={`w-full sm:w-auto px-5 py-3 rounded-xl text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${safeAccent.button}`}
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;