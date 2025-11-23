import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        message: '🔒 Accès refusé. Authentification requise !' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        message: '❌ Utilisateur non trouvé ou désactivé' 
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: '🔑 Token invalide' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '⏰ Session expirée, reconnectez-vous' });
    }
    
    res.status(500).json({ 
      message: 'Erreur d\'authentification', 
      error: error.message 
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: '🚫 Accès refusé. Droits administrateur requis.' 
    });
  }
  next();
};

export default { authenticate, isAdmin };
