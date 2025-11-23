import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { CATEGORY_CONFIG } from "../constants";

const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_API_KEY || "no-api-key";
const CATEGORY_OPTIONS = Object.entries(CATEGORY_CONFIG);

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

export default function CreateNote() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("personnel");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [previewName, setPreviewName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setAttachment(file || null);
    setPreviewName(file ? `${file.name} (${Math.round(file.size / 1024)} Ko)` : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("title", title.trim());
      payload.append("category", category);
      payload.append("content", content);
      if (attachment) {
        payload.append("image", attachment);
      }
      await API.post("/notes", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de créer la note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-500">Nouvelle note</p>
          <h1 className="text-2xl font-semibold">Créez une note riche avec fichiers joints</h1>
        </div>
        <Link
          to="/"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200"
        >
          ↩︎ Retour aux notes
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium">
            Titre
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Brief, stand-up, TODO..."
              required
              className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col text-sm font-medium">
            Catégorie
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              {CATEGORY_OPTIONS.map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Contenu enrichi</label>
          <Editor
            apiKey="2t9s8oq76q5xqsvm3peb054zd5rlreabqnagizdtkc9c47se"
            init={editorConfig}
            value={content}
            onEditorChange={(value) => setContent(value)}
          />
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-600">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Pièce jointe (PNG, JPG, GIF, PDF • 5 Mo max)
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.gif,.pdf"
              onChange={handleFileChange}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-medium file:text-blue-700 hover:file:bg-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
            {previewName && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                📎 {previewName}
              </span>
            )}
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isSubmitting ? "Création..." : "Enregistrer la note"}
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Tout est sauvegardé côté serveur (MongoDB + fichiers)
          </span>
        </div>
      </form>
    </section>
  );
}

