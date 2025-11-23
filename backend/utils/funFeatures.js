// Cringe detector with sarcastic comments
export const calculateCringeScore = (memory) => {
  let score = 0;
  const comments = [];
  
  const text = `${memory.title} ${memory.description}`.toLowerCase();
  
  // Cringe indicators
  const indicators = [
    { pattern: /yolo|swag|lit/gi, points: 2, comment: "On est en 2015 ou quoi ? 😬" },
    { pattern: /😎{3,}/g, points: 3, comment: "Trop de lunettes de soleil tue les lunettes de soleil 🕶️" },
    { pattern: /!!+/g, points: 1, comment: "Calme ta ponctuation mec... 😅" },
    { pattern: /genre|du coup|en fait/gi, points: 1, comment: "Tics de langage détectés 🤔" },
    { pattern: /le meilleur|incroyable|extraordinaire/gi, points: 1, comment: "L'auto-congratulation, toujours classe 👏" },
    { pattern: /j'ai codé toute la nuit/gi, points: 2, comment: "Le flex du développeur qui ne dort pas 🥱" },
    { pattern: /premier|first/gi, points: 1, comment: "Premier commentaire IRL 🏆" },
    { pattern: /mdr|lol|ptdr/gi, points: 1, comment: "L'humour 2.0 dans toute sa splendeur 😂" }
  ];
  
  indicators.forEach(({ pattern, points, comment }) => {
    if (pattern.test(text)) {
      score += points;
      comments.push(comment);
    }
  });
  
  // Check excessive emojis
  const emojiCount = (text.match(/[\u{1F600}-\u{1F64F}]/gu) || []).length;
  if (emojiCount > 10) {
    score += 2;
    comments.push("C'est un message ou un magasin d'emojis ? 🎪");
  }
  
  // Check ALL CAPS
  const capsWords = text.match(/\b[A-Z]{4,}\b/g) || [];
  if (capsWords.length > 2) {
    score += 2;
    comments.push("POURQUOI TU CRIES COMME ÇA ? 📢");
  }
  
  // Clamp score between 0 and 10
  score = Math.min(score, 10);
  
  // Generate overall comment based on score
  let overallComment = '';
  if (score === 0) {
    overallComment = "Parfaitement normal, rien à signaler 👌";
  } else if (score <= 2) {
    overallComment = "Léger malaise détecté, mais ça passe 😊";
  } else if (score <= 4) {
    overallComment = "Hmmm, on entre en territoire cringe 😬";
  } else if (score <= 6) {
    overallComment = "Aïe aïe aïe, le cringe est réel ! 🙈";
  } else if (score <= 8) {
    overallComment = "ALERTE ROUGE : Niveau cringe critique ! 🚨";
  } else {
    overallComment = "EXPLOSION DE CRINGE ! On atteint des sommets ! 💥😱";
  }
  
  return {
    score,
    comment: overallComment,
    details: comments
  };
};

// Sarcastic "Did You Mean" suggestions
export const getSarcasticSuggestions = (searchTerm) => {
  const suggestions = {
    'bug': [
      'feature non documentée 🐛',
      'comportement inattendu mais intentionnel',
      'erreur 404: logique not found'
    ],
    'error': [
      'opportunité d\'apprentissage 📚',
      'feature surprise',
      'le code qui fait des siennes'
    ],
    'crash': [
      'redémarrage spontané 💥',
      'fermeture imprévue mais énergique',
      'sortie express de l\'application'
    ],
    'code': [
      'poésie numérique 💻',
      'art abstrait informatique',
      'suite de caractères mystérieux'
    ],
    'debug': [
      'chasse au trésor numérique 🔍',
      'partie de cache-cache avec les erreurs',
      'thérapie de code'
    ],
    'deploy': [
      'moment de prière 🙏',
      'roulette russe informatique',
      'envoyer le bébé en prod'
    ],
    'prod': [
      'environnement de test grandeur nature 🎪',
      'où les vrais bugs se révèlent',
      'terrain de jeu des utilisateurs'
    ],
    'senior': [
      'celui qui copie-colle de Stack Overflow avec style 😎',
      'expert en recherche Google',
      'junior avec plus d\'années'
    ]
  };
  
  const term = searchTerm.toLowerCase();
  
  for (const [key, values] of Object.entries(suggestions)) {
    if (term.includes(key)) {
      return {
        original: searchTerm,
        suggestions: values,
        message: `Vous cherchiez "${searchTerm}", mais vouliez-vous vraiment dire...`
      };
    }
  }
  
  return null;
};

// Daily challenges generator
export const generateDailyChallenges = () => {
  const challenges = [
    { text: "Partage un souvenir où tu as appris quelque chose", icon: "📚" },
    { text: "Raconte ton pire bug et comment tu l'as résolu", icon: "🐛" },
    { text: "Partage un moment de victoire en code", icon: "🏆" },
    { text: "Montre-nous ton setup de travail", icon: "💻" },
    { text: "Raconte une anecdote drôle du centre", icon: "😂" },
    { text: "Partage un conseil que tu donnerais à ton toi du passé", icon: "💡" },
    { text: "Montre un projet dont tu es fier", icon: "⭐" },
    { text: "Raconte comment tu as surmonté une difficulté", icon: "💪" },
    { text: "Partage ton langage/techno préféré et pourquoi", icon: "❤️" },
    { text: "Montre-nous ton meme de dev préféré", icon: "🤣" },
    { text: "Raconte un moment d'entraide avec un collègue", icon: "🤝" },
    { text: "Partage ton outil/extension VS Code favori", icon: "🛠️" },
    { text: "Raconte ta première ligne de code", icon: "👶" },
    { text: "Montre un Before/After de ton évolution", icon: "📈" },
    { text: "Partage un moment de frustration devenu victoire", icon: "🎯" }
  ];
  
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const index = dayOfYear % challenges.length;
  
  return challenges[index];
};

// Memory mashup generator
export const createMemoryMashup = (memory1, memory2) => {
  const mashup = {
    title: `${memory1.title.split(' ')[0]} meets ${memory2.title.split(' ')[0]}`,
    description: `Un mélange explosif entre "${memory1.title}" et "${memory2.title}"`,
    mood: memory1.mood === memory2.mood ? memory1.mood : 'geek',
    tags: [...new Set([...memory1.tags, ...memory2.tags])],
    mashupOf: [memory1._id, memory2._id]
  };
  
  return mashup;
};
