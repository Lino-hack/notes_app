# Gestion de projet – Notes App

Ce document décrit l’organisation recommandée pour piloter le projet (board, user stories, issues GitHub, PR, Definition of Done).

## 1. Board Trello/Jira

Un modèle importable est fourni dans `docs/trello-board-template.json` :

| Colonne | Description | Swimlanes suggérées |
|---------|-------------|---------------------|
| Backlog | Idées validées, non priorisées. | `Core`, `Nice-to-have`, `Tech debt`. |
| Ready | Prête à être prise (user story claire, estimée). | même swimlanes |
| In Progress | Tâche en cours (limite WIP = 2 / dev). | `Backend`, `Frontend`, `DevOps`. |
| Code Review | Pull request ouverte, en attente d’approbation. | reviewer assigné. |
| QA / Tests | Sur branche de recette (tests manuels/auto). | cas de test associés. |
| Done | Merge + déploiement effectué. | référence commit/pr. |

Chaque carte contient : `Titre (US-XX)`, description, critères d’acceptation, checklist technique, lien issue GitHub, estimation (story points).

## 2. User stories prioritaires

| ID | Description | Critères d’acceptation |
|----|-------------|------------------------|
| US-01 | En tant qu’utilisateur, je peux créer un compte et me connecter. | Formulaires validés, token stocké, rejet si email déjà utilisé. |
| US-02 | En tant qu’utilisateur, je gère mes notes (CRUD + pièces jointes). | Validation obligatoire du titre, upload < 5 Mo, retour JSON cohérent. |
| US-03 | En tant qu’utilisateur, je filtre/recherche mes notes en temps réel. | Recherche plein texte, filtres cumulables (cat, date, tri), pagination. |
| US-04 | En tant qu’utilisateur, je visualise des statistiques (totaux, catégories, pièces jointes). | Endpoint `/notes/stats/overview`, UI cartes de stats. |
| US-05 | En tant qu’utilisateur, je bascule en mode sombre/clair. | Préférence persistée, toutes les pages compatibles. |
| US-06 | En tant que DevOps, je lance toute la stack via Docker Compose. | `docker compose up` expose API + SPA + Mongo. |
| US-07 | En tant que responsable QA, je veux des tests Jest (>70% coverage). | `npm test` vert + rapport coverage partagé. |

## 3. Processus issues & PR GitHub

- **Issues** : `type` (`feat`, `bug`, `docs`, `chore`), `scope` (`backend`, `frontend`, `devops`), `priority` labels. Utiliser la convention `US-XX | Titre concis`.
- **Branches** : `feature/US-XX-description`, `fix/…`, `chore/…`.
- **Pull Requests** :
  - Template recommandé :

    ```
    ## Objet
    - …

    ## Tests
    - [ ] npm test backend
    - [ ] npm test frontend

    ## Checklist
    - [ ] Documentation mise à jour
    - [ ] Pas d’erreur ESLint
    - [ ] Screenshots (si UI)
    ```

  - 1 review approuvée minimum, rebase sur `main` obligatoire.
  - Lien vers l’issue / user story dans la description.

## 4. Definition of Done

- ✅ User story conforme + critères d’acceptation validés.
- ✅ Tests unitaires pertinents ajoutés (backend + frontend si applicable).
- ✅ Couverture globale Jest ≥ 70%.
- ✅ Lint sans erreur.
- ✅ Documentation (README, Swagger, guides) mise à jour.
- ✅ Capture ou courte démo ajoutée (si changement UX).
- ✅ Branche fusionnée via PR approuvée, workflow CI vert.

---

> Astuce : pour suivre les user stories côté Trello, importer `docs/trello-board-template.json`, puis relier chaque carte à son issue GitHub avec la fonctionnalité “Attachments → Trello/GitHub”.

