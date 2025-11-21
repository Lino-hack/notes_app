export default function Modal({ show, onClose, title, children, actions = null }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 px-4 backdrop-blur">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          {actions}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
