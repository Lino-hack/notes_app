import { Link } from "react-router-dom";
import { CATEGORY_CONFIG } from "../constants";
import { API_HOST } from "../services/api";

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export default function NoteCard({ note, onDelete = () => {} }) {
  const categoryMeta = CATEGORY_CONFIG[note.category];

  return (
    <article className="flex flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${categoryMeta?.badge}`}
        >
          {categoryMeta?.label || note.category}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Mis à jour {formatDate(note.updatedAt)}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-semibold">{note.title}</h3>

      <div
        className="prose prose-sm mt-3 max-w-none text-slate-700 dark:prose-invert dark:text-slate-100"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />

      {note.attachment?.url && (
        <a
          href={`${API_HOST}${note.attachment.url}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          📎 {note.attachment.filename}
        </a>
      )}

      <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium">
        <Link
          to={`/edit/${note._id}`}
          className="rounded-full border border-slate-300 px-4 py-1.5 text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          ✏️ Modifier
        </Link>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-full border border-red-200 px-4 py-1.5 text-red-600 transition hover:bg-red-50 dark:border-red-500/50 dark:text-red-200 dark:hover:bg-red-500/10"
        >
          🗑️ Supprimer
        </button>
      </div>
    </article>
  );
}
