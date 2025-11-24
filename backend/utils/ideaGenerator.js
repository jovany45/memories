// 🎯 Générateur d'idées de publications pour 2ISA

export const IDEAS_DATABASE = {
  // 30 idées sobres et normales sur la vie en formation
  normal: [
    "Partage ton premier jour à 2ISA et ce qui t'a le plus marqué",
    "Raconte une pause café mémorable avec tes collègues",
    "Décris le moment où tu as enfin compris un concept difficile",
    "Partage une collaboration réussie sur un projet de groupe",
    "Raconte ton meilleur souvenir de déjeuner à la cantine",
    "Décris l'ambiance pendant une session de coding intense",
    "Partage un conseil qu'un formateur t'a donné et qui t'a aidé",
    "Raconte une présentation de projet dont tu es fier",
    "Décris une discussion inspirante avec un camarade",
    "Partage ton workspace préféré dans le centre",
    "Raconte un moment d'entraide entre apprenants",
    "Décris ta routine matinale avant d'arriver à 2ISA",
    "Partage une victoire personnelle dans ton apprentissage",
    "Raconte un brainstorming créatif avec ton équipe",
    "Décris l'évolution de tes compétences depuis le début",
    "Partage un moment de solidarité dans la classe",
    "Raconte une pause déjeuner sous le soleil",
    "Décris ton coin préféré pour travailler",
    "Partage une anecdote sur les transports pour venir à 2ISA",
    "Raconte un moment où tu as aidé quelqu'un",
    "Décris l'ambiance pendant les examens",
    "Partage une tradition qui s'est créée dans ta promo",
    "Raconte un moment de stress surmonté ensemble",
    "Décris une célébration après un rendu de projet",
    "Partage ton évolution depuis ton arrivée",
    "Raconte une discussion passionnante pendant la pause",
    "Décris un moment de concentration collective",
    "Partage une phrase motivante affichée dans la salle",
    "Raconte ton rituel avant une présentation importante",
    "Décris l'énergie de fin de semaine à 2ISA"
  ],

  // 30 idées WTF, décalées, drôles et comiques
  wtf: [
    "Raconte le bug le plus ridicule que tu aies créé (et comment tu l'as défendu comme une 'feature')",
    "Partage le pire nom de variable que tu aies jamais vu dans ton code",
    "Décris ta théorie du complot sur la machine à café de 2ISA",
    "Raconte le moment où tu as parlé à ton code comme à un humain",
    "Partage ta méthode de debugging : le rubber duck ou crier sur ton écran ?",
    "Décris le sandwich le plus créatif/horrible de la cantine",
    "Raconte ta tentative de coder après 23h (spoiler: ça a mal tourné)",
    "Partage le surnom secret de ton formateur préféré",
    "Décris ta chorégraphie de victoire quand ton code compile enfin",
    "Raconte le moment où tu as confondu Java et JavaScript (on ne te juge pas)",
    "Partage le nombre de cafés/Red Bull nécessaires pour finir ton dernier projet",
    "Décris le commit message le plus honnête que tu n'as jamais osé push",
    "Raconte ta guerre personnelle contre les points-virgules",
    "Partage ta collection de memes envoyés dans le groupe WhatsApp de la promo",
    "Décris ton ritual bizarre avant de lancer 'npm install'",
    "Raconte le moment où tu as découvert que tu pouvais Ctrl+Z dans la vraie vie (spoiler: non)",
    "Partage ta playlist de concentration qui fait flipper tout le monde",
    "Décris le jour où tu as réalisé que tu rêvais en code",
    "Raconte ta théorie sur pourquoi les printers détestent les développeurs",
    "Partage le pire conseil de Stack Overflow que tu aies suivi aveuglément",
    "Décris ton explication la plus délirante pour justifier un retard",
    "Raconte le moment où tu as essayé d'expliquer ton métier à ta grand-mère",
    "Partage ta technique secrète pour paraître occupé pendant les pauses",
    "Décris la fois où tu as copié-collé un emoji dans ton code par accident",
    "Raconte ton combat épique contre un câble qui ne voulait pas se brancher",
    "Partage le message d'erreur le plus poétique que tu aies reçu",
    "Décris ta transformation en zombie après une nuit de rush",
    "Raconte la fois où tu as blame Git alors que c'était 100% ta faute",
    "Partage ton excuse la plus créative pour une deadline manquée",
    "Décris le moment où tu as réalisé que tu parlais en HTML (<strong>vraiment</strong>)"
  ],

  // 30 idées geek, pop culture et références
  geek: [
    "Compare ta promo aux Avengers : qui est qui et pourquoi ?",
    "Raconte ton projet comme si c'était un épisode de Black Mirror",
    "Partage quel personnage de The Office représente le mieux ton état d'esprit actuel",
    "Décris 2ISA version Stranger Things : qui est dans l'Upside Down du code ?",
    "Raconte ton debugging comme une bataille de Game of Thrones",
    "Partage quel Pokémon tu serais en tant que développeur",
    "Décris ta journée type façon RPG : quêtes, PNJ, boss final",
    "Raconte ton projet comme un film de Christopher Nolan (avec plot twist)",
    "Partage quel super-pouvoir de Marvel/DC te sauverait la vie en coding",
    "Décris ton formateur comme un personnage de Harry Potter (maison incluse)",
    "Raconte ta deadline comme un film Fast & Furious (famille et vitesse)",
    "Partage quel stand de JoJo représente ton style de code",
    "Décris 2ISA version The Matrix : pilule rouge ou bleue ?",
    "Raconte ton parcours comme un anime de shonen (arc de formation inclus)",
    "Partage quel méchant de Disney serait ton bug le plus récalcitrant",
    "Décris ta stack technique comme une équipe de League of Legends",
    "Raconte ton code review comme un épisode de Top Chef",
    "Partage quel meme tu deviendrais si tu étais célèbre",
    "Décris ton projet comme un épisode de Rick & Morty",
    "Raconte ta soutenance comme un anime de combat (transformation finale)",
    "Partage quel personnage de sitcom tu es pendant les standup meetings",
    "Décris ton workflow comme un niveau de Dark Souls (difficulté incluse)",
    "Raconte ton apprentissage comme un arc narratif de Breaking Bad",
    "Partage quel Titan d'Attack on Titan représente ton deadline",
    "Décris ta relation avec Git comme une relation amoureuse de série Netflix",
    "Raconte ton coffee break comme un épisode de Friends (Central Perk vibes)",
    "Partage quel boss de jeu vidéo représente ton projet final",
    "Décris ton code legacy comme des reliques archéologiques d'Indiana Jones",
    "Raconte ta promo comme la formation des X-Men (mutants et tout)",
    "Partage quelle opening d'anime jouerait au début de ta journée à 2ISA"
  ]
};

// Fonction pour obtenir une idée aléatoire
export const getRandomIdea = (category = null) => {
  if (category && IDEAS_DATABASE[category]) {
    const ideas = IDEAS_DATABASE[category];
    return {
      idea: ideas[Math.floor(Math.random() * ideas.length)],
      category: category
    };
  }

  // Sélection aléatoire de catégorie
  const categories = Object.keys(IDEAS_DATABASE);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const ideas = IDEAS_DATABASE[randomCategory];

  return {
    idea: ideas[Math.floor(Math.random() * ideas.length)],
    category: randomCategory
  };
};

// Fonction pour obtenir plusieurs idées aléatoires uniques
export const getMultipleIdeas = (count = 5, category = null) => {
  const selectedIdeas = new Set();
  const results = [];

  let sourceIdeas = [];
  if (category && IDEAS_DATABASE[category]) {
    sourceIdeas = IDEAS_DATABASE[category].map(idea => ({ idea, category }));
  } else {
    // Mélanger toutes les catégories
    Object.entries(IDEAS_DATABASE).forEach(([cat, ideas]) => {
      ideas.forEach(idea => sourceIdeas.push({ idea, category: cat }));
    });
  }

  // Mélanger le tableau
  const shuffled = sourceIdeas.sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    results.push(shuffled[i]);
  }

  return results;
};

// Fonction pour obtenir les statistiques
export const getIdeaStats = () => {
  return {
    total: Object.values(IDEAS_DATABASE).reduce((acc, arr) => acc + arr.length, 0),
    byCategory: {
      normal: IDEAS_DATABASE.normal.length,
      wtf: IDEAS_DATABASE.wtf.length,
      geek: IDEAS_DATABASE.geek.length
    }
  };
};

export default {
  IDEAS_DATABASE,
  getRandomIdea,
  getMultipleIdeas,
  getIdeaStats
};
