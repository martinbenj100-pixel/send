# 🚀 NeonMail Pro v5 - Resend Edition

**Interface ultramoderne pour envoyer des emails en masse via l'API Resend**

![Version](https://img.shields.io/badge/version-5.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Resend](https://img.shields.io/badge/Resend-API-purple)

---

## ✨ Caractéristiques

- **🔐 Authentification Resend API** - Validez votre clé directement dans l'app
- **📧 Envoi en masse** - Supportez des milliers de destinataires
- **⏱️ Délais configurables** - 1s à 5min entre chaque envoi
- **🎨 Interface moderne** - Design cyberpunk avec onglets séparés
- **📊 Suivi en temps réel** - Console d'envoi avec polling
- **💾 Profils sauvegardés** - Mémorisez vos configurations
- **📱 Responsive** - Mobile, tablet, desktop
- **⚡ Background mode** - L'envoi continue même après fermeture

---

## 🛠️ Tech Stack

- **Frontend** : HTML5 + CSS3 + Vanilla JavaScript
- **API** : Resend (https://resend.com)
- **Backend** : Node.js + Express (optionnel)
- **Storage** : LocalStorage / SessionStorage

---

## 🚀 Quick Start

### Local Development

```bash
# Clone le repo
git clone https://github.com/yourusername/neonmail-pro.git
cd neonmail-pro

# Ouvre l'HTML directement
open index.html
# ou
python -m http.server 8000
# Puis visite http://localhost:8000
```

### Obtenir une clé Resend API

1. Va sur [resend.com](https://resend.com)
2. Crée un compte gratuit
3. Génère une clé API depuis le dashboard
4. Assure-toi qu'un domaine est vérifié
5. Colle la clé dans l'app (commence par `re_`)

---

## 📦 Déploiement sur Render.com

### 1. Push sur GitHub

```bash
git init
git add .
git commit -m "Initial commit: NeonMail Pro v5"
git branch -M main
git remote add origin https://github.com/yourusername/neonmail-pro.git
git push -u origin main
```

### 2. Déployer sur Render

1. **Crée une account Render** : https://render.com
2. **Crée un nouveau Static Site**
   - Relie ton repo GitHub
   - Build Command: `npm install` (optionnel)
   - Publish Directory: `.`
3. **Variables d'environnement** (optionnel)
   - `RESEND_API_KEY` (pour backend)
4. **Deploy** - Render va automatiquement builder et deployer

### Alternative : Web Service (avec backend Node.js)

Si tu veux un backend pour les envois en arrière-plan :

```bash
# 1. Crée un Web Service sur Render
# 2. Lie ton repo GitHub
# 3. Build Command: npm install
# 4. Start Command: node server.js
# 5. Environment: RESEND_API_KEY=re_xxx...
```

---

## 📋 Structure de Fichiers

```
neonmail-pro/
├── index.html              # APP principale (NeonMail Pro v5)
├── README.md              # Documentation
├── server.js              # Backend optionnel (Node.js)
├── package.json           # Dépendances
└── .gitignore            # Fichiers à ignorer
```

---

## 🔧 Configuration

### Frontend Only

- Aucune configuration requise
- Authentification directe via clé API
- Données stockées en cache navigateur (SessionStorage)

### Avec Backend Node.js

1. **Install dépendances**
```bash
npm install express cors dotenv axios
```

2. **Configure `.env`**
```env
RESEND_API_KEY=re_xxx...
PORT=3000
```

3. **Lance le serveur**
```bash
node server.js
```

---

## 📱 Utilisation

### Workflow rapide

1. **🔐 Onglet Auth**
   - Colle ta clé API Resend
   - Clique "Valider la clé"

2. **⚙ Onglet Config**
   - Rentre ton domaine vérifiée
   - Rentre le "From Name" (optionnel)
   - Teste l'envoi

3. **📋 Onglet Liste**
   - Colle tes emails
   - Configure le délai
   - Sélectionne les actifs

4. **✉ Onglet Message**
   - Rédige le sujet
   - Rédige le corps (HTML ou texte)
   - Utilise {{name}} et {{email}} comme variables

5. **🚀 Lance l'envoi**
   - Clique "Lancer"
   - Ferme l'app si tu veux (continue en arrière-plan)
   - Consulte la console

---

## 🎨 Personnalisation

### Couleurs
Modifie les variables CSS dans `<style>` :

```css
:root {
    --cyan: #00d4ff;
    --purple: #a855f7;
    --green: #00ff88;
    --red: #ff3b5c;
    /* ... */
}
```

### Domaines Resend
Assure-toi que tes domaines sont vérifiés dans Resend Dashboard

---

## ⚠️ Sécurité

- **Ne partage jamais ta clé API** (commence par `re_`)
- **SessionStorage** : Données stockées localement, perdues à la fermeture
- **HTTPS Only** : Recommandé pour les données sensibles
- **Rate Limits** : Resend a des limites selon ton plan

---

## 🐛 Troubleshooting

### "Clé API invalide"
- Vérifie que ta clé commence par `re_`
- Regénère la clé si elle est expirée
- Teste sur resend.com directement

### "Domaine non vérifié"
- Va sur Resend Dashboard
- Ajoute ton domaine
- Complète les vérifications DNS

### "Email non livré"
- Vérifie le dossier Spam/Indésirables
- Teste avec l'onglet "Test de connexion"
- Regarde la console pour les erreurs

---

## 📊 Limites et Quotas

| Plan Resend | Emails/jour | Domaines | Support |
|-------------|-------------|----------|---------|
| Free        | 100         | 1        | Gratuit |
| Pro         | Illimité    | 10+      | Payant  |

Consulte [Resend Pricing](https://resend.com/pricing) pour plus.

---

## 🤝 Contributing

1. Fork le repo
2. Crée ta branche (`git checkout -b feature/amazing`)
3. Commit tes changements
4. Push et crée une PR

---

## 📄 License

MIT © 2025 NeonMail Pro

---

## 🔗 Liens Utiles

- [Resend Documentation](https://resend.com/docs)
- [Render Docs](https://render.com/docs)
- [GitHub Pages](https://pages.github.com)
- [Problèmes Resend](https://resend.com/support)

---

## 📞 Support

- 📧 Email support via Resend Dashboard
- 🐛 Reporte les bugs sur GitHub Issues
- 💬 Discussions sur GitHub Discussions

---

**Bon envoi ! 🚀**
