import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Le nom d\'utilisateur est requis'],
    unique: true,
    trim: true,
    minlength: [3, 'Le nom doit contenir au moins 3 caractères'],
    maxlength: [30, 'Le nom ne peut pas dépasser 30 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  },
  avatar: {
    type: String,
    default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
  },
  bio: {
    type: String,
    maxlength: [500, 'La bio ne peut pas dépasser 500 caractères'],
    default: '✨ Futur pro de l\'informatique en formation !'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  memories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memory'
  }],
  
  // Karma & Achievements System
  karma: {
    type: Number,
    default: 0
  },
  achievements: [{
    id: String,
    name: String,
    icon: String,
    unlockedAt: Date,
    description: String
  }],
  
  // Theme preference
  theme: {
    type: String,
    enum: ['default', 'cyberpunk', 'zen', 'retro', 'pride', 'hacker'],
    default: 'default'
  },
  
  // Stats for achievements
  stats: {
    memoriesCreated: { type: Number, default: 0 },
    commentsGiven: { type: Number, default: 0 },
    likesReceived: { type: Number, default: 0 },
    consecutiveDays: { type: Number, default: 0 },
    lastActiveDate: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
