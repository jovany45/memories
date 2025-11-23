import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 MongoDB connecté');

    // Chercher tous les utilisateurs avec ces emails
    const users = await User.find({
      $or: [
        { email: 'jovany.bernez@gmail.com' },
        { email: 'jovanybernez@gmail.com' }
      ]
    }).select('-password');

    console.log('\n📋 Utilisateurs trouvés:');
    users.forEach(user => {
      console.log(`\n👤 Username: ${user.username}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔐 Role: ${user.role}`);
      console.log(`⚡ Karma: ${user.karma}`);
      console.log(`🆔 ID: ${user._id}`);
    });

    if (users.length === 0) {
      console.log('\n❌ Aucun utilisateur trouvé avec ces emails !');
    }

    // Mettre à jour le compte admin si nécessaire
    const userToUpdate = users.find(u => u.email === 'jovanybernez@gmail.com');
    if (userToUpdate && userToUpdate.role !== 'admin') {
      userToUpdate.role = 'admin';
      await userToUpdate.save();
      console.log('\n✅ Rôle admin attribué à jovanybernez@gmail.com');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

checkAdminUser();
