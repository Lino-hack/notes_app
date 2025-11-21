#!/bin/bash

# Script de vérification avant déploiement

echo "🔍 Vérification du projet avant déploiement..."
echo ""

# Vérifier les variables d'environnement
echo "📋 Variables d'environnement requises:"
echo "  Backend:"
echo "    - MONGO_URI"
echo "    - JWT_SECRET"
echo "    - CLIENT_URL"
echo "    - API_BASE_URL"
echo ""
echo "  Frontend:"
echo "    - REACT_APP_API_URL"
echo ""

# Vérifier que les tests passent
echo "🧪 Exécution des tests backend..."
cd backend
npm test || exit 1

echo ""
echo "✅ Tous les tests passent!"
echo "🚀 Prêt pour le déploiement!"

