# 🚀 Guide de Déploiement - NeonMail Pro v5

## 1️⃣ Préparation Locale

```bash
# Clone ou crée un nouveau repo
mkdir neonmail-pro
cd neonmail-pro

# Copie tous les fichiers du projet
# (index.html, README.md, package.json, server.js, etc.)

# Initialise Git
git init
git add .
git commit -m "Initial commit: NeonMail Pro v5 - Resend Edition"
git branch -M main
```

## 2️⃣ Pousser sur GitHub

### Option A : Nouveau repo

```bash
# Crée un repo vide sur https://github.com/new
# Puis:

git remote add origin https://github.com/TON_USERNAME/neonmail-pro.git
git push -u origin main
```

### Option B : Repo existant

```bash
git remote set-url origin https://github.com/TON_USERNAME/neonmail-pro.git
git push -u origin main
```

## 3️⃣ Déployer sur Render

### Option A : Static Site (Recommandé pour commencer)

1. Va sur [render.com](https://render.com)
2. Clique "New +"
3. Sélectionne "Static Site"
4. Connecte ton repo GitHub
5. Build Command: `npm install` (ou laisse vide)
6. Publish Directory: `.`
7. Deploy!

### Option B : Web Service avec Backend

1. Va sur [render.com](https://render.com)
2. Clique "New +"
3. Sélectionne "Web Service"
4. Connecte ton repo GitHub
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Variables d'environnement:
   ```
   RESEND_API_KEY=re_xxx...
   ```
8. Deploy!

### Option C : Blueprint (Automatique)

Si le fichier `render.yaml` est présent:

1. Va sur [render.com](https://render.com)
2. Clique "New +"
3. Sélectionne "Blueprint"
4. Sélectionne ton repo
5. Render déploie automatiquement les services configurés

## 4️⃣ Configuration Resend

1. Va sur [resend.com](https://resend.com)
2. Créé un compte gratuit
3. Génère une clé API (commence par `re_`)
4. Ajoute un domaine vérifiée
5. Copie la clé dans l'app NeonMail Pro

### Vérifier ton domaine

```
Type: CNAME
Host: default._domainkey.tondomaine.com
Value: [valeur de Resend]
```

## 5️⃣ Tester l'App

```bash
# Local
open index.html
# ou
python -m http.server 8000
# Visite http://localhost:8000

# Render
https://ton-app.onrender.com
```

## 🔒 Sécurité

- **Ne push jamais ta clé API** (utilise `.env`)
- **Ajoute `.env` au .gitignore** (déjà configuré)
- **Utilise HTTPS** pour les données sensibles
- **Régénère ta clé** si elle est compromise

## 🆘 Troubleshooting

### "Build failed on Render"
```bash
# Testa localement:
npm install
node server.js
# Puis regarde les logs Render
```

### "CORS error"
- Assure-toi que le backend est activé
- Vérifie les en-têtes CORS dans `server.js`

### "Clé API invalide"
- Vérifie que tu copies la clé entière (commence par `re_`)
- Régénère si nécessaire sur resend.com

## 📊 Monitoring

Render Dashboard:
- Logs en temps réel
- Metrics (CPU, RAM, etc.)
- Redéploiement automatique à chaque push

## 🔄 Updates

Pour mettre à jour l'app:

```bash
# Fais tes changements
git add .
git commit -m "Fix: description du changement"
git push origin main

# Render redéploie automatiquement! 🎉
```

## 📞 Support

- **Render**: https://render.com/docs
- **Resend**: https://resend.com/docs
- **GitHub**: https://github.com/help

---

**Prêt? C'est parti! 🚀**
