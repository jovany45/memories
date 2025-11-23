# ✅ Checklist Déploiement Render

## Avant de commencer

- [ ] Code poussé sur GitHub (repo `jovany45/memories`)
- [ ] Compte GitHub actif
- [ ] Email valide pour créer comptes

---

## 🗄️ ÉTAPE 1 : MongoDB Atlas (10 min)

### Création du cluster

- [ ] Aller sur https://www.mongodb.com/cloud/atlas/register
- [ ] Créer un compte / Se connecter
- [ ] "Build a Database" → M0 FREE
- [ ] Provider: AWS / Region: Frankfurt
- [ ] Nom cluster: `memories-cluster`
- [ ] Créer le cluster

### Configuration utilisateur

- [ ] Créer username: `memoryuser`
- [ ] Créer password: `Jojo4589!MongoDB` (ou autre)
- [ ] ⚠️ **COPIER LE MOT DE PASSE**
- [ ] Sauvegarder dans un fichier texte sécurisé

### Configuration réseau

- [ ] Network Access → Add IP Address
- [ ] "Allow Access from Anywhere" (0.0.0.0/0)
- [ ] Confirm

### Connection string

- [ ] Cliquer "Connect" sur le cluster
- [ ] "Connect your application"
- [ ] Copier l'URL
- [ ] Remplacer `<password>` par le vrai mot de passe
- [ ] Ajouter `/memories` après `.mongodb.net`
- [ ] URL finale format: `mongodb+srv://memoryuser:PASSWORD@cluster.xxxxx.mongodb.net/memories?retryWrites=true&w=majority`
- [ ] ⚠️ **SAUVEGARDER CETTE URL**

---

## 🖥️ ÉTAPE 2 : Backend Render (10 min)

### Créer le service

- [ ] Aller sur https://dashboard.render.com
- [ ] Sign Up / Login avec GitHub
- [ ] Autoriser Render à accéder à GitHub
- [ ] "New +" → "Web Service"
- [ ] Sélectionner repo `jovany45/memories`
- [ ] "Connect"

### Configuration du service

- [ ] Name: `memories-backend`
- [ ] Region: Frankfurt (EU Central)
- [ ] Branch: `main`
- [ ] Root Directory: `backend`
- [ ] Runtime: Node
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Plan: **Free**

### Variables d'environnement

- [ ] Cliquer "Advanced"
- [ ] Add Environment Variable

| Variable | Valeur | Fait |
|----------|--------|------|
| `NODE_ENV` | `production` | [ ] |
| `MONGODB_URI` | (connection string MongoDB complète) | [ ] |
| `JWT_SECRET` | (générer avec `node backend/generateSecret.js`) | [ ] |
| `FRONTEND_URL` | `https://memories-frontend.onrender.com` | [ ] |

### Générer JWT_SECRET

- [ ] Ouvrir PowerShell dans le projet
- [ ] Exécuter: `node backend/generateSecret.js`
- [ ] Copier la clé générée
- [ ] Coller dans la variable `JWT_SECRET` sur Render

### Déploiement

- [ ] "Create Web Service"
- [ ] ⏳ Attendre 5-10 minutes
- [ ] Surveiller les logs (onglet "Logs")
- [ ] Voir "Server started on port..." dans les logs
- [ ] Service démarré avec succès

### Test Backend

- [ ] Copier l'URL du service (ex: `https://memories-backend.onrender.com`)
- [ ] Ouvrir dans navigateur: `https://TON-URL/api/health`
- [ ] Voir réponse JSON: `{"status": "OK", "message": "🚀 Le serveur..."}`
- [ ] ✅ Backend fonctionnel !

---

## 🎨 ÉTAPE 3 : Frontend Render (10 min)

### Créer le service

- [ ] Sur Dashboard Render: "New +" → "Static Site"
- [ ] Sélectionner MÊME repo `jovany45/memories`
- [ ] "Connect"

### Configuration du service

- [ ] Name: `memories-frontend`
- [ ] Branch: `main`
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `dist`

### Variables d'environnement

- [ ] Cliquer "Advanced"
- [ ] Add Environment Variable

| Variable | Valeur | Fait |
|----------|--------|------|
| `VITE_API_URL` | `https://memories-backend.onrender.com/api` | [ ] |

⚠️ **Important** : Remplacer `memories-backend` par le vrai nom de ton service backend !

### Déploiement

- [ ] "Create Static Site"
- [ ] ⏳ Attendre 3-5 minutes
- [ ] Surveiller les logs
- [ ] Voir "Site live at..." dans les logs
- [ ] Site déployé avec succès

### Test Frontend

- [ ] Copier l'URL du site (ex: `https://memories-frontend.onrender.com`)
- [ ] Ouvrir dans navigateur
- [ ] Voir la page d'accueil
- [ ] ✅ Frontend visible !

---

## 🔗 ÉTAPE 4 : Configuration finale (5 min)

### Mettre à jour FRONTEND_URL dans le Backend

- [ ] Retourner sur service Backend
- [ ] Onglet "Environment"
- [ ] Trouver la variable `FRONTEND_URL`
- [ ] Cliquer sur "Edit"
- [ ] Remplacer par l'URL réelle du frontend: `https://memories-frontend.onrender.com`
- [ ] "Save Changes"
- [ ] ⏳ Le backend va redémarrer (attendre 1-2 min)

### Créer le compte admin en production

**Option A : Via Shell Render (recommandé)**

- [ ] Sur service Backend → Onglet "Shell"
- [ ] Attendre que le terminal charge
- [ ] Taper: `node createAdmin.js`
- [ ] Appuyer sur Entrée
- [ ] Voir "✅ SuperAdmin créé avec succès"
- [ ] Noter l'email: `jovany.bernez@gmail.com`
- [ ] Noter le mot de passe: `Jojo4589!`

**Option B : Via script local**

- [ ] Ouvrir `backend/.env`
- [ ] Remplacer `MONGODB_URI` par l'URI de production
- [ ] Exécuter: `node backend/createAdmin.js`
- [ ] Voir "✅ SuperAdmin créé"
- [ ] Remettre l'URI locale dans `backend/.env`

---

## 🧪 ÉTAPE 5 : Tests finaux (5 min)

### Test API Backend

- [ ] Ouvrir: `https://TON-BACKEND.onrender.com/api/health`
- [ ] Voir réponse JSON avec `"status": "OK"`

### Test Frontend chargement

- [ ] Ouvrir: `https://TON-FRONTEND.onrender.com`
- [ ] Voir page d'accueil
- [ ] Pas d'erreurs dans console navigateur (F12)

### Test Login Admin

- [ ] Sur le site, cliquer "Connexion"
- [ ] Email: `jovany.bernez@gmail.com`
- [ ] Mot de passe: `Jojo4589!`
- [ ] Cliquer "Se connecter"
- [ ] ✅ Redirection vers tableau de bord

### Test Dashboard Admin

- [ ] Voir le bouton Admin (bouclier jaune) dans la navbar
- [ ] Cliquer sur le bouton Admin
- [ ] Voir le dashboard avec statistiques
- [ ] Onglets: Overview, Users, Memories, Logs visibles
- [ ] Statistiques chargent correctement

### Test création de contenu

- [ ] Créer un souvenir de test
- [ ] Upload fonctionne ⚠️ (peut ne pas persister sur plan gratuit)
- [ ] Souvenir apparaît dans Timeline

---

## 📝 ÉTAPE 6 : Documentation (5 min)

### Sauvegarder les informations

- [ ] Créer un fichier `PRODUCTION.txt` avec :

```
=== PRODUCTION MEMORIES APP ===

Frontend URL: https://memories-frontend.onrender.com
Backend URL: https://memories-backend.onrender.com
Admin Dashboard: https://memories-frontend.onrender.com/admin

=== ADMIN CREDENTIALS ===
Email: jovany.bernez@gmail.com
Password: Jojo4589!

=== MONGODB ATLAS ===
Cluster: memories-cluster
User: memoryuser
Password: Jojo4589!MongoDB
Connection String: mongodb+srv://memoryuser:Jojo4589!MongoDB@memories-cluster.xxxxx.mongodb.net/memories?retryWrites=true&w=majority

=== RENDER SERVICES ===
Backend: memories-backend (Frankfurt, Free plan)
Frontend: memories-frontend (Frankfurt, Free plan)

=== JWT SECRET ===
[La clé générée - GARDER SECRÈTE]

Date déploiement: [DATE]
```

- [ ] ⚠️ **GARDER CE FICHIER SÉCURISÉ** (ne pas commit sur GitHub)

### Partager les URLs

- [ ] Copier l'URL du site frontend
- [ ] Tester dans un autre navigateur / mode incognito
- [ ] Partager avec tes amis du centre de formation

---

## 🎯 ÉTAPE 7 : Optimisations post-déploiement (Optionnel)

### Éviter la mise en veille (UptimeRobot)

- [ ] Créer compte sur https://uptimerobot.com
- [ ] "Add New Monitor"
- [ ] Type: HTTP(s)
- [ ] URL: `https://TON-BACKEND.onrender.com/api/health`
- [ ] Interval: 5 minutes
- [ ] Créer

### Créer des duels de test

- [ ] Backend Shell Render
- [ ] Exécuter: `node createTestDuel.js`
- [ ] Répéter 3 fois
- [ ] Vérifier les duels sur le site

### Personnaliser le domaine (Optionnel - Payant)

- [ ] Acheter un nom de domaine
- [ ] Dashboard Render → Service → Settings
- [ ] Custom Domain
- [ ] Ajouter ton domaine
- [ ] Configurer DNS CNAME

---

## ✅ Vérification finale

- [ ] ✅ MongoDB Atlas cluster actif
- [ ] ✅ Backend Render déployé et accessible
- [ ] ✅ Frontend Render déployé et accessible
- [ ] ✅ Variables d'environnement correctes (backend + frontend)
- [ ] ✅ CORS configuré (FRONTEND_URL dans backend)
- [ ] ✅ Compte admin créé et fonctionnel
- [ ] ✅ Login fonctionne
- [ ] ✅ Dashboard admin accessible
- [ ] ✅ API répond correctement
- [ ] ✅ Pas d'erreurs dans les logs Render
- [ ] ✅ Pas d'erreurs dans console navigateur

---

## 🎉 SUCCÈS !

Ton application est maintenant **LIVE** et accessible publiquement !

### URLs à retenir

📱 **Site public** : https://memories-frontend.onrender.com
🔧 **Dashboard admin** : https://memories-frontend.onrender.com/admin
🔌 **API** : https://memories-backend.onrender.com/api

### Prochaines étapes

1. **Partager** le site avec tes amis
2. **Créer du contenu** (souvenirs, duels)
3. **Monitorer** les logs sur Render Dashboard
4. **Optimiser** avec UptimeRobot pour éviter la veille

---

**Temps total** : ~35-45 minutes

**Coût** : 0€ (100% gratuit)

**Félicitations !** 🚀🎊
