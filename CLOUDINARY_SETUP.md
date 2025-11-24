# 📦 Configuration Cloudinary pour 2ISALife

## Pourquoi Cloudinary ?

Render utilise un **système de fichiers éphémère** : tous les fichiers uploadés dans `/uploads` sont **supprimés** lors du redéploiement ou du redémarrage du serveur. C'est pourquoi les photos disparaissent après un moment !

**Solution** : Cloudinary héberge les fichiers sur le cloud de manière permanente.

---

## 🔑 Étape 1 : Créer un compte Cloudinary

1. Va sur [cloudinary.com](https://cloudinary.com)
2. Crée un compte gratuit (jusqu'à 25 Go de stockage)
3. Note tes identifiants depuis le Dashboard :
   - **Cloud Name**
   - **API Key**
   - **API Secret**

---

## ⚙️ Étape 2 : Ajouter les variables sur Render

1. Va sur [render.com](https://render.com) → Sélectionne ton service **2isalife-backend**
2. Clique sur **"Environment"** dans le menu de gauche
3. Clique sur **"Add Environment Variable"**
4. Ajoute ces **3 variables** :

```
CLOUDINARY_CLOUD_NAME=ton-cloud-name
CLOUDINARY_API_KEY=ta-api-key
CLOUDINARY_API_SECRET=ton-api-secret
```

5. Clique sur **"Save Changes"** → Render va redéployer automatiquement

---

## 📂 Structure des fichiers sur Cloudinary

Les fichiers seront organisés ainsi :

```
2isalife/
  ├── memories/     (photos et vidéos)
  └── audio/        (enregistrements vocaux)
```

---

## ✅ Vérification

Après le redéploiement :

1. Crée une nouvelle publication avec photo/vidéo/audio
2. Vérifie dans MongoDB que l'URL commence par `https://res.cloudinary.com/...`
3. Teste que la photo reste visible même après redémarrage de Render
4. Les anciennes publications avec `/uploads/...` peuvent ne plus fonctionner (fichiers perdus)

---

## 🛠️ Dépannage

**Erreur "Cloudinary not configured"** :
- Vérifie que les 3 variables sont bien dans Render
- Vérifie qu'il n'y a pas d'espaces dans les valeurs
- Redémarre le service manuellement

**Upload échoue** :
- Vérifie les limites Cloudinary (25 Go en gratuit)
- Vérifie les formats de fichiers supportés
- Check les logs Render pour voir l'erreur exacte

**Anciennes photos ne s'affichent plus** :
- C'est normal si elles étaient en `/uploads` local
- Solution : supprimer les anciennes publications ou les re-uploader

---

## 📊 Limites du plan gratuit Cloudinary

- **Stockage** : 25 GB
- **Bande passante** : 25 GB/mois
- **Transformations** : 25 000/mois
- **Vidéos** : 2 GB

Pour un centre de formation avec ~50-100 utilisateurs, c'est largement suffisant ! 🚀
