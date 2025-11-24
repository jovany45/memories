# 🚀 Guide de déploiement complet - 2ISALife

## ✅ Ce qui a été fait

### 1. Migration Cloudinary ☁️
- **Problème** : Les photos/vidéos disparaissaient après un moment sur Render (système de fichiers éphémère)
- **Solution** : Migration vers Cloudinary pour stockage cloud permanent
- **Fichiers modifiés** :
  - `backend/config/cloudinary.js` (nouveau)
  - `backend/routes/memories.js` (uploadMultiple au lieu de upload local)
  - `backend/controllers/memoryController.js` (URLs Cloudinary)
  - `frontend/src/components/MemoryCard.jsx` (compatibilité URLs)
  - `frontend/src/pages/MemoryDetail.jsx` (compatibilité URLs)

### 2. Commits GitHub
```bash
✅ commit e91b3c6: "Ajout système de plaintes anonymes + enregistrement vocal + 14 émojis d'humeur"
✅ commit b5bce1f: "Changement de nom: LesRP Memories → 2ISALife + fix routing"
✅ commit cf75fe1: "Ajout fichiers controllers manquants + fix imports + titres positifs IdeaBox"
✅ commit 277c7d7: "Migration Cloudinary pour stockage permanent des fichiers"
```

---

## 📋 Checklist de déploiement

### Étape 1 : Configurer Cloudinary (OBLIGATOIRE)

1. **Créer un compte Cloudinary** :
   - Va sur [cloudinary.com](https://cloudinary.com)
   - Crée un compte gratuit (25 Go inclus)
   - Note tes identifiants du Dashboard

2. **Ajouter les variables sur Render** :
   - Va sur [render.com](https://render.com)
   - Sélectionne ton service backend `2isalife-backend`
   - Clique sur **Environment** (menu gauche)
   - Ajoute ces 3 variables :
     ```
     CLOUDINARY_CLOUD_NAME=ton-cloud-name
     CLOUDINARY_API_KEY=ta-api-key
     CLOUDINARY_API_SECRET=ton-api-secret
     ```
   - Clique sur **Save Changes**

3. **Attendre le redéploiement automatique** (1-2 minutes)

### Étape 2 : Vérifier le déploiement

1. **Backend** :
   - Ouvre `https://ton-backend.onrender.com`
   - Tu dois voir : `"2ISALife API est en ligne!"`

2. **Test upload** :
   - Va sur ton site frontend
   - Crée une nouvelle publication avec photo/vidéo
   - Vérifie que l'URL commence par `https://res.cloudinary.com/...`

3. **MongoDB** :
   - Connecte-toi à MongoDB Atlas
   - Vérifie que `mediaUrl` et `audioUrl` contiennent des URLs Cloudinary

### Étape 3 : Anciennes publications

⚠️ **Attention** : Les anciennes photos avec `/uploads/...` ne fonctionneront plus (fichiers perdus sur Render).

**Solutions** :
1. Supprimer les anciennes publications
2. Ou les re-uploader avec Cloudinary
3. Ou créer un script de migration (demande-moi si besoin)

---

## 🛠️ Dépannage

### Erreur "Cloudinary not configured"
- ✅ Vérifie que les 3 variables sont bien dans Render
- ✅ Vérifie qu'il n'y a pas d'espaces dans les valeurs
- ✅ Redémarre manuellement le service Render

### Upload échoue
- ✅ Vérifie que Cloudinary accepte les formats (jpg, png, gif, mp4, mov, mp3, wav)
- ✅ Vérifie la limite de taille (10 MB par fichier)
- ✅ Check les logs Render : **Logs** → Recherche "Cloudinary"

### Photos ne s'affichent toujours pas
- ✅ Vérifie la console du navigateur (F12) pour erreurs CORS
- ✅ Vérifie que `FRONTEND_URL` est bien configuré dans Render
- ✅ Teste avec une nouvelle publication (pas les anciennes)

### 404 sur les routes
- ✅ Vérifie que le commit 277c7d7 est bien déployé sur Render
- ✅ Vérifie les logs Render : **Logs** → Recherche "Error"
- ✅ Redémarre manuellement : **Manual Deploy** → **Deploy latest commit**

---

## 📊 Monitoring

### Cloudinary Dashboard
- **Stockage utilisé** : [Dashboard Cloudinary](https://cloudinary.com/console)
- **Bande passante** : Vérifie mensuellement (25 GB gratuit)
- **Transformations** : 25 000/mois (largement suffisant)

### Render Logs
- **Erreurs backend** : Render → ton-service → **Logs**
- **Temps de réponse** : Render → ton-service → **Metrics**

---

## 🎯 Prochaines étapes (optionnelles)

1. **Migration des anciennes photos** : Script pour uploader les anciennes photos sur Cloudinary
2. **Optimisation images** : Redimensionnement automatique avec Cloudinary
3. **Lazy loading** : Charger les images progressivement (performance)
4. **Cache CDN** : Activer le cache Cloudinary pour vitesse

---

## 📝 Notes importantes

- **Plan gratuit Cloudinary** : 25 GB stockage + 25 GB bande passante/mois
- **Render free tier** : Service s'endort après 15 min d'inactivité (1er accès lent)
- **MongoDB Atlas** : 512 MB gratuit (suffisant pour ~10 000 publications)

---

## 🆘 Support

Si tu rencontres un problème :
1. Vérifie ce guide en premier
2. Consulte `CLOUDINARY_SETUP.md` pour détails Cloudinary
3. Check les logs Render pour erreurs backend
4. Vérifie la console navigateur (F12) pour erreurs frontend

**Commandes utiles** :
```bash
# Vérifier le statut Git
git status

# Voir les derniers commits
git log --oneline -5

# Redéployer manuellement
# → Render Dashboard → Manual Deploy → Deploy latest commit
```

---

✅ **Déploiement terminé !** Une fois Cloudinary configuré, tout devrait fonctionner. 🚀
