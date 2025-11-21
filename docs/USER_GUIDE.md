# Guide utilisateur – Notes App

Ce document décrit le parcours complet côté utilisateur final (web app React).

## 1. Connexion & inscription
1. Depuis `http://localhost:3000`, choisissez **Créer un compte** si vous n’êtes pas encore inscrit.
2. Remplissez nom, email, mot de passe (≥ 8 caractères). L’application vous connecte automatiquement.
3. Pour revenir plus tard, utilisez la page **Connexion**. Les sessions sont persistées localement jusqu’à déconnexion.

## 2. Tableau de bord
Après connexion :
- Bandeau récapitulatif : total notes, répartition par catégorie, nombre de pièces jointes.
- Bouton ➕ pour créer une note.
- Barre de recherche plein texte (titre + contenu) avec réponse en temps réel (déclenchement après 400 ms).
- Filtres : catégories (pills colorées), période (date de/à), tri (récente, ancienne, par catégorie).
- Pagination : boutons ◀︎ ▶︎ pour naviguer par page (limite par défaut 6 notes).

## 3. Création d’une note
1. Cliquez sur **Nouvelle note**.
2. Renseignez le titre, choisissez une catégorie (`Travail`, `Personnel`, `Urgent`), puis saisissez le contenu via l’éditeur TinyMCE (styles, listes, liens, etc.).
3. Ajoutez optionnellement une pièce jointe (PNG/JPG/GIF/PDF, 5 Mo max). L’aperçu affiche nom + poids.
4. Enregistrez : vous êtes redirigé vers le tableau avec confirmation visuelle.

## 4. Édition / suppression
1. Depuis une carte note → **✏️ Modifier** pour ouvrir l’éditeur pré-rempli.
2. Vous pouvez remplacer la pièce jointe : l’ancienne est automatiquement supprimée du serveur.
3. Bouton **🗑️ Supprimer** dans la carte → fenêtre de confirmation (action irréversible).

## 5. Gestion des filtres et recherche
- **Recherche** : tapez un mot-clé, les résultats se mettent à jour après une courte pause (debounce).
- **Catégories** : boutons colorés (Toutes / Travail / Personnel / Urgent).
- **Période** : champs date ISO. L’API filtre selon `createdAt`.
- **Tri** :
  - `Plus récentes` (par défaut) : `createdAt desc`
  - `Plus anciennes` : `createdAt asc`
  - `Par catégorie` : ordre alphabétique + date

## 6. Mode sombre / clair
- Icône ☀️ / 🌙 dans l’en-tête permet de basculer instantanément. La préférence est mémorisée (localStorage) et appliquée sur tout le site.

## 7. Documentation API
- Pour les utilisateurs avancés, Swagger est disponible sur `http://localhost:5000/api/docs`.
- L’API nécessite un token JWT (envoyé dans `Authorization: Bearer ...`). Le frontend l’ajoute automatiquement.

## 8. FAQ rapide
| Problème | Solution |
|----------|----------|
| “Token invalide” | Reconnectez-vous. Les tokens expirent après 7 jours ou si l’utilisateur est supprimé. |
| “Pièce jointe refusée” | Vérifiez l’extension et la taille (<5 Mo). |
| “Aucune note visible” | Assurez-vous que vos filtres (dates, catégorie) ne sont pas trop restrictifs. |

Pour davantage de détails techniques ou scénarios QA, consultez le README principal.

