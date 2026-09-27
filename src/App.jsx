import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import NotesGrid from "./components/NotesGrid";
import NoteEditor from "./components/NoteEditor";
import NoteViewer from "./components/NoteViewer";
import Settings from "./components/Settings";
import AuthPage from "./components/AuthPage";

import {
  getNotes,
  getCategories,
  createNote,
  updateNote,
  deleteNote,
  permanentlyDeleteNote,
  restoreNote,
  createCategory,
} from "./api/notesApi";

/* =========================================================
   ACCENT COLORS
========================================================= */

const accentStyles = {
  purple: {
    button: "bg-purple-600 hover:bg-purple-700",
    text: "text-purple-600",
    lightBg: "bg-purple-100",
    border: "border-purple-300",
  },

  blue: {
    button: "bg-blue-600 hover:bg-blue-700",
    text: "text-blue-600",
    lightBg: "bg-blue-100",
    border: "border-blue-300",
  },

  green: {
    button: "bg-green-600 hover:bg-green-700",
    text: "text-green-600",
    lightBg: "bg-green-100",
    border: "border-green-300",
  },
};

/* =========================================================
   MAP SUPABASE NOTE
========================================================= */

function mapSupabaseNote(note) {
  const category = note.categories || null;

  return {
    ...note,

    category:
      category?.name ||
      "Uncategorized",

    color:
      category?.color ||
      "bg-purple-500",

    date:
      note.updated_at ||
      note.created_at
        ? new Date(
            note.updated_at ||
              note.created_at
          ).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          )
        : "",
  };
}

/* =========================================================
   APP
========================================================= */

function App() {
  /* =======================================================
     AUTH
  ======================================================= */

  const [session, setSession] =
    useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const [currentPage, setCurrentPage] =
    useState("notes");

  /* =======================================================
     EDITOR / VIEWER
  ======================================================= */

  const [isEditorOpen, setIsEditorOpen] =
    useState(false);

  const [editingNote, setEditingNote] =
    useState(null);

  const [viewingNote, setViewingNote] =
    useState(null);

  /* =======================================================
     MOBILE
  ======================================================= */

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  /* =======================================================
     SEARCH
  ======================================================= */

  const [searchTerm, setSearchTerm] =
    useState("");

  /* =======================================================
     DATA
  ======================================================= */

  const [notes, setNotes] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  /* =======================================================
     THEME
  ======================================================= */

  const [theme, setTheme] =
    useState(() => {
      return (
        localStorage.getItem(
          "noteflow-theme"
        ) || "light"
      );
    });

  /* =======================================================
     ACCENT
  ======================================================= */

  const [accentColor, setAccentColor] =
    useState(() => {
      return (
        localStorage.getItem(
          "noteflow-accent"
        ) || "purple"
      );
    });

  const accent =
    accentStyles[accentColor] ||
    accentStyles.purple;

  /* =======================================================
     SAVE THEME
  ======================================================= */

  useEffect(() => {
    localStorage.setItem(
      "noteflow-theme",
      theme
    );
  }, [theme]);

  /* =======================================================
     SAVE ACCENT
  ======================================================= */

  useEffect(() => {
    localStorage.setItem(
      "noteflow-accent",
      accentColor
    );
  }, [accentColor]);

  /* =======================================================
     GET AUTH SESSION
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const {
          data,
          error,
        } =
          await supabase.auth.getSession();

        if (error) {
          console.error(
            "Error getting session:",
            error
          );
        }

        if (mounted) {
          setSession(
            data?.session || null
          );

          setAuthLoading(false);
        }
      } catch (error) {
        console.error(
          "Session loading error:",
          error
        );

        if (mounted) {
          setSession(null);
          setAuthLoading(false);
        }
      }
    }

    loadSession();

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          if (!mounted) {
            return;
          }

          setSession(
            newSession || null
          );
        }
      );

    return () => {
      mounted = false;

      authListener?.subscription?.unsubscribe();
    };
  }, []);

  /* =======================================================
     LOAD NOTES + CATEGORIES
  ======================================================= */

  useEffect(() => {
    if (!session?.access_token) {
      setNotes([]);
      setCategories([]);
      return;
    }

    async function loadData() {
      setLoading(true);

      try {
        const [
          notesData,
          categoriesData,
        ] = await Promise.all([
          getNotes(
            session.access_token
          ),

          getCategories(
            session.access_token
          ),
        ]);

        const normalizedNotes =
          Array.isArray(notesData)
            ? notesData.map(
                mapSupabaseNote
              )
            : [];

        setNotes(
          normalizedNotes
        );

        setCategories(
          Array.isArray(
            categoriesData
          )
            ? categoriesData
            : []
        );
      } catch (error) {
        console.error(
          "Error loading NoteFlow data:",
          error
        );

        window.alert(
          error?.message ||
            "Unable to load your notes."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [session?.access_token]);

  /* =======================================================
     FILTER NOTES
  ======================================================= */

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (
      currentPage ===
      "favorites"
    ) {
      result = result.filter(
        (note) =>
          note.favorite &&
          !note.deleted
      );
    } else if (
      currentPage ===
      "pinned"
    ) {
      result = result.filter(
        (note) =>
          note.pinned &&
          !note.deleted
      );
    } else if (
      currentPage ===
      "trash"
    ) {
      result = result.filter(
        (note) =>
          note.deleted
      );
    } else if (
      currentPage ===
      "notes"
    ) {
      result = result.filter(
        (note) =>
          !note.deleted
      );
    } else if (
      currentPage.startsWith(
        "category:"
      )
    ) {
      const categoryId =
        Number(
          currentPage.split(
            ":"
          )[1]
        );

      result = result.filter(
        (note) =>
          Number(
            note.category_id
          ) === categoryId &&
          !note.deleted
      );
    }

    const search =
      searchTerm
        .trim()
        .toLowerCase();

    if (search) {
      result = result.filter(
        (note) => {
          const title =
            note.title || "";

          const content =
            note.content || "";

          const category =
            note.category || "";

          return (
            title
              .toLowerCase()
              .includes(search) ||
            content
              .toLowerCase()
              .includes(search) ||
            category
              .toLowerCase()
              .includes(search)
          );
        }
      );
    }

    return result;
  }, [
    notes,
    currentPage,
    searchTerm,
  ]);

  /* =======================================================
     TRASH COUNT
  ======================================================= */

  const trashCount = useMemo(() => {
    return notes.filter(
      (note) =>
        note.deleted
    ).length;
  }, [notes]);

  /* =======================================================
     NEW NOTE
  ======================================================= */

  function handleNewNote() {
    setEditingNote(null);

    setViewingNote(null);

    setIsEditorOpen(true);

    setMobileSidebarOpen(false);
  }

  /* =======================================================
     EDIT NOTE
  ======================================================= */

  function handleEditNote(note) {
    if (!note) {
      return;
    }

    /*
     * IMPORTANT:
     * Store the complete note object.
     */
    setEditingNote({
      ...note,
    });

    setViewingNote(null);

    setIsEditorOpen(true);

    setMobileSidebarOpen(false);
  }

  /* =======================================================
     VIEW NOTE
  ======================================================= */

  function handleViewNote(note) {
    setViewingNote(note);
  }

  /* =======================================================
     CLOSE EDITOR
  ======================================================= */

  function handleCloseEditor() {
    setIsEditorOpen(false);

    setEditingNote(null);
  }

  /* =======================================================
     SAVE NOTE
  ======================================================= */

  async function handleSaveNote(
    noteData
  ) {
    if (!session?.access_token) {
      return;
    }

    try {
      if (editingNote) {
        /* ==============================
           UPDATE EXISTING NOTE
        ============================== */

        const updatedData =
          await updateNote(
            session.access_token,
            editingNote.id,
            noteData
          );

        const updatedNote =
          mapSupabaseNote(
            updatedData
          );

        setNotes(
          (previous) =>
            previous.map(
              (note) =>
                note.id ===
                editingNote.id
                  ? updatedNote
                  : note
            )
        );

        if (
          viewingNote?.id ===
          editingNote.id
        ) {
          setViewingNote(
            updatedNote
          );
        }
      } else {
        /* ==============================
           CREATE NEW NOTE
        ============================== */

        const newData =
          await createNote(
            session.access_token,
            noteData
          );

        const newNote =
          mapSupabaseNote(
            newData
          );

        setNotes(
          (previous) => [
            newNote,
            ...previous,
          ]
        );
      }

      setIsEditorOpen(false);

      setEditingNote(null);
    } catch (error) {
      console.error(
        "Error saving note:",
        error
      );

      window.alert(
        error?.message ||
          "Unable to save the note."
      );
    }
  }

  /* =======================================================
     DELETE NOTE
  ======================================================= */

  async function handleDeleteNote(
    noteId
  ) {
    if (!session?.access_token) {
      return;
    }

    try {
      const deletedData =
        await deleteNote(
          session.access_token,
          noteId
        );

      const updatedNote =
        mapSupabaseNote(
          deletedData
        );

      setNotes(
        (previous) =>
          previous.map(
            (note) =>
              note.id === noteId
                ? updatedNote
                : note
          )
      );

      if (
        viewingNote?.id ===
        noteId
      ) {
        setViewingNote(null);
      }
    } catch (error) {
      console.error(
        "Error moving note to trash:",
        error
      );

      window.alert(
        error?.message ||
          "Unable to move the note to trash."
      );
    }
  }

  /* =======================================================
     RESTORE NOTE
  ======================================================= */

  async function handleRestoreNote(
    noteId
  ) {
    if (!session?.access_token) {
      return;
    }

    try {
      const restoredData =
        await restoreNote(
          session.access_token,
          noteId
        );

      const restoredNote =
        mapSupabaseNote(
          restoredData
        );

      setNotes(
        (previous) =>
          previous.map(
            (note) =>
              note.id === noteId
                ? restoredNote
                : note
          )
      );
    } catch (error) {
      console.error(
        "Error restoring note:",
        error
      );

      window.alert(
        error?.message ||
          "Unable to restore the note."
      );
    }
  }

  /* =======================================================
     PERMANENT DELETE
  ======================================================= */

  async function handlePermanentDelete(
    noteId
  ) {
    if (!session?.access_token) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete this note? This cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    try {
      await permanentlyDeleteNote(
        session.access_token,
        noteId
      );

      setNotes(
        (previous) =>
          previous.filter(
            (note) =>
              note.id !== noteId
          )
      );

      if (
        viewingNote?.id ===
        noteId
      ) {
        setViewingNote(null);
      }
    } catch (error) {
      console.error(
        "Error permanently deleting note:",
        error
      );

      window.alert(
        error?.message ||
          "Unable to permanently delete the note."
      );
    }
  }

  /* =======================================================
     FAVORITE
  ======================================================= */

  async function handleToggleFavorite(
    noteId
  ) {
    if (!session?.access_token) {
      return;
    }

    const note =
      notes.find(
        (item) =>
          item.id === noteId
      );

    if (!note) {
      return;
    }

    try {
      const updatedData =
        await updateNote(
          session.access_token,
          noteId,
          {
            favorite:
              !note.favorite,
          }
        );

      const updatedNote =
        mapSupabaseNote(
          updatedData
        );

      setNotes(
        (previous) =>
          previous.map(
            (item) =>
              item.id === noteId
                ? updatedNote
                : item
          )
      );

      if (
        viewingNote?.id ===
        noteId
      ) {
        setViewingNote(
          updatedNote
        );
      }
    } catch (error) {
      console.error(
        "Error updating favorite:",
        error
      );

      window.alert(
        error?.message ||
          "Unable to update favorite."
      );
    }
  }

  /* =======================================================
     PIN
  ======================================================= */

  async function handleTogglePin(
    noteId
  ) {
    if (!session?.access_token) {
      return;
    }

    const note =
      notes.find(
        (item) =>
          item.id === noteId
      );

    if (!note) {
      return;
    }

    try {
      const updatedData =
        await updateNote(
          session.access_token,
          noteId,
          {
            pinned:
              !note.pinned,
          }
        );

      const updatedNote =
        mapSupabaseNote(
          updatedData
        );

      setNotes(
        (previous) =>
          previous.map(
            (item) =>
              item.id === noteId
                ? updatedNote
                : item
          )
      );

      if (
        viewingNote?.id ===
        noteId
      ) {
        setViewingNote(
          updatedNote
        );
      }
    } catch (error) {
      console.error(
        "Error updating pin:",
        error
      );

      window.alert(
        error?.message ||
          "Unable to update pin."
      );
    }
  }

  /* =======================================================
     ADD CATEGORY
  ======================================================= */

  async function handleAddCategory(
    categoryData
  ) {
    if (!session?.access_token) {
      return;
    }

    try {
      const newCategory =
        await createCategory(
          session.access_token,
          {
            name:
              categoryData.name.trim(),

            color:
              categoryData.color ||
              "bg-purple-500",
          }
        );

      setCategories(
        (previous) => [
          ...previous,
          newCategory,
        ]
      );
    } catch (error) {
      console.error(
        "Error adding category:",
        error
      );

      window.alert(
        error?.message ||
          "Unable to add category."
      );
    }
  }

  /* =======================================================
     NAVIGATION
  ======================================================= */

  function handleNavigate(
    page
  ) {
    setCurrentPage(page);

    setSearchTerm("");

    setMobileSidebarOpen(false);
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  async function handleLogout() {
    try {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setSession(null);

      setNotes([]);

      setCategories([]);

      setViewingNote(null);

      setEditingNote(null);

      setIsEditorOpen(false);

      setSearchTerm("");

      setCurrentPage("notes");

      setMobileSidebarOpen(false);
    } catch (error) {
      console.error(
        "Error signing out:",
        error
      );

      window.alert(
        error?.message ||
          "Unable to sign out."
      );
    }
  }

  /* =======================================================
     AUTH LOADING
  ======================================================= */

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Loading NoteFlow...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     LOGIN PAGE
  ======================================================= */

  if (!session) {
    return (
      <AuthPage
        theme={theme}
        accentColor={accentColor}
      />
    );
  }

  /* =======================================================
     THEME
  ======================================================= */

  const isDark =
    theme === "dark";

  const mainBackground =
    isDark
      ? "bg-gray-950"
      : "bg-gray-50";

  /* =======================================================
     PAGE TITLE
  ======================================================= */

  const pageTitle =
    currentPage ===
    "favorites"
      ? "Favorites"
      : currentPage ===
        "pinned"
        ? "Pinned"
        : currentPage ===
          "trash"
          ? "Trash"
          : currentPage ===
            "settings"
            ? "Settings"
            : currentPage.startsWith(
                "category:"
              )
              ? categories.find(
                  (category) =>
                    `category:${category.id}` ===
                    currentPage
                )?.name ||
                "Category"
              : "All Notes";

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div
      className={`min-h-screen flex ${
        isDark
          ? "bg-gray-950 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* ===================================================
          MOBILE SIDEBAR
      =================================================== */}

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() =>
            setMobileSidebarOpen(
              false
            )
          }
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:hidden ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <Sidebar
          currentPage={
            currentPage
          }
          onNavigate={
            handleNavigate
          }
          onNewNote={
            handleNewNote
          }
          trashCount={
            trashCount
          }
          categories={
            categories
          }
          notes={notes}
          onAddCategory={
            handleAddCategory
          }
          theme={theme}
          accent={accent}
          onLogout={
            handleLogout
          }
          mobileOpen={
            mobileSidebarOpen
          }
          onClose={() =>
            setMobileSidebarOpen(
              false
            )
          }
        />
      </div>

      {/* ===================================================
          DESKTOP SIDEBAR
      =================================================== */}

      <div className="hidden lg:block">
        <Sidebar
          currentPage={
            currentPage
          }
          onNavigate={
            handleNavigate
          }
          onNewNote={
            handleNewNote
          }
          trashCount={
            trashCount
          }
          categories={
            categories
          }
          notes={notes}
          onAddCategory={
            handleAddCategory
          }
          theme={theme}
          accent={accent}
          onLogout={
            handleLogout
          }
          mobileOpen={false}
        />
      </div>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main
        className={`flex-1 min-w-0 min-h-screen ${mainBackground}`}
      >
        {/* TOP BAR */}

        <TopBar
          searchTerm={
            searchTerm
          }
          onSearchChange={
            setSearchTerm
          }
          darkMode={
            theme === "dark"
          }
          accent={accent}
          onMenuClick={() =>
            setMobileSidebarOpen(
              true
            )
          }
        />

        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* =================================================
              PAGE HEADER
          ================================================= */}

          {currentPage !==
            "settings" && (
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1
                    className={`text-2xl sm:text-3xl font-bold ${
                      isDark
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {pageTitle}
                  </h1>

                  <p
                    className={`mt-1 text-sm sm:text-base ${
                      isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {currentPage ===
                    "trash"
                      ? "Notes you've moved to the trash"
                      : currentPage ===
                        "favorites"
                        ? "Your favorite notes"
                        : currentPage ===
                          "pinned"
                          ? "Your pinned notes"
                          : searchTerm
                            ? `Search results for "${searchTerm}"`
                            : "Keep your thoughts organized"}
                  </p>
                </div>

                {/* DESKTOP NEW NOTE */}

                {currentPage ===
                  "notes" && (
                  <button
                    type="button"
                    onClick={
                      handleNewNote
                    }
                    className={`hidden sm:flex items-center gap-2 px-4 py-3 rounded-xl text-white font-semibold transition shadow-sm ${accent.button}`}
                  >
                    <span className="text-lg">
                      +
                    </span>

                    New Note
                  </button>
                )}
              </div>

              {/* MOBILE NEW NOTE */}

              {currentPage ===
                "notes" && (
                <button
                  type="button"
                  onClick={
                    handleNewNote
                  }
                  className={`sm:hidden mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold transition shadow-sm ${accent.button}`}
                >
                  <span className="text-lg">
                    +
                  </span>

                  New Note
                </button>
              )}
            </div>
          )}

          {/* =================================================
              LOADING
          ================================================= */}

          {loading &&
            currentPage !==
              "settings" && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div
                    className={`w-10 h-10 border-4 rounded-full animate-spin mx-auto ${
                      isDark
                        ? "border-gray-700 border-t-purple-500"
                        : "border-gray-200 border-t-purple-600"
                    }`}
                  />

                  <p
                    className={`mt-4 ${
                      isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    Loading notes...
                  </p>
                </div>
              </div>
            )}

          {/* =================================================
              SETTINGS
          ================================================= */}

          {!loading &&
            currentPage ===
              "settings" && (
              <Settings
                theme={theme}
                setTheme={
                  setTheme
                }
                accentColor={
                  accentColor
                }
                setAccentColor={
                  setAccentColor
                }
                accent={accent}
              />
            )}

          {/* =================================================
              NOTES
          ================================================= */}

          {!loading &&
            currentPage !==
              "settings" && (
              <NotesGrid
                notes={
                  filteredNotes
                }
                onEdit={
                  handleEditNote
                }
                onDelete={
                  handleDeleteNote
                }
                onRestore={
                  handleRestoreNote
                }
                onPermanentDelete={
                  handlePermanentDelete
                }
                onToggleFavorite={
                  handleToggleFavorite
                }
                onTogglePin={
                  handleTogglePin
                }
                onView={
                  handleViewNote
                }
                theme={theme}
                accent={accent}
              />
            )}
        </div>
      </main>

      {/* =====================================================
          NOTE EDITOR

          IMPORTANT FIX:
          editingNote={editingNote}
          NOT note={editingNote}
      ===================================================== */}

      {isEditorOpen && (
        <NoteEditor
          key={
            editingNote?.id ||
            "new-note"
          }
          editingNote={
            editingNote
          }
          categories={
            categories
          }
          onClose={
            handleCloseEditor
          }
          onSave={
            handleSaveNote
          }
          theme={theme}
          accent={accent}
        />
      )}

      {/* =====================================================
          NOTE VIEWER
      ===================================================== */}

      {viewingNote && (
        <NoteViewer
          note={
            viewingNote
          }
          onClose={() =>
            setViewingNote(null)
          }
          onEdit={
            handleEditNote
          }
          onDelete={
            handleDeleteNote
          }
          onToggleFavorite={
            handleToggleFavorite
          }
          onTogglePin={
            handleTogglePin
          }
          theme={theme}
          accent={accent}
        />
      )}
    </div>
  );
}

export default App;