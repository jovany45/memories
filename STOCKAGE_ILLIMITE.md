# 🗄️ Stockage Illimité - Configuration

## ✅ Modifications Appliquées

### 1. **Upload de Fichiers Sans Limite**
- ✅ Taille maximale des fichiers : **ILLIMITÉE** (Infinity)
- ✅ Vidéos : Aucune limite de durée ou de taille
- ✅ Photos : Aucune limite de taille ou de résolution
- ✅ Express configuré pour accepter jusqu'à 500MB en JSON/form data

**Fichier modifié :** `backend/middleware/upload.js`

```javascript
limits: {
  fileSize: Infinity // Pas de limite de taille
}
```

### 2. **Contenu Sans Limite de Caractères**
- ✅ Titre des souvenirs : Illimité
- ✅ Description des souvenirs : Illimitée
- ✅ Commentaires : Illimités
- ✅ Bio utilisateur : Illimitée
- ✅ Nom d'utilisateur : Minimum 3 caractères, pas de maximum

**Fichiers modifiés :**
- `backend/models/Memory.js`
- `backend/models/User.js`

### 3. **Conservation Indéfinie des Données**

#### MongoDB Atlas - Stockage Permanent
Toutes les données sont stockées **indéfiniment** dans MongoDB Atlas :

- ✅ **Photos** : Conservées à jamais
- ✅ **Vidéos** : Conservées à jamais
- ✅ **Publications** : Conservées à jamais
- ✅ **Anecdotes** : Conservées à jamais
- ✅ **Commentaires** : Conservés à jamais
- ✅ **Profils utilisateurs** : Conservés à jamais
- ✅ **Achievements** : Conservés à jamais
- ✅ **Duels** : Conservés à jamais
- ✅ **Défis quotidiens** : Conservés à jamais

#### Aucun Mécanisme de Suppression Automatique

Les modèles MongoDB ne contiennent **AUCUN** des éléments suivants :
- ❌ Pas de TTL (Time To Live) index
- ❌ Pas d'expiration automatique
- ❌ Pas de suppression planifiée
- ❌ Pas de limite de rétention

### 4. **Formats Supportés**

#### Images
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)

#### Vidéos
- MP4 (.mp4)
- MOV (.mov)
- AVI (.avi)
- WebM (.webm)

## ⚠️ Considérations Importantes

### Espace de Stockage
MongoDB Atlas offre différents plans :
- **M0 (Gratuit)** : 512 MB de stockage
- **M10** : 10 GB - 80 GB
- **M20+** : Jusqu'à plusieurs TB

**Avec des uploads illimités, surveillez votre quota MongoDB Atlas.**

### Performances
- Les très gros fichiers peuvent ralentir les uploads
- Considérez un CDN (Cloudinary, AWS S3) pour les très gros médias
- MongoDB a une limite de document de 16MB (GridFS peut contourner cela)

### Recommandations

#### Pour la Production
Si vous prévoyez beaucoup de vidéos volumineuses, envisagez :
1. **Cloudinary** : Gratuit jusqu'à 25 GB, optimisation automatique
2. **AWS S3** : Stockage très bon marché, illimité
3. **MongoDB GridFS** : Pour stocker des fichiers > 16MB directement dans MongoDB

#### Configuration Actuelle
Les fichiers sont stockés dans :
- **Système de fichiers local** : `backend/uploads/`
- **Références en base** : URL stockée dans MongoDB

## 🔧 Configuration Système

### Backend (`server.js`)
```javascript
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));
```

### Multer (`middleware/upload.js`)
```javascript
limits: {
  fileSize: Infinity
}
```

### Models
Tous les champs `maxlength` ont été supprimés.

## 📊 Suivi de l'Utilisation

Pour surveiller votre utilisation MongoDB Atlas :
1. Connectez-vous sur https://cloud.mongodb.com
2. Allez dans votre cluster
3. Onglet "Metrics"
4. Vérifiez "Data Size" et "Storage Size"

## 🚀 Migration Future (Optionnelle)

Si vous atteignez les limites de stockage, migration recommandée :

```javascript
// Exemple avec Cloudinary
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
```

---

**Date de configuration** : 24 novembre 2025
**Statut** : ✅ Stockage illimité activé
