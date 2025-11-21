export default function SearchBar({ search, setSearch, placeholder, className = "" }) {
  return (
    <input
      className={`p-3 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-white ${className}`}
      placeholder={placeholder || "Recherche..."}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
