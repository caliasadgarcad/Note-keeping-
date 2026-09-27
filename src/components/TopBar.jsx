function TopBar({
  searchTerm = "",
  onSearchChange = () => {},
  darkMode = false,
  accent,
  onMenuClick = () => {},
}) {
  /* =========================================================
     SAFE ACCENT
  ========================================================= */

  const activeAccent =
    accent || {
      button:
        "bg-purple-600 hover:bg-purple-700",
      text: "text-purple-600",
      lightBg: "bg-purple-50",
    };

  /* =========================================================
     THEME
  ========================================================= */

  const backgroundColor =
    darkMode
      ? "bg-gray-900 border-gray-700"
      : "bg-white border-gray-200";

  const inputBackground =
    darkMode
      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400";

  const textColor =
    darkMode
      ? "text-white"
      : "text-gray-800";

  const secondaryText =
    darkMode
      ? "text-gray-400"
      : "text-gray-500";

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <header
      className={`min-h-20 border-b px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 transition-colors duration-300 ${backgroundColor}`}
    >
      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <button
        type="button"
        onClick={onMenuClick}
        className={`lg:hidden shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl transition ${
          darkMode
            ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="flex-1 min-w-0 max-w-xl">
        <div className="relative">
          {/* SEARCH ICON */}

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            🔍
          </span>

          {/* INPUT */}

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder="Search your notes..."
            className={`w-full border rounded-xl pl-11 pr-10 py-3 outline-none transition focus:ring-2 focus:ring-opacity-50 ${inputBackground}`}
          />

          {/* CLEAR */}

          {searchTerm.length > 0 && (
            <button
              type="button"
              onClick={() =>
                onSearchChange("")
              }
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition ${
                darkMode
                  ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "text-gray-400 hover:bg-gray-200 hover:text-gray-700"
              }`}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          WELCOME
      ===================================================== */}

      <div className="hidden xl:block text-right shrink-0">
        <p
          className={`text-sm font-semibold ${textColor}`}
        >
          Welcome back!
        </p>

        <p
          className={`text-xs mt-1 ${secondaryText}`}
        >
          Keep your thoughts organized
        </p>
      </div>

      {/* =====================================================
          USER
      ===================================================== */}

      <div
        className={`w-11 h-11 shrink-0 rounded-full ${activeAccent.button} flex items-center justify-center text-white font-bold shadow-sm`}
      >
        U
      </div>
    </header>
  );
}

export default TopBar;