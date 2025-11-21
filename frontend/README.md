# Notes App – Frontend

Ce dossier contient la SPA React décrite dans le README racine :

| Script | Description |
|--------|-------------|
| `npm start` | Lance le serveur de dev sur http://localhost:3000 |
| `npm run build` | Build production (utilisé par Docker/nginx) |
| `npm test -- --watch=false` | Tests unitaires (React Testing Library) |

- Les variables d’environnement consommées côté React commencent par `REACT_APP_`.
- Tailwind CSS est configuré dans `tailwind.config.js` + `postcss.config.js`.
- La configuration spécifique (auth context, thème, services API) est documentée dans le README principal.
