import User from '../models/User.js';

// Middleware pour vérifier si l'utilisateur est admin
export const isAdmin = async (req, res, next) => {
  try {
    console.log('🔐 isAdmin - Vérification. req.userId:', req.userId);
    
    // req.userId est déjà défini par le middleware authenticate
    if (!req.userId) {
      console.log('❌ isAdmin - Pas de userId');
      return res.status(401).json({ 
        message: '❌ Non authentifié. Accès refusé.' 
      });
    }

    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      console.log('❌ isAdmin - Utilisateur non trouvé');
      return res.status(404).json({ 
        message: '❌ Utilisateur non trouvé' 
      });
    }

    if (!user.isActive) {
      console.log('❌ isAdmin - Compte désactivé');
      return res.status(403).json({ 
        message: '❌ Compte désactivé' 
      });
    }

    if (user.role !== 'admin') {
      console.log('❌ isAdmin - Pas admin. Role:', user.role);
      return res.status(403).json({ 
        message: '🚫 Accès interdit. Droits administrateur requis.' 
      });
    }

    console.log('✅ isAdmin - OK. Admin:', user.username);
    
    // Utilisateur est admin, on continue
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Erreur middleware admin:', error);
    res.status(500).json({ 
      message: '❌ Erreur serveur',
      error: error.message
    });
  }
};

// Middleware optionnel pour logger les actions admin
export const logAdminAction = async (req, res, next) => {
  const action = {
    admin: req.user._id,
    action: req.method + ' ' + req.path,
    timestamp: new Date(),
    ip: req.ip
  };
  
  console.log('🔐 Action Admin:', action);
  // Ici tu pourrais sauvegarder dans une collection AdminLogs
  next();
};
