# ❓ FAQ - Questions Fréquentes Déploiement

## 📋 Table des matières

- [Avant le déploiement](#avant-le-déploiement)
- [MongoDB Atlas](#mongodb-atlas)
- [Render Backend](#render-backend)
- [Render Frontend](#render-frontend)
- [Après le déploiement](#après-le-déploiement)
- [Erreurs courantes](#erreurs-courantes)
- [Performance](#performance)
- [Coûts](#coûts)
- [Sécurité](#sécurité)

---

## Avant le déploiement

### Q : Dois-je avoir un compte payant ?
**R :** Non ! Tout est gratuit :
- MongoDB Atlas : M0 (512 MB gratuit)
- Render Backend : Free plan (750h/mois)
- Render Frontend : Free plan (illimité)

### Q : Combien de temps ça prend ?
**R :** Entre 25 et 45 minutes selon ton expérience :
- Débutant avec guide rapide : 30-40 min
- Avec checklist complète : 45 min
- Expérimenté : 20-25 min

### Q : Faut-il modifier le code ?
**R :** Non ! Le code est déjà prêt pour Render. Tout est dans les variables d'environnement.

### Q : Mon code doit être sur GitHub ?
**R :** Oui, Render se connecte via GitHub. Le repo doit être `jovany45/memories`.

---

## MongoDB Atlas

### Q : MongoDB Atlas est-il vraiment gratuit ?
**R :** Oui ! Plan M0 gratuit à vie avec :
- 512 MB de stockage
- Connexions illimitées
- Backups automatiques

### Q : Que se passe-t-il si je dépasse 512 MB ?
**R :** Atlas te préviendra. Tu pourras :
- Nettoyer les vieilles données
- Upgrader vers M2 (9$/mois, 2 GB)

### Q : Puis-je changer la région après création ?
**R :** Non. Tu devras créer un nouveau cluster et migrer les données.

### Q : Comment voir mes données en production ?
**R :** 2 options :
1. MongoDB Compass (app desktop)
2. MongoDB Atlas web interface (Collections)

### Q : Mes données locales seront-elles migrées automatiquement ?
**R :** Non. Tu dois :
1. Créer le compte admin en production : `node createAdmin.js`
2. Optionnel : Exporter/Importer avec `mongodump` et `mongorestore`

---

## Render Backend

### Q : Le backend se met en veille après 15 min ?
**R :** Oui sur le plan gratuit. Solutions :
- **Recommandé** : UptimeRobot (gratuit, ping toutes les 5 min)
- **Alternative** : Cron job externe
- **Payant** : Render Starter (7$/mois, pas de veille)

### Q : Combien de temps dure le redémarrage après veille ?
**R :** 30 à 60 secondes pour la première requête.

### Q : Puis-je avoir plusieurs services backend gratuitement ?
**R :** Oui, mais attention à la limite de 750h/mois. 1 service 24/7 = 720h/mois.

### Q : Comment voir les logs en production ?
**R :** Dashboard Render → Service → Logs (temps réel).

### Q : Le port 5000 est bloqué ?
**R :** Render assigne automatiquement un port via `process.env.PORT`. Le code utilise déjà ça.

### Q : Puis-je utiliser nodemon en production ?
**R :** Non. Utilise `npm start` (qui lance `node server.js`).

### Q : Comment mettre à jour le backend ?
**R :** Commit + push sur GitHub → Render redéploie automatiquement.

---

## Render Frontend

### Q : Pourquoi "Static Site" et pas "Web Service" ?
**R :** React build génère des fichiers statiques (HTML/CSS/JS). C'est plus rapide et moins cher.

### Q : Le frontend a-t-il les mêmes limitations de veille ?
**R :** Non ! Les static sites sont toujours en ligne, pas de veille.

### Q : VITE_API_URL doit finir par /api ?
**R :** Oui ! Important :
- ✅ `https://memories-backend.onrender.com/api`
- ❌ `https://memories-backend.onrender.com`

### Q : Puis-je utiliser des variables d'environnement côté client ?
**R :** Oui, mais **uniquement** celles préfixées par `VITE_`. Elles sont publiques !

### Q : Le build échoue avec erreur mémoire ?
**R :** Rare sur Render. Si ça arrive :
- Réduire les dépendances inutilisées
- Vérifier que `vite.config.js` est optimisé

---

## Après le déploiement

### Q : Le site ne charge pas, erreur réseau ?
**R :** Vérifier dans l'ordre :
1. Backend est en ligne ? → `https://TON-BACKEND/api/health`
2. `VITE_API_URL` correct dans frontend ?
3. `FRONTEND_URL` correct dans backend ?
4. Vider cache navigateur (Ctrl+Shift+R)

### Q : Login fonctionne mais admin dashboard inaccessible ?
**R :** Vérifier :
1. Compte admin créé ? → `node createAdmin.js` dans Shell Render
2. Champ `role` retourné par l'API ? → Tester `/api/auth/me`
3. localStorage contient le token ?

### Q : Les images/uploads ne s'affichent pas ?
**R :** Normal sur plan gratuit Render. Le filesystem est éphémère. Solutions :
- **Recommandé** : Cloudinary (gratuit jusqu'à 25 GB)
- **Alternative** : AWS S3, Imgur API

### Q : Comment créer des utilisateurs de test ?
**R :** 2 options :
1. S'inscrire via l'interface (comme un vrai utilisateur)
2. Script custom en modifiant `createAdmin.js`

### Q : Puis-je créer plusieurs admins ?
**R :** Oui ! Via dashboard admin :
1. Login admin
2. Dashboard → Users
3. Toggle role sur n'importe quel utilisateur

---

## Erreurs courantes

### Q : Erreur "Application failed to respond"
**R :** Le backend ne démarre pas. Vérifier :
- `Start Command` = `npm start` (pas `npm run dev`)
- `MONGODB_URI` correcte (mot de passe encodé ?)
- Logs Render pour voir l'erreur exacte

### Q : Erreur 500 "Cannot connect to MongoDB"
**R :** Vérifier :
1. Connection string correcte (format `mongodb+srv://...`)
2. Mot de passe sans caractères spéciaux non encodés
3. MongoDB Atlas autorise 0.0.0.0/0 (Network Access)
4. Cluster est bien actif (pas paused)

### Q : Erreur CORS "Access-Control-Allow-Origin"
**R :** Vérifier :
1. `FRONTEND_URL` dans backend = URL exacte du frontend
2. Pas de slash `/` à la fin de `FRONTEND_URL`
3. Backend a bien redémarré après modification variable

### Q : Erreur 401 "Unauthorized"
**R :** Problème d'authentification :
1. `JWT_SECRET` configuré dans backend ?
2. Token présent dans localStorage ?
3. Token valide ? (pas expiré, bon secret)

### Q : Frontend affiche page blanche
**R :** Vérifier :
1. Console navigateur (F12) pour voir erreurs
2. `dist/` folder généré correctement lors du build
3. `Publish Directory` = `dist` dans config Render

### Q : Erreur "Module not found" en production
**R :** Dépendance manquante :
1. Vérifier que la dépendance est dans `package.json` (pas devDependencies)
2. `npm install` localement pour vérifier
3. Redéployer

---

## Performance

### Q : Le site est lent, pourquoi ?
**R :** Plusieurs raisons possibles :
1. **Backend endormi** → Première requête = 30-60s
2. **MongoDB distant** → Latence réseau (Europe → US)
3. **Plan gratuit** → Ressources limitées

**Solutions** :
- UptimeRobot pour éviter veille
- MongoDB région proche du backend
- Caching avec Redis (plan payant)

### Q : Puis-je activer le cache ?
**R :** Oui, plusieurs niveaux :
1. **Browser cache** : Headers HTTP (déjà géré par Render)
2. **API cache** : Redis (nécessite plan payant ou service externe)
3. **CDN** : Cloudflare (gratuit devant Render)

### Q : Comment optimiser le temps de chargement ?
**R :** Frontend :
- Code splitting (déjà fait avec Vite)
- Lazy loading des images
- Compression Brotli (déjà activé par Render)

Backend :
- Index MongoDB sur champs fréquents
- Pagination (déjà implémenté)
- Select uniquement les champs nécessaires

---

## Coûts

### Q : Combien coûte le plan gratuit à long terme ?
**R :** 0€ à vie ! Tant que tu restes sous :
- MongoDB : 512 MB
- Render Backend : 750h/mois (1 service 24/7 OK)
- Render Frontend : Illimité

### Q : Quand devrais-je payer ?
**R :** Si :
- Tu veux éviter la veille backend (7$/mois)
- Tu dépasses 512 MB MongoDB (9$/mois pour 2 GB)
- Tu veux domaine custom + SSL (déjà inclus gratuitement !)
- Tu veux support prioritaire

### Q : Combien coûte le plan payant Render ?
**R :** 
- **Starter** : 7$/mois (pas de veille, 0.5 GB RAM)
- **Standard** : 25$/mois (1 GB RAM, meilleure performance)
- **Pro** : 85$/mois (4 GB RAM, haute disponibilité)

### Q : MongoDB Atlas coûts supérieurs ?
**R :**
- **M0** : Gratuit (512 MB)
- **M2** : 9$/mois (2 GB)
- **M5** : 25$/mois (5 GB, backups avancés)

### Q : Y a-t-il des coûts cachés ?
**R :** Non ! Tout est transparent :
- Bandwidth inclus (100 GB/mois gratuit Render)
- SSL gratuit (Let's Encrypt)
- Backups MongoDB gratuits (M0)

---

## Sécurité

### Q : Mon JWT_SECRET est-il sécurisé ?
**R :** Si généré avec `generateSecret.js`, oui (64 bytes random).

### Q : Dois-je changer JWT_SECRET régulièrement ?
**R :** Pas nécessaire sauf si :
- Suspicion de fuite
- Employé/dev part de l'équipe
- Bonne pratique : tous les 6-12 mois

### Q : Comment protéger mes variables d'environnement ?
**R :** Render les protège automatiquement :
- Stockage chiffré
- Jamais affichées en clair dans logs
- Accessible uniquement via dashboard authentifié

### Q : Puis-je restreindre les IPs MongoDB Atlas ?
**R :** Oui, recommandé pour production :
1. Trouver IPs Render (voir logs ou docs)
2. MongoDB Atlas → Network Access
3. Remplacer 0.0.0.0/0 par IPs Render spécifiques

### Q : HTTPS est activé par défaut ?
**R :** Oui ! Render active automatiquement :
- Certificat SSL Let's Encrypt
- Redirection HTTP → HTTPS
- Renouvellement automatique

### Q : Comment gérer les sessions utilisateurs ?
**R :** JWT stocké dans `localStorage` :
- Expire après X temps (configurable)
- Invalide si JWT_SECRET change
- Pas de stockage côté serveur (stateless)

### Q : Faut-il activer 2FA ?
**R :** Recommandé pour :
- Compte Render (GitHub 2FA suffit)
- Compte MongoDB Atlas (2FA dans settings)
- Compte admin app (pas encore implémenté)

---

## Questions Avancées

### Q : Puis-je utiliser Docker avec Render ?
**R :** Oui ! Render supporte Docker :
1. Créer `Dockerfile`
2. Render détecte automatiquement
3. Build et deploy

### Q : Comment migrer vers un autre hébergeur ?
**R :** Facile grâce à MongoDB Atlas séparé :
1. Exporter code GitHub
2. Déployer sur nouvel hébergeur
3. Même `MONGODB_URI` → données intactes

### Q : Puis-je avoir un environnement staging ?
**R :** Oui ! 2 options :
1. **Branches GitHub** : dev/staging/main avec auto-deploy
2. **Services séparés** : Dupliquer service Render avec autre branche

### Q : Comment faire des backups réguliers ?
**R :** MongoDB Atlas (M0 gratuit) :
- Backups automatiques cloud (rolling 2 jours)
- Export manuel : `mongodump`

Pour M2+ :
- Backups quotidiens
- Point-in-time recovery
- Rétention configurable

### Q : WebSockets fonctionnent sur Render ?
**R :** Oui ! Socket.io compatible :
- Ajuster config CORS
- Utiliser `wss://` en production
- Render gère les connexions persistantes

### Q : Puis-je exécuter des cron jobs ?
**R :** Oui avec Render Cron Jobs (service séparé, gratuit) :
1. Créer script Node.js
2. Render Cron Job → Schedule
3. Exécution automatique

---

## 📞 Besoin d'aide supplémentaire ?

Si ta question n'est pas ici :

1. **Vérifier les guides** :
   - [COMMANDES_RENDER.md](./COMMANDES_RENDER.md) - Troubleshooting détaillé
   - [DEPLOIEMENT_RENDER.md](./DEPLOIEMENT_RENDER.md) - Guide complet

2. **Consulter les docs officielles** :
   - [Render Documentation](https://render.com/docs)
   - [MongoDB Atlas Docs](https://mongodb.com/docs/atlas)

3. **Communautés** :
   - [Render Community](https://community.render.com)
   - [Stack Overflow](https://stackoverflow.com) (tag: render, mongodb-atlas)

4. **Support Render** :
   - Free plan : Community support uniquement
   - Paid plan : Email support (response 24-48h)

---

**Dernière mise à jour** : Novembre 2025

**Questions manquantes ?** Ouvre une issue sur GitHub !
