# 🚀 Guide de déploiement - Notes App

Ce guide vous permet de déployer l'application Notes App en production.

## 📋 Architecture de déploiement

- **Backend** : Render (gratuit) ou Railway
- **Frontend** : Vercel (gratuit) ou Netlify
- **Base de données** : MongoDB Atlas (gratuit tier M0)

---

## 🗄️ Étape 1 : Configuration MongoDB Atlas

### 1.1 Créer un compte MongoDB Atlas

1. Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Créez un compte gratuit
3. Créez un nouveau cluster (choisissez le tier **M0 Free**)

### 1.2 Configurer la base de données

1. **Network Access** :
   - Cliquez sur "Network Access"
   - Ajoutez `0.0.0.0/0` pour autoriser toutes les IPs (ou l'IP de votre serveur)

2. **Database Access** :
   - Créez un utilisateur avec un mot de passe
   - Notez le nom d'utilisateur et le mot de passe

3. **Connection String** :
   - Cliquez sur "Connect" → "Connect your application"
   - Copiez la connection string
   - Remplacez `<password>` par votre mot de passe
   - Exemple : `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

---

## 🔧 Étape 2 : Déploiement du Backend (Render)

### 2.1 Préparer le backend

Le backend est déjà configuré avec `render.yaml`.

### 2.2 Déployer sur Render

1. **Créer un compte** sur [Render](https://render.com)

2. **Nouveau Web Service** :
   - Connectez votre dépôt GitHub
   - Sélectionnez le dépôt `notes_app`
   - Render détectera automatiquement `render.yaml`

3. **Variables d'environnement** à configurer dans Render :
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/notes-app?retryWrites=true&w=majority
   MONGO_DB=notes-app
   JWT_SECRET=votre-secret-jwt-tres-securise-changez-moi
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://votre-frontend.vercel.app
   API_BASE_URL=https://votre-backend.onrender.com/api
   UPLOAD_DIR=/opt/render/project/src/backend/uploads
   ```

4. **Build & Deploy** :
   - Build Command : `cd backend && npm install`
   - Start Command : `cd backend && npm start`
   - Root Directory : laisser vide (racine du repo)

5. **Notez l'URL** : `https://votre-backend.onrender.com`

---

## 🎨 Étape 3 : Déploiement du Frontend (Vercel)

### 3.1 Préparer le frontend

Le frontend est configuré avec `vercel.json`.

### 3.2 Déployer sur Vercel

1. **Créer un compte** sur [Vercel](https://vercel.com)

2. **Nouveau projet** :
   - Importez votre dépôt GitHub
   - Sélectionnez le dépôt `notes_app`
   - Framework Preset : **Create React App**
   - Root Directory : `frontend`

3. **Variables d'environnement** :
   ```
   REACT_APP_API_URL=https://votre-backend.onrender.com/api
   REACT_APP_TINYMCE_API_KEY=no-api-key
   ```
   ⚠️ **Important** : Remplacez `votre-backend.onrender.com` par l'URL réelle de votre backend

4. **Build Settings** :
   - Build Command : `npm run build`
   - Output Directory : `build`
   - Install Command : `npm install`

5. **Déployer** : Cliquez sur "Deploy"

6. **Notez l'URL** : `https://votre-app.vercel.app`

---

## 🔄 Étape 4 : Mise à jour des URLs

### 4.1 Mettre à jour le backend

Retournez sur Render et mettez à jour la variable :
```
CLIENT_URL=https://votre-app.vercel.app
```

### 4.2 Redéployer

- Render redéploiera automatiquement
- Vercel redéploiera automatiquement après le push

---

## 🐳 Alternative : Déploiement avec Docker

### Option 1 : Railway (Tout-en-un)

1. Créez un compte sur [Railway](https://railway.app)
2. Nouveau projet → Deploy from GitHub
3. Sélectionnez votre dépôt
4. Railway détectera `docker-compose.yml`
5. Configurez les variables d'environnement
6. Déployez !

### Option 2 : Render avec Docker

1. Créez un nouveau **Web Service** sur Render
2. Utilisez le Dockerfile du backend
3. Configurez les variables d'environnement

---

## ✅ Vérification du déploiement

### Backend

```bash
# Health check
curl https://votre-backend.onrender.com/api/health

# Devrait retourner : {"status":"ok","timestamp":"..."}
```

### Frontend

1. Ouvrez `https://votre-app.vercel.app`
2. Testez la création de compte
3. Testez la connexion
4. Créez une note

---

## 🔒 Sécurité en production

### Variables à changer absolument :

1. **JWT_SECRET** : Utilisez un secret fort (générez avec `openssl rand -base64 32`)
2. **MongoDB Password** : Mot de passe fort pour MongoDB
3. **CORS** : Vérifiez que `CLIENT_URL` correspond à votre frontend

### Recommandations :

- ✅ Utilisez HTTPS partout
- ✅ Activez les logs sur Render/Vercel
- ✅ Configurez des alertes de monitoring
- ✅ Faites des backups MongoDB réguliers

---

## 📊 Monitoring

### Render

- Dashboard : https://dashboard.render.com
- Logs en temps réel disponibles
- Métriques de performance

### Vercel

- Dashboard : https://vercel.com/dashboard
- Analytics disponibles
- Logs de déploiement

### MongoDB Atlas

- Monitoring : Dashboard MongoDB Atlas
- Alertes configurables
- Métriques de performance

---

## 🐛 Dépannage

### Backend ne démarre pas

1. Vérifiez les logs sur Render
2. Vérifiez que `MONGO_URI` est correct
3. Vérifiez que `JWT_SECRET` est défini
4. Vérifiez que le port est correct (10000 pour Render)

### Frontend ne se connecte pas au backend

1. Vérifiez `REACT_APP_API_URL` dans Vercel
2. Vérifiez les CORS dans le backend (`CLIENT_URL`)
3. Ouvrez la console du navigateur pour voir les erreurs

### Erreurs CORS

1. Vérifiez que `CLIENT_URL` dans le backend correspond à l'URL du frontend
2. Vérifiez que les URLs utilisent HTTPS en production

---

## 📝 Checklist de déploiement

- [ ] MongoDB Atlas configuré et accessible
- [ ] Backend déployé sur Render
- [ ] Variables d'environnement backend configurées
- [ ] Frontend déployé sur Vercel
- [ ] Variables d'environnement frontend configurées
- [ ] URLs mises à jour (CLIENT_URL, REACT_APP_API_URL)
- [ ] Tests de création de compte
- [ ] Tests de connexion
- [ ] Tests de création de notes
- [ ] HTTPS activé partout
- [ ] Secrets changés (JWT_SECRET)

---

## 🎉 Félicitations !

Votre application est maintenant déployée en production ! 🚀

**URLs à partager :**
- Frontend : https://votre-app.vercel.app
- Backend API : https://votre-backend.onrender.com/api
- Documentation API : https://votre-backend.onrender.com/api/docs

