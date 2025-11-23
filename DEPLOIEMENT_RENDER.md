# 🚀 Guide de déploiement sur Render.com

## 📋 Prérequis

- [ ] Compte GitHub (ton code doit être sur GitHub)
- [ ] Compte Render.com (gratuit)
- [ ] Compte MongoDB Atlas (gratuit)

---

## PARTIE 1 : Configuration MongoDB Atlas (Base de données) ☁️

### Étape 1.1 : Créer un cluster MongoDB

1. **Aller sur** [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. **Créer un compte** ou se connecter
3. **Cliquer sur** "Build a Database"
4. **Choisir** :
   - **Plan** : M0 (FREE) - 512 MB de stockage gratuit
   - **Provider** : AWS
   - **Region** : Europe (Frankfurt) ou la plus proche de toi
   - **Cluster Name** : memories-cluster
5. **Cliquer sur** "Create"

### Étape 1.2 : Créer un utilisateur database

1. **Security Quickstart** s'affiche :
   - **Username** : `memoryuser` (ou ce que tu veux)
   - **Password** : Générer un mot de passe fort (COPIE-LE !)
   - Exemple : `Jojo4589!MongoDB`
2. **Cliquer sur** "Create User"

### Étape 1.3 : Autoriser les connexions

1. **Network Access** :
   - **Cliquer sur** "Add IP Address"
   - **Choisir** "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note** : Pour production réelle, tu devrais restreindre aux IPs de Render
2. **Cliquer sur** "Finish and Close"

### Étape 1.4 : Récupérer la connection string

1. **Cliquer sur** "Connect" sur ton cluster
2. **Choisir** "Connect your application"
3. **Driver** : Node.js / Version 5.5 or later
4. **Copier** la connection string :
   ```
   mongodb+srv://memoryuser:<password>@memories-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Remplacer** `<password>` par le mot de passe créé à l'étape 1.2
6. **Ajouter** le nom de la base de données : `memories`
   ```
   mongodb+srv://memoryuser:Jojo4589!MongoDB@memories-cluster.xxxxx.mongodb.net/memories?retryWrites=true&w=majority
   ```
7. **SAUVEGARDER** cette URL (tu en auras besoin pour Render)

---

## PARTIE 2 : Déploiement Backend sur Render 🖥️

### Étape 2.1 : Créer le service Backend

1. **Aller sur** [https://render.com/](https://render.com/)
2. **Se connecter** avec GitHub
3. **Cliquer sur** "New +" → "Web Service"
4. **Connecter** ton repository GitHub `jovany45/memories`
5. **Autoriser** Render à accéder à ton repo

### Étape 2.2 : Configurer le Backend

**Remplir les champs** :

| Champ | Valeur |
|-------|--------|
| **Name** | `memories-backend` |
| **Region** | Frankfurt (EU Central) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### Étape 2.3 : Ajouter les variables d'environnement

**Cliquer sur** "Advanced" → "Add Environment Variable"

**Ajouter ces variables** :

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://memoryuser:Jojo4589!MongoDB@memories-cluster.xxxxx.mongodb.net/memories?retryWrites=true&w=majority` |
| `JWT_SECRET` | Générer avec : `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `FRONTEND_URL` | `https://memories-frontend.onrender.com` (tu modifieras après) |
| `PORT` | `5000` (optionnel, Render le gère automatiquement) |

### Étape 2.4 : Déployer

1. **Cliquer sur** "Create Web Service"
2. **Attendre** 5-10 minutes (le déploiement se lance)
3. **Vérifier** les logs en direct
4. **Ton backend sera accessible** à : `https://memories-backend.onrender.com`

### Étape 2.5 : Tester le Backend

**Dans ton navigateur, aller sur** :
```
https://memories-backend.onrender.com/api/health
```

**Tu devrais voir** :
```json
{"status": "ok"}
```

---

## PARTIE 3 : Déploiement Frontend sur Render 🎨

### Étape 3.1 : Créer le service Frontend

1. **Sur Render Dashboard**, cliquer sur "New +" → "Static Site"
2. **Sélectionner** le même repository `jovany45/memories`

### Étape 3.2 : Configurer le Frontend

**Remplir les champs** :

| Champ | Valeur |
|-------|--------|
| **Name** | `memories-frontend` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### Étape 3.3 : Ajouter la variable d'environnement

**Cliquer sur** "Advanced" → "Add Environment Variable"

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://memories-backend.onrender.com` |

### Étape 3.4 : Déployer

1. **Cliquer sur** "Create Static Site"
2. **Attendre** 3-5 minutes
3. **Ton frontend sera accessible** à : `https://memories-frontend.onrender.com`

### Étape 3.5 : Mettre à jour le Backend

1. **Retourner sur** ton service Backend
2. **Aller dans** "Environment"
3. **Modifier** `FRONTEND_URL` avec : `https://memories-frontend.onrender.com`
4. **Sauvegarder** (le backend va redémarrer)

---

## PARTIE 4 : Configuration finale du code 🔧

### Étape 4.1 : Ajouter une route health check au backend

**Dans `backend/server.js`**, ajouter avant les routes :

```javascript
// Health check pour Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Étape 4.2 : Modifier la configuration API du frontend

**Dans `frontend/src/api/index.js`**, vérifier que l'URL API utilise la variable d'environnement :

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### Étape 4.3 : Configurer CORS correctement

**Dans `backend/server.js`**, mettre à jour la configuration CORS :

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### Étape 4.4 : Créer un fichier .gitignore

**Vérifier** que `.env` est bien dans `.gitignore` :

```
# Backend
backend/.env
backend/uploads/*
backend/node_modules

# Frontend
frontend/.env
frontend/node_modules
frontend/dist
```

---

## PARTIE 5 : Déployer les modifications 🚀

### Étape 5.1 : Commit et push

```bash
git add .
git commit -m "chore: Configure app for Render deployment"
git push origin main
```

### Étape 5.2 : Auto-déploiement

**Render détecte automatiquement** les push sur `main` et redéploie !

**Suivre les logs** sur le Dashboard Render pour chaque service.

---

## PARTIE 6 : Initialiser les données 📊

### Étape 6.1 : Créer le compte admin en production

**Option A : Via terminal Render (gratuit)** :

1. **Sur le Dashboard Backend**, aller dans "Shell"
2. **Exécuter** :
   ```bash
   node createAdmin.js
   ```

**Option B : Via script local** :

1. **Modifier** `backend/.env` temporairement avec la MONGODB_URI de production
2. **Exécuter** en local :
   ```bash
   node createAdmin.js
   ```
3. **Remettre** l'URI locale après

### Étape 6.2 : Créer des duels de test (optionnel)

```bash
node createTestDuel.js
```

---

## 🎯 Récapitulatif des URLs

| Service | URL |
|---------|-----|
| **Frontend** | `https://memories-frontend.onrender.com` |
| **Backend** | `https://memories-backend.onrender.com` |
| **API Health** | `https://memories-backend.onrender.com/api/health` |
| **MongoDB** | `mongodb+srv://...` (connection string Atlas) |

---

## ⚠️ Limitations du plan gratuit Render

- **750 heures/mois** par service (suffisant pour 1 service)
- **Services inactifs** : Se mettent en veille après 15 min sans requête
- **Redémarrage** : Prend 30-60 secondes lors de la première requête
- **Stockage** : Pas de persistance fichiers (uploads perdus au redémarrage)

### Solutions aux limitations :

1. **Uploads** : Utiliser Cloudinary ou AWS S3 pour stocker les images
2. **Veille** : Ajouter un cron job (UptimeRobot) pour ping toutes les 10 min
3. **Plus de services** : Passer au plan payant (7$/mois)

---

## 🐛 Troubleshooting

### Erreur "Application failed to respond"

**Solution** : Vérifier que `PORT` utilise `process.env.PORT` dans `server.js`

### Erreur "Cannot connect to MongoDB"

**Solutions** :
- Vérifier la connection string (mot de passe encodé ?)
- Vérifier Network Access sur MongoDB Atlas (0.0.0.0/0 autorisé ?)
- Vérifier que la variable `MONGODB_URI` est bien configurée sur Render

### Frontend ne charge pas les données

**Solutions** :
- Vérifier `VITE_API_URL` dans les variables d'environnement frontend
- Vérifier CORS dans `backend/server.js`
- Vérifier `FRONTEND_URL` dans les variables backend

### Images/Uploads ne s'affichent pas

**Cause** : Le système de fichiers de Render est éphémère

**Solution** : Migrer vers Cloudinary :
1. Créer compte sur [cloudinary.com](https://cloudinary.com)
2. Installer `cloudinary` dans le backend
3. Modifier `multer` pour uploader sur Cloudinary
4. Stocker les URLs Cloudinary en base

---

## 🔒 Sécurité Production

### Variables sensibles

**JAMAIS commit** :
- `.env` avec les vrais identifiants
- Connection strings MongoDB
- JWT secrets

### Recommandations :

1. **Changer JWT_SECRET** après déploiement
2. **Utiliser des mots de passe forts** pour MongoDB
3. **Limiter les IPs MongoDB** aux IPs de Render (dans Network Access)
4. **Activer 2FA** sur Render et MongoDB Atlas
5. **Monitorer les logs** régulièrement

---

## 📞 Support

- **Render Docs** : [https://render.com/docs](https://render.com/docs)
- **MongoDB Atlas Docs** : [https://www.mongodb.com/docs/atlas/](https://www.mongodb.com/docs/atlas/)
- **Render Community** : [https://community.render.com/](https://community.render.com/)

---

## ✅ Checklist finale

- [ ] MongoDB Atlas cluster créé et configuré
- [ ] Backend déployé sur Render
- [ ] Frontend déployé sur Render
- [ ] Variables d'environnement configurées (backend + frontend)
- [ ] CORS configuré avec bonne URL frontend
- [ ] Route `/api/health` ajoutée au backend
- [ ] Compte admin créé en production
- [ ] Frontend accessible et se connecte au backend
- [ ] Login fonctionnel avec le compte admin
- [ ] Données chargent correctement

---

**Temps total estimé** : 30-45 minutes

**Coût** : 0€ avec plans gratuits

**Prêt pour la production !** 🎉
