# 🚀 Guide de démarrage rapide

## ✅ Vérifications effectuées

- ✅ **Frontend** : Compilation réussie (93.98 kB JS, 4.58 kB CSS)
- ✅ **Backend** : Tests passent (16/16, couverture 92.56%)
- ✅ **Configuration** : Fichiers .env créés

## 📋 Pour démarrer l'application complète

### Option 1 : Avec Docker Compose (Recommandé)

```bash
# 1. Démarrer Docker Desktop sur Windows

# 2. Lancer tous les services
docker-compose up -d

# 3. Vérifier que tout fonctionne
docker-compose ps

# 4. Accéder à l'application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
# Swagger: http://localhost:5000/api/docs
```

### Option 2 : Mode développement local

#### Prérequis
- MongoDB installé et démarré localement
- Node.js 20+

#### Étapes

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
# Le serveur démarre sur http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
# L'application s'ouvre sur http://localhost:3000
```

**Terminal 3 - MongoDB (si pas déjà démarré):**
```bash
# Windows (si MongoDB est installé)
mongod
```

## 🔍 Vérification

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5000/api/health
   # Devrait retourner: {"status":"ok","timestamp":"..."}
   ```

2. **Frontend:**
   - Ouvrir http://localhost:3000
   - Vous devriez voir la page de connexion

3. **API Documentation:**
   - Ouvrir http://localhost:5000/api/docs
   - Swagger UI devrait s'afficher

## 🐛 Dépannage

### Backend ne démarre pas
- Vérifier que MongoDB est démarré
- Vérifier le fichier `backend/.env` existe
- Vérifier le port 5000 n'est pas utilisé

### Frontend ne compile pas
- Supprimer `node_modules` et `package-lock.json`
- Réinstaller: `npm install`
- Vérifier Node.js version: `node --version` (devrait être 20+)

### MongoDB non disponible
- Installer MongoDB Community Edition
- Ou utiliser Docker: `docker run -d -p 27017:27017 mongo:7.0`

## 📝 Notes

- Le fichier `.env` dans `backend/` a été créé automatiquement depuis `env.example`
- Les tests backend peuvent être lancés avec: `cd backend && npm test`
- Les tests frontend peuvent être lancés avec: `cd frontend && npm test`

