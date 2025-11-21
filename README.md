<div align="center">

# 📝 Notes App – Niveau 4

Application full-stack (Node.js + React) répondant au cahier des charges du niveau 4 : authentification sécurisée, gestion avancée des notes, statistiques, CI/CD et documentation complète.

</div>

---

## Sommaire
1. [Stack & Architecture](#stack--architecture)
2. [Fonctionnalités clés](#fonctionnalités-clés)
3. [Pré-requis & Variables d’environnement](#pré-requis--variables-denvironnement)
4. [Installation & Démarrage](#installation--démarrage)
5. [Tests, Qualité & Couverture](#tests-qualité--couverture)
6. [API & Documentation](#api--documentation)
7. [DevOps & Docker](#devops--docker)
8. [Gestion de projet & Livrables](#gestion-de-projet--livrables)
9. [Ressources utiles](#ressources-utiles)

---

## Stack & Architecture

- **Backend** : Node.js 20, Express 5, MongoDB/Mongoose, Multer, JWT, Swagger, Jest + Supertest.
- **Frontend** : React 19, React Router 6, Axios, TinyMCE, Tailwind CSS, Context API (auth + thème).
- **Qualité / DevOps** : ESLint (flat config), Jest (couverture >82%), Docker, Docker Compose, GitHub Actions CI.

```
notes-app/
├── backend/        # API REST, tests, Swagger
├── frontend/       # SPA React moderne
├── docker-compose.yml
├── .github/workflows/ci.yml
├── env.example
└── docs/
    ├── USER_GUIDE.md
    ├── PROJECT_MANAGEMENT.md
    ├── presentation-outline.md
    └── trello-board-template.json
```

---

## Fonctionnalités clés

### Backend
- Authentification JWT (register/login) avec hashing bcrypt.
- CRUD complet sur les notes avec validation (`express-validator`) et filtrage avancé.
- Catégories normalisées (`travail`, `personnel`, `urgent`) + statistiques agrégées.
- Recherche plein texte, filtres (dates, catégories, tri, pagination).
- Upload sécurisé (Multer + sanitation HTML).
- Documentation Swagger auto-hébergée (`/api/docs`).

### Frontend
- Interface responsive, dark/light mode, composants stylés (Tailwind).
- Tableau de bord avec statistiques en temps réel et recherche instantanée (debounce).
- Editeur riche TinyMCE (création/édition), gestion des pièces jointes.
- Filtres combinables (catégorie, période, tri) + pagination pilotée par l’API.
- Auth state global via Context + stockage persistant.

### DevOps & Gestion
- Docker Compose pour lancer Mongo + API + SPA.
- GitHub Actions (Node 20) pour `npm test` backend + build & tests frontend.
- Couverture Jest > 80% avec `mongodb-memory-server`.
- Documentation utilisateur & guide de projet (issues, board, user stories).

---

## Pré-requis & Variables d’environnement

| Outil | Version recommandée |
|-------|---------------------|
| Node.js | 20.x |
| npm | 10.x |
| MongoDB | 7.x (ou Docker) |
| Docker / Compose | ≥ 2.x (optionnel) |

1. Dupliquez le fichier `env.example` à la racine et renommez-le `.env`.
2. Renseignez les sections Backend & Frontend :
   ```env
   # Backend
   MONGO_URI=mongodb://localhost:27017
   MONGO_DB=notes-app
   JWT_SECRET=dev-secret
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   API_BASE_URL=http://localhost:5000/api
   UPLOAD_DIR=uploads
   PORT=5000

   # Frontend
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_TINYMCE_API_KEY=votre_cle (optionnelle)
   ```

---

## Installation & Démarrage

```bash
# 1. Dépendances
cd backend && npm install
cd ../frontend && npm install

# 2. Lancer MongoDB localement ou via Docker (voir section Dockers)

# 3. API (port 5000)
cd backend
npm run dev   # hot reload avec nodemon

# 4. Frontend (port 3000)
cd ../frontend
npm start
```

Endpoints principaux :
- API : `http://localhost:5000/api`
- Swagger : `http://localhost:5000/api/docs`
- Frontend : `http://localhost:3000`

---

## Tests, Qualité & Couverture

```bash
# Backend (Jest + Supertest + coverage 80%+)
cd backend
npm test

# Frontend (React Testing Library)
cd ../frontend
npm test -- --watch=false

# Lint (backend)
cd backend
npm run lint
```

Caractéristiques tests backend :
- Base Mongo isolée via `mongodb-memory-server`.
- Couverture globale actuelle : **92.5% statements / 80% branches** (voir `backend/coverage`).

---

## API & Documentation

- **Swagger/OpenAPI** : `backend/src/docs/swagger.js`
- Accès : `GET http://localhost:5000/api/docs`
- Routes principales :
  - `POST /api/auth/register` / `POST /api/auth/login`
  - `GET|POST /api/notes` (pagination, recherche, filtres)
  - `GET /api/notes/stats/overview`
  - `GET|PUT|DELETE /api/notes/:id`

Consultez `docs/USER_GUIDE.md` pour les scénarios utilisateurs détaillés (création, édition, filtres, mode sombre, etc.).

---

## DevOps & Docker

```bash
# Build & lancement complet
docker compose up --build

# Services exposés
- MongoDB : 27017
- Backend : http://localhost:5000
- Frontend (nginx) : http://localhost:3000
```

CI/CD :
- Workflow : `.github/workflows/ci.yml`
- Jobs : `backend (npm ci + npm test)` et `frontend (npm ci + npm run build + npm test -- --watch=false)`.
- Environnement Node 20 + cache npm.

---

## Gestion de projet & Livrables

| Livrable | Description | Où ? |
|----------|-------------|------|
| Board Trello/Jira | Colonne par statut + swimlanes (Backlog → QA → Done). Modèle importable fourni. | `docs/trello-board-template.json` + `docs/PROJECT_MANAGEMENT.md` |
| User stories / Issues | Stories priorisées, critères d’acceptation, labels GitHub. | `docs/PROJECT_MANAGEMENT.md` |
| Pull Requests | Checklist qualité + conventions de nommage. | `docs/PROJECT_MANAGEMENT.md` |
| Documentation utilisateur | Guide pas-à-pas avec captures clés & mode sombre. | `docs/USER_GUIDE.md` |
| Vidéo démo (3-5 min) | Script + plan de tournage. | `docs/presentation-outline.md` |
| Présentation (≤10 slides) | Structure slide-by-slide prête à remplir. | `docs/presentation-outline.md` |

N’oubliez pas de créer vos issues / PR GitHub en vous basant sur ce référentiel (labels fournis).

---

## 🚀 Déploiement

L'application peut être déployée en production avec plusieurs options :

### Option recommandée (Gratuite)

- **Backend** : [Render](https://render.com) (gratuit)
- **Frontend** : [Vercel](https://vercel.com) (gratuit)
- **Base de données** : [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit tier M0)

📖 **Guide complet** : Voir [DEPLOIEMENT.md](./DEPLOIEMENT.md)

### Déploiement rapide

1. **MongoDB Atlas** : Créez un cluster gratuit et récupérez la connection string
2. **Backend (Render)** :
   - Connectez votre repo GitHub
   - Render détectera automatiquement `render.yaml`
   - Configurez les variables d'environnement (voir DEPLOIEMENT.md)
3. **Frontend (Vercel)** :
   - Importez votre repo GitHub
   - Root directory : `frontend`
   - Variable d'environnement : `REACT_APP_API_URL=https://votre-backend.onrender.com/api`

### Fichiers de configuration

- `render.yaml` - Configuration Render pour le backend
- `vercel.json` - Configuration Vercel pour le frontend
- `netlify.toml` - Alternative Netlify
- `railway.json` - Alternative Railway

## Ressources utiles

- `docs/USER_GUIDE.md` : parcours utilisateur et FAQ.
- `docs/PROJECT_MANAGEMENT.md` : user stories, board, workflow Git, définition of done.
- `docs/presentation-outline.md` : pitch deck + script vidéo.
- `backend/coverage/lcov-report/index.html` : détails couverture.
- Swagger : `http://localhost:5000/api/docs`

Bon développement ! 🚀

