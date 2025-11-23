import User from '../models/User.js';
import Memory from '../models/Memory.js';

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate({
        path: 'memories',
        match: { isPublic: true },
        options: { sort: { createdAt: -1 }, limit: 10 }
      });

    if (!user) {
      return res.status(404).json({ 
        message: '👻 Utilisateur introuvable' 
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du profil', 
      error: error.message 
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    // Check if user is updating their own profile
    if (req.params.id !== req.userId.toString()) {
      return res.status(403).json({ 
        message: '🚫 Tu ne peux modifier que ton propre profil !' 
      });
    }

    const { username, bio, avatar } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        message: '👻 Utilisateur introuvable' 
      });
    }

    // Update fields
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      message: '✅ Profil mis à jour !',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du profil', 
      error: error.message 
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des utilisateurs', 
      error: error.message 
    });
  }
};

export default { getUserProfile, updateUserProfile, getAllUsers };
