# PowerShell script to push code to GitHub
# Make sure Git is installed before running this script

Write-Host "Checking Git installation..." -ForegroundColor Yellow

# Check if git is available
try {
    $gitVersion = git --version
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nInitializing Git repository..." -ForegroundColor Yellow
git init

Write-Host "`nAdding files to Git..." -ForegroundColor Yellow
git add .

Write-Host "`nCommitting changes..." -ForegroundColor Yellow
git commit -m "Setup new matchDetails API endpoint - removed old Radhe Exchange APIs"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Create a new repository on GitHub" -ForegroundColor White
Write-Host "2. Run these commands (replace with your repo URL):" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
