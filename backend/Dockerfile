# 1. Image Node.js officielle
FROM node:20-alpine

# 2. Créer le dossier de travail
WORKDIR /app

# 3. Copier package.json et package-lock.json
COPY package*.json ./

# 4. Installer les dépendances
RUN npm install

# 5. Copier le reste du code
COPY . .

# 6. Exposer le port
EXPOSE 5000

# 7. Commande pour démarrer le serveur
CMD ["node", "src/server.js"]
