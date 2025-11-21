import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-lg font-semibold">
          FEVEO Notes
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {isAuthenticated && (
            <>
              <Link
                to="/"
                className="rounded-full px-4 py-1.5 font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Tableau
              </Link>
              <Link
                to="/new"
                className="rounded-full bg-blue-600 px-4 py-1.5 font-medium text-white transition hover:bg-blue-700"
              >
                Ajouter
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline-flex rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                {user?.profile?.name || "Utilisateur"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-red-200 px-4 py-1.5 font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/40 dark:text-red-200 dark:hover:bg-red-500/10"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-slate-300 px-4 py-1.5 font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
