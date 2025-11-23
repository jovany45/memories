# 🛠️ Commandes utiles pour Render

## Générer un JWT Secret

```bash
# PowerShell
node backend/generateSecret.js

# Ou directement
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Tester l'API Backend localement

```bash
# Health check
curl http://localhost:5000/api/health

# Ou avec PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" | Select-Object -Expand Content
```

---

## Tester l'API Backend en production

```bash
# Health check
curl https://memories-backend.onrender.com/api/health

# Avec PowerShell
Invoke-WebRequest -Uri "https://memories-backend.onrender.com/api/health" | Select-Object -Expand Content
```

---

## Créer le compte admin en production

### Via Shell Render

1. Aller sur Dashboard Render → Service Backend
2. Cliquer sur "Shell" (onglet en haut)
3. Exécuter :

```bash
node createAdmin.js
```

### Via script local (avec MongoDB production)

1. Copier la MONGODB_URI de production
2. Créer temporairement `backend/.env.production` :

```bash
MONGODB_URI=mongodb+srv://memoryuser:password@cluster.mongodb.net/memories?retryWrites=true&w=majority
```

3. Modifier `backend/createAdmin.js` pour utiliser `.env.production`
4. Exécuter :

```bash
node backend/createAdmin.js
```

---

## Créer des duels de test en production

```bash
# Dans le Shell Render
node createTestDuel.js
```

---

## Monitorer les logs en temps réel

### Sur Render Dashboard

1. Aller sur ton service (Backend ou Frontend)
2. Cliquer sur "Logs"
3. Voir les logs en direct

### Depuis CLI Render (optionnel)

```bash
# Installer Render CLI
npm install -g @renderinc/cli

# Se connecter
render login

# Voir les logs
render logs --service memories-backend --follow
```

---

## Redéployer manuellement

### Via Dashboard

1. Aller sur ton service
2. Cliquer sur "Manual Deploy"
3. Choisir la branche `main`

### Via Git (auto-déploiement)

```bash
git add .
git commit -m "Update: description de tes modifications"
git push origin main
```

**Render détecte automatiquement** le push et redéploie !

---

## Variables d'environnement

### Lister toutes les variables

1. Dashboard Render → Service
2. Onglet "Environment"
3. Voir toutes les variables

### Ajouter/Modifier une variable

1. Dashboard → Service → Environment
2. Add Environment Variable
3. Sauvegarder (le service redémarre automatiquement)

---

## Vérifier la connexion MongoDB

### Depuis MongoDB Compass (local)

1. Télécharger [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Coller la connection string :
   ```
   mongodb+srv://memoryuser:password@cluster.mongodb.net/memories
   ```
3. Connecter et voir les collections

### Depuis MongoDB Atlas

1. Aller sur https://cloud.mongodb.com
2. Se connecter
3. Cluster → Collections
4. Voir les données directement

---

## Nettoyer la base de données

### Supprimer tous les duels

```javascript
// Dans MongoDB Shell ou Compass
db.memoryduels.deleteMany({})
```

### Supprimer tous les utilisateurs sauf admin

```javascript
db.users.deleteMany({ role: { $ne: 'admin' } })
```

### Réinitialiser le karma d'un utilisateur

```javascript
db.users.updateOne(
  { email: 'jovany.bernez@gmail.com' },
  { $set: { karma: 9999 } }
)
```

---

## Débugger les erreurs CORS

### Vérifier la configuration Backend

```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### Vérifier les variables d'environnement

**Backend** :
- `FRONTEND_URL` = `https://memories-frontend.onrender.com`

**Frontend** :
- `VITE_API_URL` = `https://memories-backend.onrender.com/api`

---

## Tester les permissions admin

### Via curl

```bash
# 1. Login et récupérer le token
curl -X POST https://memories-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jovany.bernez@gmail.com","password":"Jojo4589!"}'

# Copier le token depuis la réponse

# 2. Tester une route admin
curl https://memories-backend.onrender.com/api/admin/stats \
  -H "Authorization: Bearer TON_TOKEN_ICI"
```

### Via PowerShell

```powershell
# 1. Login
$response = Invoke-WebRequest -Uri "https://memories-backend.onrender.com/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"jovany.bernez@gmail.com","password":"Jojo4589!"}'

$token = ($response.Content | ConvertFrom-Json).token

# 2. Tester route admin
Invoke-WebRequest -Uri "https://memories-backend.onrender.com/api/admin/stats" `
  -Headers @{"Authorization"="Bearer $token"} | Select-Object -Expand Content
```

---

## Sauvegarder la base de données

### Export MongoDB Atlas

```bash
# Installer MongoDB Database Tools
# https://www.mongodb.com/try/download/database-tools

# Exporter toute la base
mongodump --uri="mongodb+srv://memoryuser:password@cluster.mongodb.net/memories" --out=backup/

# Importer une sauvegarde
mongorestore --uri="mongodb+srv://..." --dir=backup/memories/
```

---

## Voir les statistiques d'utilisation Render

1. Dashboard Render
2. Onglet "Metrics" sur chaque service
3. Voir :
   - CPU usage
   - Memory usage
   - Bandwidth
   - Request count

---

## Configurer un domaine personnalisé

### Sur Render (payant)

1. Dashboard → Service → Settings
2. Custom Domain
3. Ajouter ton domaine (ex: `memories.ton-domaine.com`)
4. Configurer les DNS chez ton registrar

### DNS à configurer

```
Type: CNAME
Name: memories (ou @)
Value: memories-frontend.onrender.com
```

---

## Forcer HTTPS (déjà activé par défaut)

Render active automatiquement HTTPS avec certificats SSL gratuits (Let's Encrypt).

---

## Optimiser les performances

### Backend

```javascript
// Activer la compression
import compression from 'compression';
app.use(compression());

// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requêtes
});
app.use('/api/', limiter);
```

### Frontend

```json
// vite.config.js - déjà optimisé par défaut
export default {
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
}
```

---

## Migrer vers plan payant

### Avantages du plan payant (7$/mois)

- ✅ Pas de veille (toujours actif)
- ✅ Plus de puissance (CPU/RAM)
- ✅ Déploiement instantané
- ✅ Support prioritaire

### Comment upgrader

1. Dashboard → Service → Settings
2. Plan → Upgrade
3. Choisir "Starter" (7$/mois)

---

## Ressources utiles

- **Render Status** : https://status.render.com/
- **Render Docs** : https://render.com/docs
- **MongoDB Atlas** : https://cloud.mongodb.com
- **Render Community** : https://community.render.com/
- **Render CLI** : https://github.com/render-oss/cli

---

**Besoin d'aide ?** Consulte les logs en premier !
