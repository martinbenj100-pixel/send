# 📦 NeonMail Pro v5 - Résumé du Projet

## ✨ Qu'est-ce que tu as reçu?

Un **email marketing app moderne et professionnel** prêt à être déployé sur GitHub et Render.

---

## 📁 Fichiers Inclus

### 🎨 Interface Frontend
- **index.html** - App principale (55 KB)
  - Design cyberpunk moderne
  - 4 onglets : Auth, Config, Liste, Message
  - Console d'envoi en temps réel
  - Responsive (mobile + desktop)
  - Validation Resend API intégrée

### 📚 Documentation
- **README.md** - Guide complet du projet
- **DEPLOYMENT.md** - Guide pas-à-pas pour GitHub + Render
- **PROJECT_SUMMARY.md** - Ce fichier

### ⚙️ Configuration
- **package.json** - Dépendances Node.js
- **render.yaml** - Configuration Render (optionnel)
- **.env.example** - Variables d'environnement
- **.gitignore** - Fichiers à ignorer

### 🔧 Backend (Optionnel)
- **server.js** - Backend Node.js/Express
  - Gestion des envois en arrière-plan
  - Queue et polling
  - API Resend intégrée
  - Pause/Resume/Stop des envois

### 🚀 Déploiement
- **deploy.sh** - Script d'automatisation Git

---

## 🎯 Caractéristiques Principales

### ✅ Frontend
- ✓ Authentification Resend API directe
- ✓ Validation de clé en temps réel
- ✓ 4 onglets intelligents (Auth, Config, Destinataires, Message)
- ✓ Envoi immédiat ou via backend
- ✓ Gestion des destinataires (ajouter, retirer, filtrer)
- ✓ Délais configurables (1s à 5min)
- ✓ Template variables: {{email}}, {{name}}, {{RANDOM}}
- ✓ Mode HTML ou texte brut
- ✓ Profils sauvegardés
- ✓ Console d'envoi avec logs
- ✓ Barre de progression
- ✓ Statut en temps réel

### ✅ Backend (Optionnel)
- ✓ Traitement asynchrone des envois
- ✓ File d'attente (queue)
- ✓ Pause/Resume/Stop
- ✓ Logs avec timestamps
- ✓ Rate limiting intégré
- ✓ Placeholders personnalisés
- ✓ Gestion des erreurs

### ✅ Sécurité
- ✓ Clé API stockée en SessionStorage
- ✓ .env non commité (via .gitignore)
- ✓ CORS configuré
- ✓ Input validation
- ✓ No password hardcoded

---

## 🚀 Démarrage Rapide

### 1. Clone et Configure
```bash
# Crée un dossier
mkdir neonmail-pro && cd neonmail-pro

# Copie les fichiers du projet

# Initialise Git
git init
```

### 2. Lance Localement
```bash
# Option A : Frontend uniquement
open index.html
# ou
python -m http.server 8000

# Option B : Avec backend
npm install
node server.js
```

### 3. Obtiens ta clé Resend
1. Va sur https://resend.com
2. Crée un compte gratuit
3. Génère une clé API (commence par `re_`)
4. Vérifie un domaine

### 4. Déploie sur Render
```bash
# Via script
bash deploy.sh

# Ou manuellement:
git remote add origin https://github.com/toi/neonmail-pro.git
git push -u origin main

# Puis sur render.com :
# - New Static Site
# - Connecte ton repo
# - Deploy!
```

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      NEONMAIL PRO v5                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │    Frontend      │              │    Backend       │        │
│  │  (index.html)    │◄─────API────►│   (server.js)    │        │
│  │                  │              │                  │        │
│  │ • Auth Tab       │              │ • Send Queue     │        │
│  │ • Config Tab     │              │ • Polling Loop   │        │
│  │ • Recipients     │              │ • Rate Limiting  │        │
│  │ • Composer       │              │ • Logging        │        │
│  └──────────────────┘              └──────────────────┘        │
│           │                                 │                   │
│           │                    ┌────────────┘                   │
│           │                    │                                │
│           └────────┬───────────┼─── SessionStorage             │
│                    │           │     LocalStorage              │
│                    ▼           ▼                                │
│              ┌─────────────────────────┐                        │
│              │    Resend API           │                        │
│              │  (https://resend.com)   │                        │
│              └─────────────────────────┘                        │
│                         │                                       │
│                         ▼                                       │
│              ┌─────────────────────────┐                        │
│              │   Email Delivery        │                        │
│              │  (SMTP/Resend Service)  │                        │
│              └─────────────────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💾 Structure des Données

### Destinataire
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "active": true,
  "status": "pending|sent|error"
}
```

### Email Message
```json
{
  "subject": "Welcome!",
  "body": "Hi {{name}}, welcome to NeonMail!",
  "html": false
}
```

### Send Config
```json
{
  "mode": "resend",
  "resendKey": "re_xxx...",
  "fromEmail": "noreply@domain.com",
  "fromName": "My Company",
  "delayMs": 5000,
  "mail": { subject, body, html },
  "recipients": [ ... ]
}
```

---

## 🔐 Variables d'Environnement

| Variable | Défaut | Notes |
|----------|--------|-------|
| `RESEND_API_KEY` | - | Clé API Resend |
| `PORT` | 3000 | Port du serveur |
| `NODE_ENV` | production | Mode d'exécution |

---

## 📈 Limites et Quotas

### Plan Resend Free
- 100 emails/jour
- 1 domaine
- Support gratuit

### Plan Resend Pro
- Illimité
- 10+ domaines
- Support prioritaire

Consulte [Resend Pricing](https://resend.com/pricing)

---

## 🎯 Cas d'Usage

✓ Newsletter marketing
✓ Notifications transactionnelles
✓ Confirmations d'inscription
✓ Rappels d'événements
✓ Campagnes d'email
✓ Alertes automatisées
✓ Reports & digests

---

## 🛠️ Customisation

### Couleurs
Édite les variables CSS dans `<style>`:
```css
--cyan: #00d4ff;
--purple: #a855f7;
--green: #00ff88;
```

### Texte
Les labels et messages sont en français, modifiables dans le HTML.

### Domaines Resend
Vérifie les domaines dans le dashboard Resend pour que les emails soient livrés.

---

## 📞 Support & Ressources

| Ressource | URL |
|-----------|-----|
| **Resend** | https://resend.com |
| **Resend Docs** | https://resend.com/docs |
| **Render** | https://render.com |
| **Render Docs** | https://render.com/docs |
| **GitHub** | https://github.com |

---

## 🚀 Prochaines Étapes

1. **Deploy sur Render**
   ```bash
   bash deploy.sh
   ```

2. **Obtiens ta clé Resend**
   - Visite https://resend.com
   - Crée un compte
   - Génère une clé API

3. **Lance l'app**
   - Va sur https://ton-app.onrender.com
   - Colle ta clé API
   - Commence à envoyer!

4. **Personnalise**
   - Édite les couleurs
   - Change les domaines
   - Ajoute tes templates

---

## ❓ FAQ

**Q: Puis-je utiliser sans backend?**
A: Oui! Le frontend fonctionne seul. Le backend est optionnel pour l'envoi en arrière-plan.

**Q: Comment sauvegarder les emails?**
A: Actuellement ils sont en mémoire. Pour la persistence, ajoute une base de données.

**Q: Puis-je changer le design?**
A: Bien sûr! Édite le CSS et l'HTML comme tu veux.

**Q: Comment ajouter l'authentification?**
A: Ajoute un login/password ou OAuth (voir backend).

**Q: Support pour d'autres langues?**
A: Le code est prêt, change juste le texte!

---

## 📝 License

MIT © 2025 NeonMail Pro

---

## 🎉 Prêt?

Tu as tout ce qu'il faut pour:
✓ Avoir une app professionnelle
✓ La déployer sur Render
✓ L'utiliser immédiatement
✓ La personnaliser à ton goût

**C'est parti! 🚀**

Pour des questions, consulte README.md ou DEPLOYMENT.md
