# 🚀 Déploiement Render - Guide Rapide

## Ordre de déploiement

1. **MongoDB Atlas** (base de données) - 10 min
2. **Backend Render** (API) - 5 min  
3. **Frontend Render** (site web) - 5 min
4. **Configuration finale** - 5 min

---

## 1️⃣ MongoDB Atlas (Base de données)

### Créer un cluster gratuit

1. **Aller sur** : https://www.mongodb.com/cloud/atlas/register
2. **Créer un compte** avec ton email
3. **Cliquer** : "Build a Database"
4. **Choisir** :
   - **M0 FREE** (512 MB gratuit)
   - **AWS** / **Europe (Frankfurt)**
   - **Nom** : `memories-cluster`

### Créer un utilisateur

1. **Username** : `memoryuser`
2. **Password** : `Jojo4589!MongoDB` (ou génère un mot de passe fort)
3. ⚠️ **COPIER LE MOT DE PASSE** quelque part !

### Autoriser les connexions

1. **Add IP Address** → "Allow Access from Anywhere" (0.0.0.0/0)
2. **Finish and Close**

### Récupérer la connection string

1. **Connect** → "Connect your application"
2. **Copier** l'URL :
   ```
   mongodb+srv://memoryuser:<password>@memories-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. **Remplacer** `<password>` par `Jojo4589!MongoDB`
4. **Ajouter** `/memories` après `.net` :
   ```
   mongodb+srv://memoryuser:Jojo4589!MongoDB@memories-cluster.xxxxx.mongodb.net/memories?retryWrites=true&w=majority
   ```

✅ **Sauvegarder cette URL !**

---

## 2️⃣ Backend sur Render

### Créer le service

1. **Aller sur** : https://dashboard.render.com/
2. **Se connecter avec GitHub**
3. **New +** → **Web Service**
4. **Connecter** le repo `jovany45/memories`

### Configuration

| Champ | Valeur |
|-------|--------|
| Name | `memories-backend` |
| Region | Frankfurt (EU Central) |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Plan | **Free** |

### Variables d'environnement

**Cliquer** : Advanced → Add Environment Variable

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | (la connection string MongoDB complète) |
| `JWT_SECRET` | (générer avec `node backend/generateSecret.js`) |
| `FRONTEND_URL` | `https://memories-frontend.onrender.com` |

### Déployer

1. **Create Web Service**
2. ⏳ **Attendre 5-10 min** (surveiller les logs)
3. ✅ **URL** : `https://memories-backend.onrender.com`

### Tester

```
https://memories-backend.onrender.com/api/health
```

**Résultat attendu** :
```json
{"status": "OK", "message": "🚀 Le serveur des souvenirs est en ligne !"}
```

---

## 3️⃣ Frontend sur Render

### Créer le service

1. **New +** → **Static Site**
2. **Même repo** : `jovany45/memories`

### Configuration

| Champ | Valeur |
|-------|--------|
| Name | `memories-frontend` |
| Branch | `main` |
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

### Variable d'environnement

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://memories-backend.onrender.com/api` |

⚠️ **Important** : Bien mettre `/api` à la fin !

### Déployer

1. **Create Static Site**
2. ⏳ **Attendre 3-5 min**
3. ✅ **URL** : `https://memories-frontend.onrender.com`

---

## 4️⃣ Configuration finale

### Mettre à jour le Backend

1. **Retourner** sur le service Backend
2. **Environment** → Modifier `FRONTEND_URL`
3. **Nouvelle valeur** : `https://memories-frontend.onrender.com`
4. **Save** (le backend va redémarrer)

### Créer le compte admin en production

**Option A : Via Shell Render**
1. Sur le Dashboard Backend → **Shell**
2. Exécuter :
   ```bash
   node createAdmin.js
   ```

**Option B : Via script local**
1. Modifier temporairement `backend/.env` avec la MONGODB_URI de production
2. Exécuter : `node backend/createAdmin.js`
3. Remettre l'URI locale après

---

## ✅ Vérification finale

### 1. Backend fonctionne

```
https://memories-backend.onrender.com/api/health
```

### 2. Frontend charge

```
https://memories-frontend.onrender.com
```

### 3. Login admin

- **Email** : `jovany.bernez@gmail.com`
- **Mot de passe** : `Jojo4589!`

### 4. Dashboard admin

```
https://memories-frontend.onrender.com/admin
```

---

## 🎯 URLs finales

| Service | URL |
|---------|-----|
| **Site public** | `https://memories-frontend.onrender.com` |
| **API** | `https://memories-backend.onrender.com/api` |
| **Admin** | `https://memories-frontend.onrender.com/admin` |

---

## ⚠️ Limitations gratuites

- **Veille après 15 min** d'inactivité
- **Redémarrage** prend 30-60 secondes
- **Uploads** perdus au redémarrage (utiliser Cloudinary pour production)

### Éviter la veille

**Utiliser** [UptimeRobot](https://uptimerobot.com) (gratuit) :
1. Créer un moniteur HTTP
2. URL : `https://memories-backend.onrender.com/api/health`
3. Intervalle : 5 minutes

---

## 🐛 Problèmes courants

### Backend ne démarre pas

**Vérifier** :
- ✅ `MONGODB_URI` est correct (mot de passe encodé ?)
- ✅ MongoDB Atlas autorise 0.0.0.0/0
- ✅ `Start Command` = `npm start`

### Frontend affiche erreur réseau

**Vérifier** :
- ✅ `VITE_API_URL` se termine par `/api`
- ✅ Backend est bien en ligne
- ✅ `FRONTEND_URL` configuré dans le backend

### 401 Unauthorized

**Solutions** :
- Vérifier `JWT_SECRET` dans les variables backend
- Re-créer le compte admin
- Vider cache navigateur + localStorage

---

## 📞 Support

- **Render Docs** : https://render.com/docs
- **MongoDB Docs** : https://www.mongodb.com/docs/atlas
- **Render Community** : https://community.render.com

---

**Temps total** : ~25 minutes

**Coût** : 0€ (plans gratuits)

🎉 **Ton application est en ligne !**
