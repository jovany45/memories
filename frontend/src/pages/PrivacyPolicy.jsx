import { motion } from 'framer-motion';
import { Shield, Eye, Cookie, Lock, Database, UserX, FileText, AlertCircle, Laugh } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Eye,
      title: "Collecte des Données (On regarde tout... ou presque)",
      color: "text-blue-400",
      content: [
        {
          subtitle: "Ce qu'on collecte (parce que la loi nous y oblige)",
          items: [
            "📧 Ton adresse email (pour t'envoyer des trucs... légaux)",
            "👤 Ton nom d'utilisateur (parce que 'Utilisateur47' c'est moins fun)",
            "📸 Tes photos et vidéos de souvenirs (c'est quand même le but du site)",
            "🎨 Tes préférences de thème (on note si t'es Team Dark Mode)",
            "💬 Tes commentaires et publications (oui, même les commentaires embarrassants)",
            "🏆 Tes achievements et ton karma (on sait que tu farming les points)",
            "📊 Tes statistiques d'utilisation (combien de fois tu refresh la page par jour)"
          ]
        },
        {
          subtitle: "Comment on collecte ça",
          items: [
            "Directement quand tu t'inscris (logique, non ?)",
            "Automatiquement quand tu utilises le site (cookies et compagnie)",
            "Via ton navigateur qui balance tout (merci Chrome)",
            "Quand tu uploads des trucs (évidemment)"
          ]
        }
      ]
    },
    {
      icon: Database,
      title: "Utilisation des Données (Pourquoi on fait ça)",
      color: "text-green-400",
      content: [
        {
          subtitle: "On utilise tes données pour :",
          items: [
            "✅ Faire fonctionner le site (surprenant, hein ?)",
            "✅ Personnaliser ton expérience (façon marketing de dire 'on te piste')",
            "✅ Améliorer nos services (traduction : corriger les bugs que tu trouves)",
            "✅ Te protéger contre la fraude (oui, même toi tu peux être hacké)",
            "✅ Respecter nos obligations légales (le fameux RGPD qui nous embête)",
            "✅ T'envoyer des notifications importantes (genre 'ton mot de passe expire')",
            "❌ Vendre tes données à des publicitaires (promis, on fait pas ça... encore)"
          ]
        }
      ]
    },
    {
      icon: Lock,
      title: "Sécurité (On fait de notre mieux)",
      color: "text-purple-400",
      content: [
        {
          subtitle: "Comment on protège tes données :",
          items: [
            "🔐 Chiffrement des mots de passe (bcrypt avec salt, classe non ?)",
            "🛡️ Connexions HTTPS (le petit cadenas dans la barre d'adresse)",
            "🔒 Tokens JWT pour l'authentification (c'est sécurisé, trust me bro)",
            "💾 Base de données sécurisée sur MongoDB Atlas (ils s'occupent de tout)",
            "🚨 Monitoring des activités suspectes (on voit tout, Big Brother style)",
            "⚠️ Disclaimer : Aucun système n'est 100% sécurisé (désolé de briser le rêve)"
          ]
        },
        {
          subtitle: "Ce qu'on NE peut PAS garantir :",
          items: [
            "Que tu ne te fasses pas hacker si ton mot de passe est 'password123'",
            "Que ton petit frère n'utilisera pas ton compte si tu restes connecté",
            "Que l'apocalypse numérique n'arrivera jamais (prépare-toi quand même)",
            "Que la CIA/NSA/DGSE ne lit pas tes messages (spoiler : ils ont mieux à faire)"
          ]
        }
      ]
    },
    {
      icon: Cookie,
      title: "Cookies (Les biscuits numériques)",
      color: "text-orange-400",
      content: [
        {
          subtitle: "On utilise des cookies pour :",
          items: [
            "🍪 Te garder connecté (sinon tu devrais te relogger 47 fois par jour)",
            "🎨 Mémoriser tes préférences (ton thème cyberpunk adoré)",
            "📊 Analyser ton comportement (façon creepy de dire 'statistiques')",
            "⚡ Optimiser les performances (charger plus vite = moins d'attente)"
          ]
        },
        {
          subtitle: "Types de cookies :",
          items: [
            "Essentiels : Impossible de désactiver (le site marcherait pas)",
            "Analytiques : Désactivables (mais on aimerait bien les garder)",
            "Marketing : On en utilise pas (pour l'instant... 😏)"
          ]
        },
        {
          subtitle: "Fun fact :",
          items: [
            "Les cookies ne sont pas comestibles (désolé de te décevoir)",
            "Ils expirent automatiquement (comme le lait périmé)",
            "Tu peux les supprimer manuellement (au risque de tout casser)"
          ]
        }
      ]
    },
    {
      icon: UserX,
      title: "Tes Droits (Oui, t'en as)",
      color: "text-pink-400",
      content: [
        {
          subtitle: "Selon le RGPD, tu peux :",
          items: [
            "📖 Accéder à toutes tes données (on te fera un beau PDF)",
            "✏️ Rectifier tes informations (si tu t'es trompé de nom)",
            "🗑️ Supprimer ton compte (on sera tristes, mais c'est ton droit)",
            "📦 Exporter tes données (portabilité, c'est le terme chic)",
            "🚫 T'opposer au traitement (si vraiment ça te dérange)",
            "⏸️ Limiter le traitement (genre mode airplane pour tes données)",
            "👥 Retirer ton consentement (à tout moment, sans justification)"
          ]
        },
        {
          subtitle: "Comment exercer ces droits :",
          items: [
            "Contacte-nous par email (on répondra sous 30 jours max)",
            "Envoie un courrier recommandé (si t'es old school)",
            "Viens toquer à notre porte (bon courage pour nous trouver)"
          ]
        }
      ]
    },
    {
      icon: FileText,
      title: "Partage des Données (Avec qui on partage)",
      color: "text-cyan-400",
      content: [
        {
          subtitle: "On partage tes données avec :",
          items: [
            "💾 Notre hébergeur MongoDB Atlas (ils stockent tout)",
            "🖼️ Les CDNs pour les images (pour que ça charge vite)",
            "📧 Notre service email (pour t'envoyer des mails)",
            "👮 Les autorités si la loi l'exige (désolé, c'est obligatoire)",
            "❌ PERSONNE d'autre (sérieusement, on est pas des vendeurs de données)"
          ]
        },
        {
          subtitle: "On ne vendra JAMAIS :",
          items: [
            "Tes données personnelles à des tiers (croix de bois croix de fer)",
            "Ton historique de navigation (même si certains paient cher)",
            "Tes habitudes d'utilisation (on est pas Facebook)",
            "Ta liste d'amis (privacy first, baby)"
          ]
        }
      ]
    },
    {
      icon: AlertCircle,
      title: "Mineurs (Les moins de 18 ans)",
      color: "text-yellow-400",
      content: [
        {
          subtitle: "Protection des mineurs :",
          items: [
            "👶 Le site est destiné aux apprenants du centre (généralement majeurs)",
            "⚠️ Si t'as moins de 18 ans, demande l'autorisation parentale (sérieux)",
            "🚫 On collecte pas volontairement les données de mineurs de -13 ans",
            "📧 Si on découvre un mineur, on supprime ses données (désolé petit)"
          ]
        }
      ]
    },
    {
      icon: Database,
      title: "Durée de Conservation (On garde combien de temps)",
      color: "text-red-400",
      content: [
        {
          subtitle: "On garde tes données :",
          items: [
            "⏰ Tant que ton compte est actif (logique)",
            "📅 3 ans après la suppression de ton compte (obligations légales)",
            "🗄️ Indéfiniment pour les données anonymisées (stats globales)",
            "⚡ Immédiatement supprimées si tu le demandes (droit à l'oubli)"
          ]
        },
        {
          subtitle: "Exceptions :",
          items: [
            "Les données nécessaires pour les obligations légales (factures, logs)",
            "Les sauvegardes techniques (mais elles expirent aussi)",
            "Les données publiques (souvenirs partagés publiquement)"
          ]
        }
      ]
    }
  ];

  const funFacts = [
    "🤓 Fun fact : Personne ne lit jamais les politiques de confidentialité (sauf toi, apparemment)",
    "🎭 Cette politique est obligatoire par le RGPD, sinon on serait pas là",
    "☕ Si t'as lu jusqu'ici, va prendre un café, tu le mérites",
    "🏆 Achievement débloqué : 'Lecteur compulsif de CGU'",
    "💡 Astuce : Utilise un gestionnaire de mots de passe (stp)",
    "🔮 Prédiction : Tu vas fermer cet onglet dans 3... 2... 1..."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="text-8xl mb-4 inline-block"
          >
            🔒
          </motion.div>

          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Politique de Confidentialité</span>
          </h1>

          <p className="text-xl text-gray-400 mb-4 italic">
            (Le document que personne ne lit jamais... jusqu'à maintenant)
          </p>

          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-dark-800/50 backdrop-blur-sm px-6 py-3 rounded-full border border-white/5">
            <Shield size={16} className="text-green-400" />
            <span>Dernière mise à jour : 24 novembre 2025</span>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl max-w-3xl mx-auto">
            <p className="text-yellow-300 text-sm flex items-start space-x-2">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>
                <strong>Disclaimer :</strong> Cette politique est écrite avec humour mais reste 100% légale et conforme au RGPD. 
                Si t'as des questions sérieuses, contacte-nous (on répondra sérieusement, promis).
              </span>
            </p>
          </div>
        </motion.div>

        {/* Introduction sarcastique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 card"
        >
          <div className="flex items-start space-x-4">
            <Laugh size={32} className="text-purple-400 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Bienvenue dans le monde merveilleux de la confidentialité ! 🎪
              </h2>
              <div className="text-gray-300 space-y-3">
                <p>
                  Oui, on sait, les politiques de confidentialité c'est chiant. Mais le RGPD nous oblige à te dire exactement 
                  ce qu'on fait avec tes données. Alors autant rendre ça un peu moins soporifique, non ?
                </p>
                <p>
                  <strong className="text-primary-400">Spoiler :</strong> On collecte quelques trucs (normal pour un site web), 
                  on les protège (promis), et on ne les vend à personne (sérieusement). Voilà, t'as le résumé.
                </p>
                <p className="text-sm text-gray-400 italic">
                  Mais si t'es là, c'est que tu veux les détails. Alors allons-y ! ⬇️
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="mb-8"
          >
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-3 bg-dark-700 rounded-xl ${section.color}`}>
                  <section.icon size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              </div>

              {section.content.map((subsection, subIndex) => (
                <div key={subIndex} className={subIndex > 0 ? 'mt-6' : ''}>
                  {subsection.subtitle && (
                    <h3 className="text-lg font-semibold text-primary-300 mb-3">
                      {subsection.subtitle}
                    </h3>
                  )}
                  <ul className="space-y-2">
                    {subsection.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-300 flex items-start space-x-2">
                        <span className="text-primary-400 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card bg-gradient-to-r from-primary-500/10 to-purple-500/10 border-primary-500/30"
        >
          <div className="flex items-start space-x-4">
            <FileText size={32} className="text-primary-400 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Questions ? Réclamations ? Existential Crisis ?
              </h2>
              <div className="text-gray-300 space-y-3">
                <p>
                  Si t'as des questions sur cette politique, si tu veux exercer tes droits, ou si tu veux juste discuter 
                  de la vie, contacte-nous :
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <span className="text-primary-400">📧</span>
                    <span><strong>Email :</strong> privacy@2isalife.com</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-primary-400">⏰</span>
                    <span><strong>Délai de réponse :</strong> 30 jours max (mais souvent bien avant)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-primary-400">👮</span>
                    <span><strong>CNIL :</strong> Si on te répond pas, tu peux les contacter (mais stp, essaie nous d'abord)</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-400 italic mt-4">
                  Note : On répondra sérieusement à tes questions sérieuses. Promis, pas de blagues dans les emails officiels.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 space-y-4"
        >
          <h3 className="text-xl font-bold text-center text-white mb-6">
            🎉 Bonus : Fun Facts sur la vie privée
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {funFacts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-dark-800/50 rounded-xl border border-white/5 hover:border-primary-500/30 transition-all"
              >
                <p className="text-gray-300 text-sm text-center">{fact}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-16 text-center space-y-4"
        >
          <p className="text-gray-400">
            En utilisant ce site, tu acceptes cette politique de confidentialité 
            (même si t'as pas tout lu, on le sait).
          </p>
          <p className="text-gray-500 text-sm italic">
            "La vie privée est morte, mais au moins on essaie de la respecter" - Un développeur web anonyme, 2025
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            <Link to="/" className="btn-ghost">
              🏠 Retour à l'accueil
            </Link>
            <Link to="/terms" className="btn-ghost">
              📜 CGU (prochainement)
            </Link>
          </div>
        </motion.div>

        {/* Easter Egg */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-gray-600">
            🏆 Si tu lis ce texte, tu fais partie des 0.001% qui lisent jusqu'au bout. 
            <br />
            Respect. Tu mérites un cookie 🍪 (le vrai, pas le numérique).
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
