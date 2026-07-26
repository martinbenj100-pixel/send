#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# NeonMail Pro v5 - Deploy Script
# Automatise le push sur GitHub et le déploiement sur Render
# ═══════════════════════════════════════════════════════════════════════════

set -e

echo "🚀 NeonMail Pro v5 - Deployment Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ───────────────────────────────────────────────────────────────────────────
# STEP 1: Vérifier git
# ───────────────────────────────────────────────────────────────────────────

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git n'est pas installé${NC}"
    exit 1
fi

echo -e "${BLUE}✓ Git trouvé${NC}"

# ───────────────────────────────────────────────────────────────────────────
# STEP 2: Configurer le repo
# ───────────────────────────────────────────────────────────────────────────

echo ""
echo -e "${YELLOW}📦 Configuration du repository${NC}"

if [ ! -d ".git" ]; then
    echo "Git repository non trouvé. Initialisation..."
    git init
    echo -e "${GREEN}✓ Repository initialisé${NC}"
else
    echo -e "${GREEN}✓ Repository existant trouvé${NC}"
fi

# Demander les infos GitHub
read -p "Ton username GitHub: " GITHUB_USER
read -p "Nom du repo (ex: neonmail-pro): " REPO_NAME

REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

# ───────────────────────────────────────────────────────────────────────────
# STEP 3: Ajouter et commiter les fichiers
# ───────────────────────────────────────────────────────────────────────────

echo ""
echo -e "${YELLOW}📝 Commiting les fichiers${NC}"

git add .

if [ -n "$(git status --porcelain)" ]; then
    echo "Fichiers à commiter:"
    git status --short
    
    read -p "Message de commit (ex: Initial commit): " COMMIT_MSG
    git commit -m "${COMMIT_MSG:-Initial commit: NeonMail Pro v5}"
    echo -e "${GREEN}✓ Fichiers committés${NC}"
else
    echo -e "${YELLOW}⚠️ Aucun changement à commiter${NC}"
fi

# ───────────────────────────────────────────────────────────────────────────
# STEP 4: Configurer la branche
# ───────────────────────────────────────────────────────────────────────────

echo ""
echo -e "${YELLOW}🌿 Configuration de la branche${NC}"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "Renaming branch to 'main'..."
    git branch -M main
    echo -e "${GREEN}✓ Branch renommée en main${NC}"
else
    echo -e "${GREEN}✓ Branch est déjà $CURRENT_BRANCH${NC}"
fi

# ───────────────────────────────────────────────────────────────────────────
# STEP 5: Ajouter remote
# ───────────────────────────────────────────────────────────────────────────

echo ""
echo -e "${YELLOW}🔗 Configurant le remote${NC}"

REMOTE_EXISTS=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$REMOTE_EXISTS" ]; then
    echo "Ajoutant remote..."
    git remote add origin "$REPO_URL"
    echo -e "${GREEN}✓ Remote ajouté${NC}"
elif [ "$REMOTE_EXISTS" != "$REPO_URL" ]; then
    echo "Mettant à jour le remote..."
    git remote set-url origin "$REPO_URL"
    echo -e "${GREEN}✓ Remote mis à jour${NC}"
else
    echo -e "${GREEN}✓ Remote déjà configuré${NC}"
fi

# ───────────────────────────────────────────────────────────────────────────
# STEP 6: Pousser sur GitHub
# ───────────────────────────────────────────────────────────────────────────

echo ""
echo -e "${YELLOW}📤 Poussant vers GitHub${NC}"

if git push -u origin main 2>/dev/null; then
    echo -e "${GREEN}✓ Code poussé sur GitHub${NC}"
    echo -e "${BLUE}→ Repo: ${REPO_URL}${NC}"
else
    echo -e "${RED}❌ Erreur lors du push${NC}"
    echo "Assure-toi que:"
    echo "1. Le repo existe sur GitHub"
    echo "2. Tu es authentifié (git config --list)"
    echo "3. Tu as les permissions"
    exit 1
fi

# ───────────────────────────────────────────────────────────────────────────
# STEP 7: Instructions Render
# ───────────────────────────────────────────────────────────────────────────

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Prêt pour Render!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Prochaines étapes:"
echo ""
echo "1️⃣  Va sur https://render.com"
echo "2️⃣  Crée un nouveau \"Static Site\" ou \"Web Service\""
echo "3️⃣  Relie ton repo GitHub: $REPO_URL"
echo "4️⃣  Laisse Render déployer automatiquement"
echo ""
echo "Besoin d'aide?"
echo "📖 Consulte DEPLOYMENT.md"
echo "🔗 Render Docs: https://render.com/docs"
echo "🔗 GitHub: $REPO_URL"
echo ""
echo -e "${GREEN}Bon déploiement! 🚀${NC}"
