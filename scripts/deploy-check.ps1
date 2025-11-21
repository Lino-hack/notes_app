# Script PowerShell de vérification avant déploiement

Write-Host "🔍 Vérification du projet avant déploiement..." -ForegroundColor Cyan
Write-Host ""

# Vérifier les variables d'environnement
Write-Host "📋 Variables d'environnement requises:" -ForegroundColor Yellow
Write-Host "  Backend:"
Write-Host "    - MONGO_URI"
Write-Host "    - JWT_SECRET"
Write-Host "    - CLIENT_URL"
Write-Host "    - API_BASE_URL"
Write-Host ""
Write-Host "  Frontend:"
Write-Host "    - REACT_APP_API_URL"
Write-Host ""

# Vérifier que les tests passent
Write-Host "🧪 Exécution des tests backend..." -ForegroundColor Yellow
Set-Location backend
npm test
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Les tests ont échoué!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Tous les tests passent!" -ForegroundColor Green
Write-Host "🚀 Prêt pour le déploiement!" -ForegroundColor Green

