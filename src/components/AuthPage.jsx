import { useState } from "react";
import { supabase } from "../supabase";
import logo from "../assets/noteflow-logo.png";

function AuthPage({
  theme = "light",
  setTheme,
  accentColor = "purple",
}) {
  const [mode, setMode] = useState("signin");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const isDark = theme === "dark";

  /* =========================================================
     ACCENT COLORS
  ========================================================= */

  const accentStyles = {
    purple: {
      button:
        "bg-purple-600 hover:bg-purple-700",
      focus:
        "focus:ring-purple-500",
      text:
        "text-purple-600",
      light:
        "bg-purple-50",
      border:
        "border-purple-500",
    },

    blue: {
      button:
        "bg-blue-600 hover:bg-blue-700",
      focus:
        "focus:ring-blue-500",
      text:
        "text-blue-600",
      light:
        "bg-blue-50",
      border:
        "border-blue-500",
    },

    green: {
      button:
        "bg-green-600 hover:bg-green-700",
      focus:
        "focus:ring-green-500",
      text:
        "text-green-600",
      light:
        "bg-green-50",
      border:
        "border-green-500",
    },
  };

  const accent =
    accentStyles[accentColor] ||
    accentStyles.purple;

  /* =========================================================
     THEME COLORS
  ========================================================= */

  const background = isDark
    ? "bg-gray-950"
    : "bg-gray-50";

  const cardBackground = isDark
    ? "bg-gray-900 border-gray-800"
    : "bg-white border-gray-200";

  const headingColor = isDark
    ? "text-white"
    : "text-gray-900";

  const secondaryColor = isDark
    ? "text-gray-400"
    : "text-gray-500";

  const inputBackground = isDark
    ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400";

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  /* =========================================================
     SIGN IN / SIGN UP
  ========================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const email =
      formData.email.trim();

    const password =
      formData.password;

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    /* -------------------------------------------------------
       SIGN UP VALIDATION
    ------------------------------------------------------- */

    if (mode === "signup") {
      if (!formData.fullName.trim()) {
        setError(
          "Please enter your full name."
        );
        return;
      }

      if (password.length < 6) {
        setError(
          "Password must be at least 6 characters."
        );
        return;
      }

      if (
        password !==
        formData.confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );
        return;
      }
    }

    setLoading(true);

    try {
      /* =====================================================
         SIGN IN
      ===================================================== */

      if (mode === "signin") {
        const {
          error: signInError,
        } =
          await supabase.auth.signInWithPassword(
            {
              email,
              password,
            }
          );

        if (signInError) {
          throw signInError;
        }

        /*
         * App.jsx listens for the
         * Supabase authentication change.
         *
         * The dashboard will appear automatically.
         */
      }

      /* =====================================================
         SIGN UP
      ===================================================== */

      else {
        const {
          data,
          error: signUpError,
        } =
          await supabase.auth.signUp({
            email,
            password,

            options: {
              data: {
                full_name:
                  formData.fullName.trim(),
              },
            },
          });

        if (signUpError) {
          throw signUpError;
        }

        /*
         * If email confirmation is enabled,
         * session will normally be null.
         */

        if (!data.session) {
          setSuccess(
            "Account created successfully! Please check your email to confirm your account."
          );
        } else {
          setSuccess(
            "Account created successfully!"
          );
        }

        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error(
        "Authentication error:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     FORGOT PASSWORD
  ========================================================= */

  async function handleForgotPassword() {
    setError("");
    setSuccess("");

    const email =
      formData.email.trim();

    if (!email) {
      setError(
        "Enter your email address first, then click Forgot password."
      );
      return;
    }

    setLoading(true);

    try {
      const redirectUrl =
        `${window.location.origin}/reset-password`;

      const {
        error: resetError,
      } =
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: redirectUrl,
          }
        );

      if (resetError) {
        throw resetError;
      }

      setSuccess(
        "Password reset instructions have been sent to your email."
      );
    } catch (err) {
      console.error(
        "Password reset error:",
        err
      );

      setError(
        err?.message ||
          "Unable to send the password reset email."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     SWITCH SIGN IN / SIGN UP
  ========================================================= */

  function switchMode() {
    setMode((previous) =>
      previous === "signin"
        ? "signup"
        : "signin"
    );

    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setShowPassword(false);
    setShowConfirmPassword(false);

    setError("");
    setSuccess("");
  }

  /* =========================================================
     THEME TOGGLE
  ========================================================= */

  function handleThemeToggle() {
    if (!setTheme) {
      return;
    }

    setTheme(
      theme === "dark"
        ? "light"
        : "dark"
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className={`min-h-screen relative flex items-center justify-center px-4 py-10 transition-colors duration-300 ${background}`}
    >
      {/* =====================================================
          THEME TOGGLE
      ===================================================== */}

      <button
        type="button"
        onClick={handleThemeToggle}
        className={`absolute top-5 right-5 w-11 h-11 rounded-xl flex items-center justify-center transition ${
          isDark
            ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
            : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
        }`}
        title={
          isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
        aria-label={
          isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
      >
        {isDark ? "☀️" : "🌙"}
      </button>

      <div className="w-full max-w-md">

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="text-center mb-8">
          <img
            src={logo}
            alt="NoteFlow"
            className="w-16 h-16 mx-auto rounded-2xl object-cover shadow-lg"
          />

          <h1
            className={`text-3xl font-bold mt-5 ${headingColor}`}
          >
            NoteFlow
          </h1>

          <p
            className={`mt-2 ${secondaryColor}`}
          >
            Keep your thoughts organized
          </p>
        </div>

        {/* =================================================
            AUTH CARD
        ================================================= */}

        <div
          className={`border rounded-3xl shadow-xl p-6 sm:p-8 transition-colors duration-300 ${cardBackground}`}
        >

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="mb-7">
            <h2
              className={`text-2xl font-bold ${headingColor}`}
            >
              {mode === "signin"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p
              className={`mt-2 text-sm ${secondaryColor}`}
            >
              {mode === "signin"
                ? "Sign in to continue to your notes."
                : "Start organizing your thoughts with NoteFlow."}
            </p>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (
            <div className="mb-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =================================================
                FULL NAME
            ================================================= */}

            {mode === "signup" && (
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${headingColor}`}
                >
                  Full name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your full name"
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition focus:ring-2 disabled:opacity-60 ${inputBackground} ${accent.focus}`}
                />
              </div>
            )}

            {/* =================================================
                EMAIL
            ================================================= */}

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${headingColor}`}
              >
                Email address
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                placeholder="you@example.com"
                disabled={loading}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition focus:ring-2 disabled:opacity-60 ${inputBackground} ${accent.focus}`}
              />
            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className={`text-sm font-semibold ${headingColor}`}
                >
                  Password
                </label>

                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={
                      handleForgotPassword
                    }
                    disabled={loading}
                    className={`text-sm font-semibold ${accent.text} hover:underline disabled:opacity-50`}
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your password"
                  disabled={loading}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border outline-none transition focus:ring-2 disabled:opacity-60 ${inputBackground} ${accent.focus}`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  disabled={loading}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                    isDark
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-400 hover:text-gray-600"
                  } disabled:opacity-50`}
                  title={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>
              </div>
            </div>

            {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

            {mode === "signup" && (
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${headingColor}`}
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Confirm your password"
                    disabled={loading}
                    className={`w-full px-4 py-3 pr-12 rounded-xl border outline-none transition focus:ring-2 disabled:opacity-60 ${inputBackground} ${accent.focus}`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    disabled={loading}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                      isDark
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-400 hover:text-gray-600"
                    } disabled:opacity-50`}
                    title={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword
                      ? "🙈"
                      : "👁️"}
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                REMEMBER ME
            ================================================= */}

            {mode === "signin" && (
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded"
                />

                <label
                  htmlFor="remember"
                  className={`text-sm ${secondaryColor}`}
                >
                  Remember me
                </label>
              </div>
            )}

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-white font-semibold shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed ${accent.button}`}
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="flex items-center gap-4 my-7">
            <div
              className={`flex-1 h-px ${
                isDark
                  ? "bg-gray-700"
                  : "bg-gray-200"
              }`}
            />

            <span
              className={`text-sm ${secondaryColor}`}
            >
              or
            </span>

            <div
              className={`flex-1 h-px ${
                isDark
                  ? "bg-gray-700"
                  : "bg-gray-200"
              }`}
            />
          </div>

          {/* =================================================
              GOOGLE
          ================================================= */}

          <button
            type="button"
            disabled={loading}
            className={`w-full py-3 rounded-xl border font-semibold transition disabled:opacity-50 ${
              isDark
                ? "border-gray-700 text-gray-200 hover:bg-gray-800"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="mr-2">
              G
            </span>

            Continue with Google
          </button>

          {/* =================================================
              SWITCH SIGN IN / SIGN UP
          ================================================= */}

          <div className="text-center mt-7">
            <span
              className={`text-sm ${secondaryColor}`}
            >
              {mode === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>

            <button
              type="button"
              onClick={switchMode}
              disabled={loading}
              className={`ml-2 text-sm font-semibold ${accent.text} hover:underline disabled:opacity-50`}
            >
              {mode === "signin"
                ? "Sign Up"
                : "Sign In"}
            </button>
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <p
          className={`text-center text-xs mt-6 ${secondaryColor}`}
        >
          © 2026 NoteFlow. Keep your ideas organized.
        </p>
      </div>
    </div>
  );
}

export default AuthPage;