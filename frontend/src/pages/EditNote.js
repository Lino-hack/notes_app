import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API, { API_HOST } from "../services/api";
import Loader from "../components/Loader";
import { CATEGORY_CONFIG } from "../constants";

const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_API_KEY || "no-api-key";
const editorConfig = {
  height: 360,
  menubar: false,
  plugins:
    "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
  toolbar:
    "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
  content_style:
    'body { font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size:16px }',
};

export default function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("personnel");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await API.get(`/notes/${id}`);
        const { note } = data;
        setTitle(note.title);
        setCategory(note.category);
        setContent(note.content);
        setExistingAttachment(note.attachment || null);
      } catch (err) {
        setError(err.response?.data?.message || "Impossible de charger la note.");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("title", title.trim());
      payload.append("category", category);
      payload.append("content", content);
      if (attachment) {
        payload.append("image", attachment);
      }

      await API.put(`/notes/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de mettre à jour la note.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-widest text-amber-500">Edition</p>
          <h1 className="text-2xl font-semibold">Mettre à jour la note</h1>
        </div>
        <Link
          to="/"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200"
        >
          ↩︎ Retour
        </Link>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium">
          Titre
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        <label className="block text-sm font-medium">
          Catégorie
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            {Object.entries(CATEGORY_CONFIG).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
        </label>

        <div>
          <label className="mb-2 block text-sm font-medium">Contenu enrichi</label>
          <Editor
            apiKey={TINYMCE_API_KEY}
            init={editorConfig}
            value={content}
            onEditorChange={(value) => setContent(value)}
          />
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-600">
          <p className="text-sm font-medium">Pièce jointe</p>
          {existingAttachment ? (
            <a
              href={`${API_HOST}${existingAttachment.url}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              📎 {existingAttachment.filename}
            </a>
          ) : (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Aucune pièce jointe enregistrée
            </p>
          )}
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.gif,.pdf"
            onChange={(event) => setAttachment(event.target.files?.[0] || null)}
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-amber-50 file:px-3 file:py-2 file:font-medium file:text-amber-800 hover:file:bg-amber-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2 font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-amber-300"
        >
          {saving ? "Enregistrement..." : "Mettre à jour"}
        </button>
      </form>
    </section>
  );
}
