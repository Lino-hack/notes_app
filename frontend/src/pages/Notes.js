import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import NoteCard from "../components/NoteCard";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { CATEGORY_CONFIG } from "../constants";

const useDebouncedValue = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
};

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 6, hasMore: false });
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    sort: "latest",
    from: "",
    to: "",
    limit: 6,
    page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebouncedValue(filters.search);

  const categoryFilters = useMemo(
    () => [
      {
        value: "all",
        label: "Toutes",
        classes:
          "border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-100",
      },
      ...Object.entries(CATEGORY_CONFIG).map(([value, meta]) => ({
        value,
        label: meta.label,
        classes: meta.badge,
      })),
    ],
    []
  );

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await API.get("/notes/stats/overview");
      setStats(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Stats error", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {
          sort: filters.sort,
          category: filters.category,
          limit: filters.limit,
          page: filters.page,
        };
        if (debouncedSearch) params.search = debouncedSearch;
        if (filters.from) params.from = filters.from;
        if (filters.to) params.to = filters.to;

        const { data } = await API.get("/notes", { params });
        setNotes(data.notes);
        setMeta(data.meta);
      } catch (err) {
        setError(err.response?.data?.message || "Impossible de charger vos notes.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [debouncedSearch, filters.category, filters.sort, filters.from, filters.to, filters.page, filters.limit]);

  const updateFilters = (partial) => {
    setFilters((prev) => ({
      ...prev,
      ...partial,
      page: partial.page ?? 1,
    }));
  };

  const handleDeleteConfirmation = async () => {
    if (!noteToDelete) return;
    setIsDeleting(true);
    try {
      await API.delete(`/notes/${noteToDelete._id}`);
      setNotes((prev) => prev.filter((note) => note._id !== noteToDelete._id));
      setMeta((prev) => ({
        ...prev,
        total: Math.max(prev.total - 1, 0),
      }));
      await fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Suppression impossible.");
    } finally {
      setIsDeleting(false);
      setNoteToDelete(null);
    }
  };

  const statCards = [
    {
      label: "Total",
      value: stats?.totalNotes ?? 0,
      description: "Toutes les notes actives",
    },
    {
      label: "Travail",
      value: stats?.categories?.travail ?? 0,
      description: "Projets & réunions",
    },
    {
      label: "Personnel",
      value: stats?.categories?.personnel ?? 0,
      description: "Vie privée et perso",
    },
    {
      label: "Urgent",
      value: stats?.categories?.urgent ?? 0,
      description: "A traiter rapidement",
    },
    {
      label: "Pièces jointes",
      value: stats?.withAttachments ?? 0,
      description: "Notes avec fichiers",
    },
  ];

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-500">Dashboard</p>
          <h1 className="text-3xl font-semibold">Mes notes intelligentes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Recherche temps réel, filtres avancés, statistiques et gestion des pièces jointes.
          </p>
        </div>
        <Link
          to="/new"
          className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700"
        >
          ➕ Nouvelle note
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
            <p className="text-3xl font-semibold">{card.value}</p>
            <p className="text-xs text-slate-400">{card.description}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <SearchBar
              search={filters.search}
              setSearch={(value) => updateFilters({ search: value })}
              placeholder="Recherche plein texte (titre, contenu...)"
              className="w-full"
            />
          </div>
          <select
            value={filters.sort}
            onChange={(event) => updateFilters({ sort: event.target.value })}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="latest">📅 Plus récentes</option>
            <option value="oldest">🕰️ Plus anciennes</option>
            <option value="category">🏷️ Par catégorie</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {categoryFilters.map((chip) => {
            const isActive = filters.category === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => updateFilters({ category: chip.value })}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : chip.classes
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Depuis
            <input
              type="date"
              value={filters.from}
              onChange={(event) => updateFilters({ from: event.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
          </label>
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Jusqu&apos;à
            <input
              type="date"
              value={filters.to}
              onChange={(event) => updateFilters({ to: event.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/50 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={() => setNoteToDelete(note)}
            />
          ))}
        </div>
      )}

      {!loading && notes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-600 dark:text-slate-300">
          Aucune note ne correspond à vos filtres. Essayez de relâcher votre recherche.
        </div>
      )}

      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <span>
          Page {meta.page} — {meta.total} note{meta.total > 1 ? "s" : ""}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => updateFilters({ page: Math.max(meta.page - 1, 1) })}
            disabled={meta.page <= 1}
            className="rounded-full border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600"
          >
            ◀︎
          </button>
          <button
            type="button"
            onClick={() => updateFilters({ page: meta.page + 1 })}
            disabled={!meta.hasMore}
            className="rounded-full border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600"
          >
            ▶︎
          </button>
        </div>
      </div>

      <Modal
        show={Boolean(noteToDelete)}
        onClose={() => setNoteToDelete(null)}
        title="Supprimer cette note ?"
        actions={
          <button
            type="button"
            onClick={handleDeleteConfirmation}
            disabled={isDeleting}
            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </button>
        }
      >
        {noteToDelete ? (
          <p>
            Confirmez la suppression de <strong>{noteToDelete.title}</strong>. Cette action est
            irréversible.
          </p>
        ) : null}
      </Modal>
    </section>
  );
}
