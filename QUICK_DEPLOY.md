# ⚡ Déploiement rapide - 10 minutes

Guide ultra-rapide pour déployer l'application en production.

## 🎯 Objectif

Déployer l'application en **10 minutes** avec des services gratuits.

---

## 📝 Checklist rapide

- [ ] Compte MongoDB Atlas (2 min)
- [ ] Backend sur Render (3 min)
- [ ] Frontend sur Vercel (3 min)
- [ ] Configuration des URLs (2 min)

---

## 1️⃣ MongoDB Atlas (2 minutes)

1. Allez sur https://www.mongodb.com/cloud/atlas/register
2. Créez un compte
3. Créez un cluster **M0 Free**
4. **Network Access** → Add IP Address → `0.0.0.0/0` (Allow All)
5. **Database Access** → Add New Database User
   - Username : `notesapp`
   - Password : (générez un mot de passe fort)
6. **Connect** → Connect your application
7. Copiez la connection string
8. Remplacez `<password>` par votre mot de passe
9. Ajoutez `/notes-app` à la fin : `mongodb+srv://...mongodb.net/notes-app?retryWrites=true&w=majority`

✅ **Connection string prête** : `mongodb+srv://notesapp:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/notes-app?retryWrites=true&w=majority`

---

## 2️⃣ Backend sur Render (3 minutes)

1. Allez sur https://render.com et créez un compte
2. **New** → **Web Service**
3. Connectez votre repo GitHub `Lino-hack/notes_app`
4. Render détectera automatiquement la configuration
5. **Variables d'environnement** à ajouter :

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://notesapp:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/notes-app?retryWrites=true&w=majority
MONGO_DB=notes-app
JWT_SECRET=changez-moi-par-un-secret-tres-securise-123456789
JWT_EXPIRES_IN=7d
CLIENT_URL=https://votre-app.vercel.app
API_BASE_URL=https://votre-backend.onrender.com/api
UPLOAD_DIR=/opt/render/project/src/backend/uploads
```

⚠️ **Note** : Remplacez `VOTRE_MOT_DE_PASSE` et générez un `JWT_SECRET` fort.

6. **Build Command** : `cd backend && npm install`
7. **Start Command** : `cd backend && npm start`
8. Cliquez sur **Create Web Service**
9. Attendez le déploiement (2-3 minutes)
10. **Notez l'URL** : `https://votre-backend.onrender.com`

✅ **Backend déployé** !

---

## 3️⃣ Frontend sur Vercel (3 minutes)

1. Allez sur https://vercel.com et créez un compte
2. **Add New** → **Project**
3. Importez votre repo GitHub `Lino-hack/notes_app`
4. **Framework Preset** : Create React App
5. **Root Directory** : `frontend`
6. **Environment Variables** :

```
REACT_APP_API_URL=https://votre-backend.onrender.com/api
REACT_APP_TINYMCE_API_KEY=no-api-key
```

⚠️ **Important** : Remplacez `votre-backend.onrender.com` par l'URL réelle de votre backend Render.

7. Cliquez sur **Deploy**
8. Attendez le déploiement (1-2 minutes)
9. **Notez l'URL** : `https://votre-app.vercel.app`

✅ **Frontend déployé** !

---

## 4️⃣ Configuration finale (2 minutes)

### Mettre à jour le backend

1. Retournez sur Render
2. Allez dans **Environment** de votre service
3. Mettez à jour `CLIENT_URL` :
   ```
   CLIENT_URL=https://votre-app.vercel.app
   ```
4. Render redéploiera automatiquement

### Mettre à jour le frontend (si nécessaire)

Si l'URL du backend a changé, mettez à jour `REACT_APP_API_URL` dans Vercel et redéployez.

---

## ✅ Vérification

### Test du backend

```bash
curl https://votre-backend.onrender.com/api/health
```

Devrait retourner : `{"status":"ok","timestamp":"..."}`

### Test du frontend

1. Ouvrez https://votre-app.vercel.app
2. Créez un compte
3. Connectez-vous
4. Créez une note

---

## 🎉 C'est fait !

Votre application est maintenant en production ! 🚀

**URLs à partager :**
- 🌐 Frontend : https://votre-app.vercel.app
- 🔧 Backend API : https://votre-backend.onrender.com/api
- 📚 Documentation API : https://votre-backend.onrender.com/api/docs

---

## 🐛 Problèmes courants

### Backend ne démarre pas
- Vérifiez que `MONGO_URI` est correct
- Vérifiez les logs sur Render

### Frontend ne se connecte pas
- Vérifiez `REACT_APP_API_URL` dans Vercel
- Vérifiez `CLIENT_URL` dans Render
- Ouvrez la console du navigateur (F12)

### Erreurs CORS
- Assurez-vous que `CLIENT_URL` correspond exactement à l'URL Vercel
- Utilisez HTTPS partout

---

## 📚 Documentation complète

Pour plus de détails, consultez [DEPLOIEMENT.md](./DEPLOIEMENT.md)

