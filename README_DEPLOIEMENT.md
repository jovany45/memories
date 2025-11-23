# 🚀 Déploiement sur Render.com - Guide Express

## 📚 4 Guides disponibles

| Guide | Usage | Temps |
|-------|-------|-------|
| **[DEPLOIEMENT_RAPIDE.md](./DEPLOIEMENT_RAPIDE.md)** | Guide condensé, instructions essentielles | 25 min |
| **[CHECKLIST_DEPLOIEMENT.md](./CHECKLIST_DEPLOIEMENT.md)** | Checklist détaillée avec cases à cocher | 35 min |
| **[DEPLOIEMENT_RENDER.md](./DEPLOIEMENT_RENDER.md)** | Guide complet avec tous les détails | 45 min |
| **[COMMANDES_RENDER.md](./COMMANDES_RENDER.md)** | Commandes utiles (debug, monitoring, backup) | Référence |

---

## ⚡ Résumé Ultra-Rapide

### 1. MongoDB Atlas
- Créer cluster gratuit M0 sur https://mongodb.com/cloud/atlas
- User: `memoryuser` / Password: `Jojo4589!MongoDB`
- Network: 0.0.0.0/0 (Allow all)
- Connection string: `mongodb+srv://memoryuser:PASSWORD@cluster.mongodb.net/memories`

### 2. Backend Render
- https://dashboard.render.com → New Web Service
- Repo: `jovany45/memories`
- Root: `backend` / Build: `npm install` / Start: `npm start`
- Variables:
  - `NODE_ENV` = `production`
  - `MONGODB_URI` = (connection string)
  - `JWT_SECRET` = (générer avec `node backend/generateSecret.js`)
  - `FRONTEND_URL` = `https://memories-frontend.onrender.com`

### 3. Frontend Render
- New Static Site → Même repo
- Root: `frontend` / Build: `npm install && npm run build` / Publish: `dist`
- Variable: `VITE_API_URL` = `https://memories-backend.onrender.com/api`

### 4. Compte Admin
- Backend Shell Render: `node createAdmin.js`
- Email: `jovany.bernez@gmail.com` / Password: `Jojo4589!`

---

## 🎯 URLs Finales

- **Site** : https://memories-frontend.onrender.com
- **Admin** : https://memories-frontend.onrender.com/admin
- **API** : https://memories-backend.onrender.com/api

---

## ⚠️ Important

### Render n'a PAS de base de données intégrée
Tu DOIS utiliser **MongoDB Atlas** (gratuit jusqu'à 512 MB).

### Plan Gratuit - Limitations
- ⏰ **Veille après 15 min** d'inactivité
- ⏳ **Redémarrage** : 30-60 secondes
- 💾 **Uploads perdus** au redémarrage (utiliser Cloudinary)
- ✅ **Solution** : UptimeRobot (ping toutes les 5 min)

### Modifications Code
✅ Déjà fait dans ce commit :
- `backend/server.js` : CORS configuré
- `backend/.env.example` : Variables production
- `frontend/.env.example` : Variable API_URL
- `backend/generateSecret.js` : Script JWT

---

## 🆘 Problèmes Courants

### Backend ne démarre pas
```bash
# Vérifier MONGODB_URI (mot de passe encodé ?)
# Vérifier Start Command = "npm start"
# Voir logs Render pour l'erreur exacte
```

### Frontend erreur réseau
```bash
# Vérifier VITE_API_URL finit par /api
# Vérifier FRONTEND_URL dans backend
# Vider cache navigateur
```

### 401 Unauthorized
```bash
# Re-créer compte admin: node createAdmin.js
# Vérifier JWT_SECRET configuré
# Clear localStorage navigateur
```

---

## 📞 Support

- **Render Docs** : https://render.com/docs
- **MongoDB Docs** : https://mongodb.com/docs/atlas
- **Render Community** : https://community.render.com

---

## ✅ Ordre de Lecture Recommandé

1. **Commence par** : [DEPLOIEMENT_RAPIDE.md](./DEPLOIEMENT_RAPIDE.md)
2. **Suis la checklist** : [CHECKLIST_DEPLOIEMENT.md](./CHECKLIST_DEPLOIEMENT.md)
3. **Si problème** : [COMMANDES_RENDER.md](./COMMANDES_RENDER.md)
4. **Pour tout comprendre** : [DEPLOIEMENT_RENDER.md](./DEPLOIEMENT_RENDER.md)

---

**Temps total** : ~25-45 minutes  
**Coût** : 0€ (plans gratuits)

🎉 **Prêt à déployer !**
