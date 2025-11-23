import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Memory from './models/Memory.js';
import MemoryDuel from './models/MemoryDuel.js';

dotenv.config();

const createTestDuel = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 MongoDB connecté');

    // Récupérer 2 souvenirs aléatoires
    const memories = await Memory.find().limit(2);

    if (memories.length < 2) {
      console.log('❌ Pas assez de souvenirs dans la base. Créez au moins 2 souvenirs d\'abord.');
      process.exit(1);
    }

    // Créer un duel
    const duel = new MemoryDuel({
      memory1: memories[0]._id,
      memory2: memories[1]._id,
      title: `Battle: ${memories[0].title} vs ${memories[1].title}`,
      status: 'active',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      votes: []
    });

    await duel.save();

    console.log('✅ Duel de test créé avec succès !');
    console.log(`⚔️ ${memories[0].title} VS ${memories[1].title}`);
    console.log(`🆔 ID: ${duel._id}`);
    console.log(`📅 Fin: ${duel.endDate}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

createTestDuel();
