// Liste des styles d'avatars disponibles sur DiceBear
export const avatarStyles = [
  { id: 'avataaars', name: '👤 Avataaars', description: 'Style Sketch cartoon' },
  { id: 'bottts', name: '🤖 Bottts', description: 'Robots mignons' },
  { id: 'personas', name: '😊 Personas', description: 'Visages simples' },
  { id: 'pixel-art', name: '🎮 Pixel Art', description: 'Style rétro 8-bit' },
  { id: 'adventurer', name: '🧙 Adventurer', description: 'Style aventurier' },
  { id: 'big-ears', name: '🐰 Big Ears', description: 'Grandes oreilles' },
  { id: 'fun-emoji', name: '😎 Fun Emoji', description: 'Emojis fun' },
  { id: 'lorelei', name: '👩 Lorelei', description: 'Personnages stylisés' },
  { id: 'micah', name: '👨 Micah', description: 'Illustrations modernes' },
  { id: 'miniavs', name: '🎨 Miniavs', description: 'Mini avatars' }
];

// Générer un avatar aléatoire
export const generateRandomAvatar = () => {
  const randomStyle = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
  const randomSeed = Math.random().toString(36).substring(7);
  return `https://api.dicebear.com/7.x/${randomStyle.id}/svg?seed=${randomSeed}`;
};

// Générer un avatar avec un style et seed spécifiques
export const generateAvatar = (style, seed) => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

// Extraire le style et seed d'une URL d'avatar
export const parseAvatarUrl = (url) => {
  try {
    const match = url.match(/\/7\.x\/([^/]+)\/svg\?seed=([^&]+)/);
    if (match) {
      return {
        style: match[1],
        seed: match[2]
      };
    }
  } catch (error) {
    console.error('Error parsing avatar URL:', error);
  }
  return { style: 'avataaars', seed: 'default' };
};
