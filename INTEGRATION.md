# 🔧 Guide d'Intégration des Composants

Ce fichier contient les instructions pour intégrer tous les nouveaux composants dans les pages existantes.

## 🏠 Page Home.jsx

### Ajouter DailyChallenge en haut

```jsx
import DailyChallenge from '../components/DailyChallenge';
import { featuresAPI } from '../api';

// Dans le composant Home, après les imports
const [dailyChallenge, setDailyChallenge] = useState(null);

// Dans useEffect
useEffect(() => {
  fetchDailyChallenge();
}, []);

const fetchDailyChallenge = async () => {
  try {
    const data = await featuresAPI.getDailyChallenge();
    setDailyChallenge(data);
  } catch (error) {
    console.error('Erreur daily challenge:', error);
  }
};

// Dans le JSX, avant les filtres
{dailyChallenge && (
  <div className="mb-8">
    <DailyChallenge 
      challenge={dailyChallenge} 
      onComplete={fetchDailyChallenge}
    />
  </div>
)}
```

## 📝 Page MemoryDetail.jsx

### Imports nécessaires

```jsx
import ReactionPicker from '../components/ReactionPicker';
import CringeDetector from '../components/CringeDetector';
import CodeReview from '../components/CodeReview';
import TimeCapsule from '../components/TimeCapsule';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { useConfetti } from '../components/ConfettiCannon';
```

### Ajouter ReactionPicker après les likes

```jsx
{/* Likes existants */}
<button onClick={handleLike}>
  ❤️ {memory.likes?.length || 0}
</button>

{/* Nouveau : ReactionPicker */}
<ReactionPicker 
  memory={memory} 
  onReactionAdded={fetchMemory}
/>
```

### Ajouter CringeDetector si score > 0

```jsx
{memory.cringeScore > 0 && (
  <div className="mb-6">
    <CringeDetector 
      score={memory.cringeScore}
      comment={memory.cringeComment}
      details={memory.cringeDetails}
    />
  </div>
)}
```

### Ajouter TimeCapsule si applicable

```jsx
{memory.isTimeCapsule && !memory.isUnlocked && (
  <div className="mb-6">
    <TimeCapsule 
      unlockDate={memory.unlockDate}
      isUnlocked={false}
      onUnlock={() => {
        // Confetti + reload
        const { celebrate } = useConfetti();
        celebrate('victory');
        fetchMemory();
      }}
    />
  </div>
)}
```

### Ajouter BeforeAfterSlider si images

```jsx
{memory.beforeAfter && memory.beforeAfter.beforeImage && (
  <div className="mb-6">
    <BeforeAfterSlider 
      beforeImage={`http://localhost:5000${memory.beforeAfter.beforeImage}`}
      afterImage={`http://localhost:5000${memory.beforeAfter.afterImage}`}
      beforeLabel={memory.beforeAfter.beforeDescription || 'Avant'}
      afterLabel={memory.beforeAfter.afterDescription || 'Après'}
    />
  </div>
)}
```

### Ajouter CodeReview après commentaires

```jsx
{/* Section Commentaires existante */}
<CommentSection memory={memory} />

{/* Nouveau : Code Review */}
<div className="mt-8">
  <CodeReview 
    memory={memory}
    onReviewAdded={fetchMemory}
  />
</div>
```

### Afficher Voice Note si présent

```jsx
{memory.voiceNoteUrl && (
  <div className="mb-6 card">
    <h3 className="text-lg font-bold text-white mb-3">🎤 Note Vocale</h3>
    <audio controls className="w-full">
      <source src={`http://localhost:5000${memory.voiceNoteUrl}`} type="audio/webm" />
    </audio>
  </div>
)}
```

### Afficher Spotify Track si présent

```jsx
{memory.spotifyTrack && (
  <div className="mb-6 card">
    <h3 className="text-lg font-bold text-white mb-3">🎵 Bande Son</h3>
    <div className="flex items-center space-x-4">
      {memory.spotifyTrack.albumCover && (
        <img 
          src={memory.spotifyTrack.albumCover} 
          alt={memory.spotifyTrack.name}
          className="w-20 h-20 rounded-lg"
        />
      )}
      <div>
        <div className="font-bold text-white">{memory.spotifyTrack.name}</div>
        <div className="text-gray-400">{memory.spotifyTrack.artist}</div>
        <a 
          href={memory.spotifyTrack.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-300 text-sm"
        >
          Écouter sur Spotify →
        </a>
      </div>
    </div>
  </div>
)}
```

### Afficher Memory Chain si présent

```jsx
{memory.memoryChain && (
  <div className="mb-6 card">
    <h3 className="text-lg font-bold text-white mb-3">🔗 Chaîne de Souvenirs</h3>
    <div className="space-y-2">
      {memory.memoryChain.parentMemory && (
        <Link 
          to={`/memory/${memory.memoryChain.parentMemory}`}
          className="block p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Souvenir précédent
        </Link>
      )}
      {memory.memoryChain.childMemories?.length > 0 && (
        <div>
          <p className="text-gray-400 mb-2">Souvenirs suivants :</p>
          {memory.memoryChain.childMemories.map(childId => (
            <Link 
              key={childId}
              to={`/memory/${childId}`}
              className="block p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors mb-2"
            >
              → Voir le suivant
            </Link>
          ))}
        </div>
      )}
    </div>
  </div>
)}
```

### Afficher Contributors si plusieurs

```jsx
{memory.contributors && memory.contributors.length > 1 && (
  <div className="mb-6 card">
    <h3 className="text-lg font-bold text-white mb-3">👥 Contributeurs</h3>
    <div className="flex flex-wrap gap-3">
      {memory.contributors.map(contributor => (
        <Link 
          key={contributor._id}
          to={`/profile/${contributor._id}`}
          className="flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2 hover:bg-gray-700 transition-colors"
        >
          {contributor.profilePicture ? (
            <img 
              src={`http://localhost:5000${contributor.profilePicture}`}
              alt={contributor.name}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-xs">
              {contributor.name?.[0]}
            </div>
          )}
          <span className="text-white">{contributor.name}</span>
        </Link>
      ))}
    </div>
  </div>
)}
```

## ✏️ Page CreateMemory.jsx

### Ajouter VoiceNoteRecorder

```jsx
import VoiceNoteRecorder from '../components/VoiceNoteRecorder';

// Dans le state
const [voiceNote, setVoiceNote] = useState(null);

// Dans le JSX, après l'upload de fichier
<div className="mb-6">
  <VoiceNoteRecorder 
    onRecordingComplete={(audioFile) => {
      setVoiceNote(audioFile);
      toast.success('Note vocale ajoutée !');
    }}
  />
</div>

// Dans handleSubmit, ajouter au FormData
if (voiceNote) {
  formData.append('voiceNote', voiceNote);
}
```

### Ajouter Before/After Upload

```jsx
const [beforeImage, setBeforeImage] = useState(null);
const [afterImage, setAfterImage] = useState(null);

// Dans le JSX
<div className="card mb-6">
  <h3 className="text-lg font-bold text-white mb-4">🔄 Avant / Après (optionnel)</h3>
  
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-gray-400 mb-2">Image Avant</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setBeforeImage(e.target.files[0])}
        className="w-full"
      />
    </div>
    
    <div>
      <label className="block text-gray-400 mb-2">Image Après</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setAfterImage(e.target.files[0])}
        className="w-full"
      />
    </div>
  </div>
</div>

// Dans handleSubmit
if (beforeImage && afterImage) {
  formData.append('beforeImage', beforeImage);
  formData.append('afterImage', afterImage);
}
```

### Ajouter Time Capsule

```jsx
const [isTimeCapsule, setIsTimeCapsule] = useState(false);
const [unlockDate, setUnlockDate] = useState('');

// Dans le JSX
<div className="card mb-6">
  <label className="flex items-center space-x-3 cursor-pointer">
    <input
      type="checkbox"
      checked={isTimeCapsule}
      onChange={(e) => setIsTimeCapsule(e.target.checked)}
      className="w-5 h-5"
    />
    <span className="text-white">⏰ Capsule Temporelle</span>
  </label>
  
  {isTimeCapsule && (
    <div className="mt-4">
      <label className="block text-gray-400 mb-2">Date de déverrouillage</label>
      <input
        type="datetime-local"
        value={unlockDate}
        onChange={(e) => setUnlockDate(e.target.value)}
        min={new Date().toISOString().slice(0, 16)}
        className="input w-full"
        required={isTimeCapsule}
      />
    </div>
  )}
</div>

// Dans handleSubmit
if (isTimeCapsule && unlockDate) {
  formData.append('isTimeCapsule', 'true');
  formData.append('unlockDate', new Date(unlockDate).toISOString());
}
```

## 👤 Page Profile.jsx

### Afficher Achievements

```jsx
import { AchievementBadge } from '../components/Achievement';
import { gamificationAPI } from '../api';

// Dans le state
const [achievements, setAchievements] = useState([]);

// Dans useEffect
useEffect(() => {
  fetchAchievements();
}, [id]);

const fetchAchievements = async () => {
  try {
    const data = await gamificationAPI.getUserAchievements(id);
    setAchievements(data.achievements);
  } catch (error) {
    console.error('Erreur achievements:', error);
  }
};

// Dans le JSX, après les stats
<div className="card mb-8">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-xl font-bold text-white">🏆 Achievements</h3>
    <Link 
      to={`/achievements/${id}`}
      className="text-primary-400 hover:text-primary-300"
    >
      Voir tous →
    </Link>
  </div>
  
  <div className="flex flex-wrap gap-3">
    {achievements
      .filter(a => a.unlocked)
      .slice(0, 6)
      .map(achievement => (
        <AchievementBadge 
          key={achievement.id}
          achievement={achievement}
          unlocked={true}
          size="normal"
        />
      ))}
  </div>
  
  <div className="mt-4 text-center text-gray-400">
    {achievements.filter(a => a.unlocked).length} / {achievements.length} débloqués
  </div>
</div>
```

### Afficher Karma

```jsx
<div className="card mb-8">
  <div className="text-center">
    <div className="text-5xl font-bold gradient-text mb-2">
      {user.karma || 0}
    </div>
    <div className="text-gray-400">Points de Karma</div>
    <Link 
      to="/leaderboard"
      className="mt-4 inline-block text-primary-400 hover:text-primary-300"
    >
      Voir le classement →
    </Link>
  </div>
</div>
```

## 🔔 Notifications d'Achievement

### Dans AuthContext ou App.jsx

```jsx
import { AchievementUnlockNotification } from '../components/Achievement';
import { useState, useEffect } from 'react';

// State pour les achievements récents
const [recentAchievement, setRecentAchievement] = useState(null);

// Écouter les nouveaux achievements (après création de souvenir, like, etc.)
const checkNewAchievements = async (userId) => {
  try {
    const data = await gamificationAPI.getUserAchievements(userId);
    const lastUnlocked = data.achievements
      .filter(a => a.unlocked)
      .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))[0];
    
    // Si débloqué il y a moins de 5 secondes
    if (lastUnlocked && new Date() - new Date(lastUnlocked.unlockedAt) < 5000) {
      setRecentAchievement(lastUnlocked);
      
      // Confetti !
      const { celebrate } = useConfetti();
      celebrate('achievement');
    }
  } catch (error) {
    console.error('Erreur check achievements:', error);
  }
};

// Dans le JSX
{recentAchievement && (
  <AchievementUnlockNotification 
    achievement={recentAchievement}
    onClose={() => setRecentAchievement(null)}
  />
)}
```

## 🎨 Utilisation des Confettis

### Importer

```jsx
import { useConfetti } from '../components/ConfettiCannon';

const MyComponent = () => {
  const { fire, celebrate } = useConfetti();
  
  // Simple confetti
  const handleSuccess = () => {
    fire('medium', 3000); // intensity, duration
  };
  
  // Preset animations
  const handleAchievement = () => {
    celebrate('achievement'); // ou 'fireworks', 'snow', 'stars', 'emoji'
  };
  
  return (
    <button onClick={handleSuccess}>
      🎉 Celebrate!
    </button>
  );
};
```

### Exemples d'usage

```jsx
// Achievement débloqué
celebrate('achievement');

// Duel gagné
celebrate('fireworks');

// Time Capsule déverrouillée
celebrate('stars');

// Like reçu
fire('low', 1000);

// Création de souvenir
fire('medium', 2000);

// Montée de niveau
celebrate('emoji', ['🎉', '🎊', '⭐', '✨']);
```

## 📋 Checklist d'Intégration

### Home.jsx
- [ ] Ajouter DailyChallenge en haut
- [ ] Vérifier que les filtres fonctionnent
- [ ] Tester le chargement des souvenirs

### MemoryDetail.jsx
- [ ] Intégrer ReactionPicker
- [ ] Intégrer CringeDetector
- [ ] Intégrer CodeReview
- [ ] Intégrer TimeCapsule
- [ ] Intégrer BeforeAfterSlider
- [ ] Afficher Voice Note
- [ ] Afficher Spotify Track
- [ ] Afficher Memory Chain
- [ ] Afficher Contributors
- [ ] Confetti sur time capsule unlock

### CreateMemory.jsx
- [ ] Ajouter VoiceNoteRecorder
- [ ] Ajouter Before/After upload
- [ ] Ajouter Time Capsule option
- [ ] Ajouter Spotify search (à implémenter)
- [ ] Ajouter Memory Chain selector

### Profile.jsx
- [ ] Afficher Achievements avec badges
- [ ] Afficher Karma total
- [ ] Lien vers Leaderboard
- [ ] Lien vers page Achievements complète
- [ ] Afficher stats détaillées

### Navbar.jsx
- [x] Ajouter liens Timeline, Leaderboard, Duels
- [x] Ajouter bouton Thème
- [x] Intégrer ThemeSwitcher modal

### App.jsx
- [x] Routes ajoutées
- [ ] AchievementUnlockNotification global
- [ ] Confetti global sur events

## 🚀 Test Final

1. Créer un souvenir avec voice note
2. Ajouter une réaction
3. Faire une code review
4. Voter dans un duel
5. Compléter le daily challenge
6. Vérifier que les achievements se débloquent
7. Tester le changement de thème
8. Créer une time capsule
9. Tester before/after slider
10. Vérifier les confettis sur achievement

---

**Tous les composants sont prêts, il ne reste plus qu'à les intégrer ! 🎉**
