import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import memoryRoutes from './routes/memories.js';
import gamificationRoutes from './routes/gamification.js';
import featuresRoutes from './routes/features.js';
import adminRoutes from './routes/admin.js';
import ideaBoxRoutes from './routes/ideaBox.js';
import complaintBoxRoutes from './routes/complaintBox.js';

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '500mb' })); // Pas de limite pour les JSON
app.use(express.urlencoded({ extended: true, limit: '500mb' })); // Pas de limite pour les form data

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/features', featuresRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/idea-box', ideaBoxRoutes);
app.use('/api/complaints', complaintBoxRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '🚀 Le serveur de 2ISALife est en ligne !',
    timestamp: new Date().toISOString()
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('📦 MongoDB connecté avec succès !');
    app.listen(PORT, () => {
      console.log(`🎉 Serveur lancé sur le port ${PORT}`);
      console.log(`🌐 http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  });

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Oups, quelque chose a planté ! 💥', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

export default app;
