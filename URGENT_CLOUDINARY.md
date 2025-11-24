# 🚨 ACTION IMMÉDIATE - Configuration Cloudinary

## ⚠️ SANS CETTE ÉTAPE, LES UPLOADS NE FONCTIONNERONT PAS !

---

## 📋 Étapes à suivre (13 minutes total)

### 1️⃣ Créer un compte Cloudinary (5 min)
- Va sur https://cloudinary.com
- Clique "Sign Up for Free"
- Confirme ton email

### 2️⃣ Récupérer tes identifiants (1 min)
Depuis le Dashboard Cloudinary, note ces 3 valeurs :
```
Cloud Name:   [ton-cloud-name]
API Key:      [123456789012345]
API Secret:   [AbCdEfGhIjKlMnOpQrSt]
```

### 3️⃣ Ajouter les variables sur Render (5 min)
1. Va sur https://render.com
2. Sélectionne ton service backend
3. Clique "Environment" (menu gauche)
4. Ajoute ces 3 variables :
   - `CLOUDINARY_CLOUD_NAME` = [ton cloud name]
   - `CLOUDINARY_API_KEY` = [ta api key]
   - `CLOUDINARY_API_SECRET` = [ton api secret]
5. Clique "Save Changes"

### 4️⃣ Attendre le redéploiement (2 min)
Render va automatiquement redéployer ton service.
Attends le badge vert "Deploy live".

### 5️⃣ Tester l'upload (test)
- Crée une publication avec photo
- Vérifie que l'URL commence par `https://res.cloudinary.com/...`

---

## ✅ C'est fait ? Checklist :
- [ ] Compte Cloudinary créé
- [ ] 3 identifiants notés
- [ ] 3 variables ajoutées sur Render
- [ ] Redéploiement terminé
- [ ] Upload testé avec succès

---

## 📖 Guides détaillés

Pour plus de détails :
- **ACTION_REQUISE_CLOUDINARY.md** - Guide visuel complet
- **CLOUDINARY_SETUP.md** - Explication technique
- **DEPLOIEMENT_COMPLET.md** - Checklist complète déploiement

---

**Commit actuel** : 6fa7cb3
**Status** : 🟡 Configuration Cloudinary en attente
