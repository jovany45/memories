# 💾 2ISALife - Plateforme collaborative pour le centre 2ISA

Un site moderne pour partager souvenirs, idées et anecdotes du centre de formation 2ISA.

---

## 🚨 **ACTION IMMÉDIATE REQUISE**

### Configuration Cloudinary (obligatoire pour que les uploads fonctionnent)

**Temps : 13 minutes**

1. Crée un compte sur [cloudinary.com](https://cloudinary.com)
2. Note tes 3 identifiants (Cloud Name, API Key, API Secret)
3. Ajoute-les dans Render Dashboard → Environment
4. Redéploiement automatique

**📖 Guide détaillé** : Lis `URGENT_CLOUDINARY.md` ou `ACTION_REQUISE_CLOUDINARY.md`

---

## 🚀 Technologies

### Backend
- **Node.js** avec Express
- **MongoDB Atlas** (base de données cloud)
- **Cloudinary** (stockage permanent fichiers)
- **JWT** pour l'authentification
- **Multer + multer-storage-cloudinary** pour uploads
- **Bcrypt** pour le hashage des mots de passe

### Frontend
- **React 18** avec Vite
- **TailwindCSS** pour le design moderne
- **Framer Motion** pour les animations
- **React Router** pour la navigation
- **Axios** pour les appels API
- **React Hot Toast** pour les notifications

---

## ✨ Fonctionnalités

### 📸 Système de Memories
- Upload photos/vidéos/vocaux
- 14 humeurs différentes (😂🥺🔥🤓😏🥰😬🤩🌅💪🌙💕🧘🌪️)
- Likes et commentaires
- Timeline chronologique
- Filtres par humeur

### 🎤 Enregistrement Vocal
- Enregistrement direct depuis le navigateur
- Visualisation audio en temps réel (50 barres)
- Play/pause/suppression
- Stockage permanent sur Cloudinary

### 💡 Boîte à Idées
- Proposer des améliorations pour le centre
- Système de votes (👍👎)
- Commentaires sur les idées
- Suivi du statut (en attente, approuvée, rejetée)

### 🎲 Générateur d'Idées
- 90 idées pré-programmées (normales, WTF, geek)
- Mode aléatoire ou multiple
- Statistiques d'utilisation

### 📢 Système de Plaintes Anonymes
- Poster anonymement des plaintes
- 6 catégories (vie quotidienne, nourriture, infrastructure...)
- Votes et commentaires
- Modération admin

### 🏆 Gamification
- Défis quotidiens
- Système de duels
- Achievements/badges
- Leaderboard

---

## 📦 Installation

### Prérequis
- Node.js (v18+)
- Compte MongoDB Atlas
- Compte Cloudinary

### Backend

```powershell
cd backend
npm install
```

Créer un fichier `.env` :
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/2isalife
JWT_SECRET=genere_avec_generateSecret.js
CLOUDINARY_CLOUD_NAME=ton-cloud-name
CLOUDINARY_API_KEY=ta-api-key
CLOUDINARY_API_SECRET=ton-api-secret
NODE_ENV=development
```

Lancer le serveur :
```powershell
npm run dev
```

### Frontend

```powershell
cd frontend
npm install
```

Créer un fichier `.env` :
```
VITE_API_URL=http://localhost:5000/api
```

Lancer l'application :
```powershell
npm run dev
```

## 🎯 Fonctionnalités

### Authentification
- ✅ Inscription avec username, email, password
- ✅ Connexion avec JWT
- ✅ Avatar auto-généré avec DiceBear
- ✅ Protection des routes

### Souvenirs (Memories)
- ✅ Créer des souvenirs (photos, vidéos, anecdotes)
- ✅ Upload de médias (images et vidéos)
- ✅ Tags personnalisés
- ✅ Mood/ambiance (drôle, émouvant, épique, geek, etc.)
- ✅ Like et commentaires
- ✅ Compteur de vues
- ✅ Souvenirs publics/privés

### Profil Utilisateur
- ✅ Page de profil avec statistiques
- ✅ Modifier sa bio et son username
- ✅ Affichage de tous ses souvenirs
- ✅ Stats : nombre de souvenirs, likes, commentaires

### Design
- ✅ Glassmorphism moderne
- ✅ Animations Framer Motion
- ✅ Gradients animés
- ✅ Responsive mobile/desktop
- ✅ Dark mode natif
- ✅ Emojis et personnalité geek

## 📁 Structure du Projet

```
memories/
├── backend/
│   ├── controllers/       # Logique métier
│   ├── models/           # Modèles Mongoose
│   ├── routes/           # Routes API
│   ├── middleware/       # Auth, upload, etc.
│   ├── uploads/          # Fichiers uploadés
│   └── server.js         # Point d'entrée
│
└── frontend/
    ├── src/
    │   ├── api/          # Services API
    │   ├── components/   # Composants React
    │   ├── context/      # Context API (Auth)
    │   ├── pages/        # Pages de l'app
    │   ├── App.jsx       # Routage principal
    │   └── main.jsx      # Point d'entrée
    └── index.html
```

## 🎨 Design Features

### Glassmorphism
Effets de verre moderne avec `backdrop-blur` et transparence.

### Animations
- Hover effects sur les cartes
- Animations d'entrée avec Framer Motion
- Éléments flottants dans le Hero
- Gradients animés

### Emojis & Vibes
Chaque souvenir a une "vibe" :
- 😂 Drôle
- 🥺 Émouvant
- 🔥 Épique
- 🤓 Geek
- 😏 Sarcastique
- 🥰 Wholesome
- 😬 Cringe

## 🔐 API Endpoints

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil actuel

### Users
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:id` - Profil utilisateur
- `PUT /api/users/:id` - Modifier profil

### Memories
- `GET /api/memories` - Liste des souvenirs (avec filtres)
- `GET /api/memories/:id` - Détail d'un souvenir
- `POST /api/memories` - Créer un souvenir
- `PUT /api/memories/:id` - Modifier un souvenir
- `DELETE /api/memories/:id` - Supprimer un souvenir
- `POST /api/memories/:id/like` - Like/Unlike
- `POST /api/memories/:id/comments` - Ajouter un commentaire
- `DELETE /api/memories/:id/comments/:commentId` - Supprimer un commentaire

## 🎉 Messages Personnalisés

Le site utilise des messages fun et geek :
- "🚀 Le serveur des souvenirs est en ligne !"
- "🎉 Bienvenue dans la famille !"
- "💾 Memories - Nos Souvenirs Codés avec ❤️"
- "Parce que chaque bug résolu mérite d'être célébré 🐛✨"

## 🛠️ Développement

### Ajouter un nouveau modèle
```javascript
// backend/models/VotreModele.js
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  // vos champs
}, { timestamps: true });

export default mongoose.model('VotreModele', schema);
```

### Ajouter une nouvelle route
```javascript
// backend/routes/votre-route.js
import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  // votre logique
});

export default router;
```

### Ajouter une nouvelle page React
```jsx
// frontend/src/pages/VotrePage.jsx
import { motion } from 'framer-motion';

const VotrePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* votre contenu */}
    </motion.div>
  );
};

export default VotrePage;
```

## � Déploiement

### Déployer sur Render.com (Recommandé)

Ce projet est prêt pour être déployé sur **Render.com** avec **MongoDB Atlas**.

#### 📚 Guides disponibles

| Guide | Description | Temps |
|-------|-------------|-------|
| **[INDEX_GUIDES.md](./INDEX_GUIDES.md)** | 📖 Index de tous les guides | 2 min |
| **[DEPLOIEMENT_RAPIDE.md](./DEPLOIEMENT_RAPIDE.md)** | ⚡ Guide rapide | 25 min |
| **[CHECKLIST_DEPLOIEMENT.md](./CHECKLIST_DEPLOIEMENT.md)** | ✅ Checklist complète | 35 min |
| **[DEPLOIEMENT_RENDER.md](./DEPLOIEMENT_RENDER.md)** | 📖 Guide ultra-détaillé | 45 min |
| **[GUIDE_VISUEL_DEPLOIEMENT.txt](./GUIDE_VISUEL_DEPLOIEMENT.txt)** | 🎨 Architecture visuelle | 10 min |
| **[COMMANDES_RENDER.md](./COMMANDES_RENDER.md)** | 🛠️ Commandes utiles | Référence |
| **[POURQUOI_RENDER.md](./POURQUOI_RENDER.md)** | 🤔 Comparatif hébergeurs | 10 min |

#### 🎯 Démarrage rapide

1. **Lire** : [README_DEPLOIEMENT.md](./README_DEPLOIEMENT.md) (2 min)
2. **Suivre** : [DEPLOIEMENT_RAPIDE.md](./DEPLOIEMENT_RAPIDE.md) (25 min)
3. **Référence** : [COMMANDES_RENDER.md](./COMMANDES_RENDER.md) (si besoin)

**Total : ~30 minutes | Coût : 0€ (plan gratuit)**

#### 🎉 Résultat

Ton application sera accessible publiquement à :
- **Frontend** : `https://memories-frontend.onrender.com`
- **Admin** : `https://memories-frontend.onrender.com/admin`
- **API** : `https://memories-backend.onrender.com/api`

---

## ✨ Nouvelles Fonctionnalités (Novembre 2025)

### Interface Admin Ultra-Moderne
- ✅ Dashboard complet avec statistiques
- ✅ Gestion des utilisateurs (promouvoir admin, activer/désactiver)
- ✅ Modération des souvenirs
- ✅ Logs d'activité admin
- ✅ Recherche et filtres avancés
- ✅ Design glassmorphism avec Framer Motion

### Système de Thèmes
- ✅ 6 thèmes visuels (Default, Cyberpunk, Zen, Retro, Pride, Hacker)
- ✅ Changement dynamique avec CSS Variables
- ✅ Persistance des préférences (localStorage)
- ✅ Transitions fluides

### Duels de Souvenirs
- ✅ Vote entre 2 souvenirs aléatoires
- ✅ Statistiques de votes en temps réel
- ✅ Calcul automatique des pourcentages
- ✅ Karma bonus pour les gagnants

### Timeline Améliorée
- ✅ Affichage chronologique des souvenirs
- ✅ Filtres par type et mood
- ✅ Animations d'entrée fluides
- ✅ Cards interactives

### Profil Enrichi
- ✅ Statistiques détaillées (karma, souvenirs, likes)
- ✅ Badge de rôle (admin/user)
- ✅ Liste complète des souvenirs créés
- ✅ Bio et avatar personnalisables

---

## 📝 TODO / Améliorations Futures

- [ ] Système de notifications en temps réel (WebSocket)
- [ ] Messagerie privée entre utilisateurs
- [ ] Albums de souvenirs
- [ ] Export de souvenirs en PDF
- [ ] Mode collaboratif pour les souvenirs de groupe
- [ ] Intégration Cloudinary pour uploads persistants
- [ ] Service Worker pour PWA (mode offline)
- [ ] Compression d'images automatique
- [ ] Système de rapports/signalements

## 🤝 Contribution

Ce projet est personnel mais les suggestions sont les bienvenues !

## 📄 Licence

MIT - Libre d'utilisation

## 💖 Fait avec

Codé avec ❤️ et beaucoup de café ☕ pour immortaliser nos meilleurs moments geeks ! 🤓

---

**"Parce que chaque ligne de code raconte une histoire"** ✨
