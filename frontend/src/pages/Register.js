import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", { name, email, password });
      login({ token: data.token, user: data.user });
      navigate("/");
    } catch (err) {
      // Gestion détaillée des erreurs
      if (!err.response) {
        // Erreur réseau (backend non disponible)
        setError("Impossible de contacter le serveur. Vérifiez que le backend est démarré.");
      } else if (err.response.status === 422) {
        // Erreurs de validation
        const validationErrors = err.response.data?.errors;
        if (validationErrors && validationErrors.length > 0) {
          const errorMessages = validationErrors.map(e => e.msg).join(", ");
          setError(`Erreur de validation: ${errorMessages}`);
        } else {
          setError(err.response.data?.message || "Données invalides");
        }
      } else if (err.response.status === 400) {
        // Erreur métier (email déjà utilisé, etc.)
        setError(err.response.data?.message || "Données invalides");
      } else {
        // Autres erreurs
        setError(err.response.data?.message || `Erreur serveur (${err.response.status})`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">Onboarding</p>
      <h1 className="mt-2 text-3xl font-semibold">Créez votre espace personnel</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Centralisez vos notes professionnelles et personnelles en toute sécurité.
      </p>

      <form onSubmit={handleRegister} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium">
          Nom complet
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <label className="block text-sm font-medium">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <label className="block text-sm font-medium">
          Mot de passe (8 caractères minimum)
          <input
            type="password"
            value={password}
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <button
          type="submit"
          disabled={loading || !name || !email || !password}
          className="w-full rounded-full bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Déjà inscrit ?{" "}
        <Link to="/login" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
          Connectez-vous
        </Link>
      </p>
    </section>
  );
}
