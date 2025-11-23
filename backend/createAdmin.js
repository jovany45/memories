import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 MongoDB connecté');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: 'jovany.bernez@gmail.com' });

    if (existingAdmin) {
      console.log('👤 Admin déjà existant:', existingAdmin.username);
      
      // Mettre à jour le rôle et le mot de passe si nécessaire
      existingAdmin.role = 'admin';
      existingAdmin.password = await bcrypt.hash('Jojo4589!', 10);
      existingAdmin.isActive = true;
      await existingAdmin.save();
      
      console.log('✅ Compte admin mis à jour !');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Username:', existingAdmin.username);
      console.log('🔐 Rôle:', existingAdmin.role);
    } else {
      // Créer le compte admin
      const hashedPassword = await bcrypt.hash('Jojo4589!', 10);

      const adminUser = new User({
        username: 'SuperAdmin',
        email: 'jovany.bernez@gmail.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        bio: '👑 Administrateur principal du site Memories',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        karma: 9999
      });

      await adminUser.save();

      console.log('✅ Compte administrateur créé avec succès !');
      console.log('📧 Email: jovany.bernez@gmail.com');
      console.log('🔑 Mot de passe: Jojo4589!');
      console.log('👤 Username: SuperAdmin');
      console.log('🔐 Rôle: admin');
      console.log('⚡ Karma: 9999');
    }

    await mongoose.disconnect();
    console.log('👋 Déconnexion de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

createAdminUser();
