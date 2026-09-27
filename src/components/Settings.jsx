function Settings({
  theme,
  setTheme,
  accentColor,
  setAccentColor,
  accent,
}) {
  /* =========================================================
     SAFE ACCENT
     ========================================================= */

  const safeAccent = accent || {
    button: "bg-purple-600 hover:bg-purple-700",
    text: "text-purple-600",
    lightBg: "bg-purple-50",
    border: "border-purple-500",
  };

  /* =========================================================
     THEMES
     ========================================================= */

  const themes = [
    {
      name: "light",
      icon: "☀️",
      title: "Light",
      description: "Use the light appearance",
    },
    {
      name: "dark",
      icon: "🌙",
      title: "Dark",
      description: "Use the dark appearance",
    },
  ];

  /* =========================================================
     ACCENT COLORS
     ========================================================= */

  const colors = [
    {
      name: "purple",
      class: "bg-purple-600",
    },
    {
      name: "blue",
      class: "bg-blue-600",
    },
    {
      name: "green",
      class: "bg-green-600",
    },
  ];

  /* =========================================================
     THEME STYLES
     ========================================================= */

  const isDark = theme === "dark";

  const pageText = isDark
    ? "text-white"
    : "text-gray-900";

  const secondaryText = isDark
    ? "text-gray-400"
    : "text-gray-500";

  const cardBackground = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const normalBorder = isDark
    ? "border-gray-700 hover:border-gray-600"
    : "border-gray-200 hover:border-gray-300";

  const dividerBorder = isDark
    ? "border-gray-700"
    : "border-gray-200";

  /* =========================================================
     RETURN
     ========================================================= */

  return (
    <div className="max-w-4xl">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div>
        <h1
          className={`text-3xl font-bold ${pageText}`}
        >
          Settings
        </h1>

        <p
          className={`mt-2 ${secondaryText}`}
        >
          Customize your NoteFlow experience.
        </p>
      </div>

      {/* =====================================================
          APPEARANCE
          ===================================================== */}

      <div
        className={`mt-8 border rounded-2xl p-6 ${cardBackground}`}
      >
        <h2
          className={`text-xl font-bold ${pageText}`}
        >
          Appearance
        </h2>

        <p
          className={`mt-1 ${secondaryText}`}
        >
          Choose how NoteFlow looks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

          {themes.map((item) => {
            const isSelected =
              theme === item.name;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() =>
                  setTheme(item.name)
                }
                className={`text-left p-5 rounded-2xl border-2 transition ${
                  isSelected
                    ? `${safeAccent.border} ${safeAccent.lightBg}`
                    : normalBorder
                }`}
              >
                {/* ICON */}

                <div className="text-3xl">
                  {item.icon}
                </div>

                {/* TITLE */}

                <h3
                  className={`font-semibold mt-3 ${pageText}`}
                >
                  {item.title}
                </h3>

                {/* DESCRIPTION */}

                <p
                  className={`text-sm mt-1 ${secondaryText}`}
                >
                  {item.description}
                </p>

                {/* SELECTED */}

                {isSelected && (
                  <div
                    className={`mt-4 font-semibold text-sm ${safeAccent.text}`}
                  >
                    ✓ Selected
                  </div>
                )}
              </button>
            );
          })}

        </div>
      </div>

      {/* =====================================================
          ACCENT COLOR
          ===================================================== */}

      <div
        className={`mt-6 border rounded-2xl p-6 ${cardBackground}`}
      >
        <h2
          className={`text-xl font-bold ${pageText}`}
        >
          Accent Color
        </h2>

        <p
          className={`mt-1 ${secondaryText}`}
        >
          Choose the main color of your application.
        </p>

        <div className="flex gap-5 mt-6">

          {colors.map((color) => {
            const isSelected =
              accentColor === color.name;

            return (
              <button
                key={color.name}
                type="button"
                onClick={() =>
                  setAccentColor(color.name)
                }
                className={`w-12 h-12 rounded-full ${color.class} transition hover:scale-110 ${
                  isSelected
                    ? "ring-4 ring-gray-400 ring-offset-4"
                    : ""
                }`}
                title={color.name}
              >
                {isSelected && (
                  <span className="text-white font-bold">
                    ✓
                  </span>
                )}
              </button>
            );
          })}

        </div>

        <p
          className={`mt-5 text-sm ${secondaryText}`}
        >
          Selected:{" "}
          <span className="font-semibold capitalize">
            {accentColor}
          </span>
        </p>
      </div>

      {/* =====================================================
          ABOUT
          ===================================================== */}

      <div
        className={`mt-6 border rounded-2xl p-6 ${cardBackground}`}
      >
        <h2
          className={`text-xl font-bold ${pageText}`}
        >
          About NoteFlow
        </h2>

        <div
          className={`mt-5 space-y-4 ${secondaryText}`}
        >

          {/* APPLICATION */}

          <div
            className={`flex justify-between border-b ${dividerBorder} pb-3`}
          >
            <span>
              Application
            </span>

            <span
              className={`font-medium ${pageText}`}
            >
              NoteFlow
            </span>
          </div>

          {/* VERSION */}

          <div
            className={`flex justify-between border-b ${dividerBorder} pb-3`}
          >
            <span>
              Version
            </span>

            <span
              className={`font-medium ${pageText}`}
            >
              1.0.0
            </span>
          </div>

          {/* BUILT WITH */}

          <div className="flex justify-between">
            <span>
              Built With
            </span>

            <span
              className={`font-medium ${pageText}`}
            >
              React + Node.js + Supabase
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Settings;