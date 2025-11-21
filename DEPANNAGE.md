# 🔧 Dépannage - Erreur "Impossible de créer le compte"

## ✅ Corrections apportées

1. **Messages d'erreur améliorés** : Le frontend affiche maintenant des messages détaillés
2. **Gestion des erreurs MongoDB** : Le backend détecte si MongoDB n'est pas disponible
3. **Validation détaillée** : Les erreurs de validation sont maintenant affichées

## 🔍 Diagnostic

### Vérifier que le backend est démarré

```bash
# Vérifier si le backend répond
curl http://localhost:5000/api/health

# Ou dans PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/api/health"
```

**Si le backend ne répond pas :**

1. **Démarrer le backend :**
   ```bash
   cd backend
   npm start
   ```

2. **Vérifier les logs** pour voir les erreurs MongoDB

### Vérifier que MongoDB est disponible

Le backend a besoin de MongoDB pour fonctionner. Deux options :

#### Option 1 : Docker Compose (Recommandé)
```bash
# Démarrer MongoDB avec Docker
docker-compose up -d mongo

# Vérifier que MongoDB est démarré
docker-compose ps
```

#### Option 2 : MongoDB local
```bash
# Si MongoDB est installé localement
mongod

# Vérifier la connexion
mongosh
```

### Vérifier la configuration

Le fichier `backend/.env` doit contenir :
```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB=notes-app
JWT_SECRET=change-me
PORT=5000
```

## 🐛 Messages d'erreur courants

### "Impossible de contacter le serveur"
- **Cause** : Le backend n'est pas démarré
- **Solution** : Démarrer le backend avec `cd backend && npm start`

### "Base de données non disponible"
- **Cause** : MongoDB n'est pas démarré ou inaccessible
- **Solution** : Démarrer MongoDB (voir ci-dessus)

### "Email déjà utilisé"
- **Cause** : Un compte existe déjà avec cet email
- **Solution** : Utiliser un autre email ou vous connecter

### "Erreur de validation: ..."
- **Cause** : Les données ne respectent pas les règles
  - Nom : minimum 2 caractères
  - Email : format valide
  - Mot de passe : minimum 8 caractères
- **Solution** : Corriger les champs selon les messages affichés

## 📝 Test rapide

1. **Démarrer MongoDB :**
   ```bash
   docker-compose up -d mongo
   ```

2. **Démarrer le backend :**
   ```bash
   cd backend
   npm start
   ```
   
   Vous devriez voir : `🌿 MongoDB connecté !` et `Serveur lancé sur le port 5000`

3. **Démarrer le frontend :**
   ```bash
   cd frontend
   npm start
   ```

4. **Tester la création de compte :**
   - Ouvrir http://localhost:3000/register
   - Remplir le formulaire
   - Les erreurs détaillées s'afficheront maintenant

## 🔍 Logs utiles

Pour voir les erreurs détaillées du backend, regardez la console où vous avez lancé `npm start` dans le dossier `backend`.

Les erreurs MongoDB apparaîtront comme :
```
❌ Erreur MongoDB : connect ECONNREFUSED 127.0.0.1:27017
```

