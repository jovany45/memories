import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage pour les images/vidéos
const mediaStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: '2isalife/memories',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi', 'webm'],
    resource_type: 'auto',
    transformation: [
      { width: 1920, height: 1080, crop: 'limit' } // Limiter la taille max
    ]
  }
});

// Storage pour les fichiers audio
const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: '2isalife/audio',
    allowed_formats: ['mp3', 'wav', 'ogg', 'webm', 'm4a'],
    resource_type: 'video' // Cloudinary traite l'audio comme 'video'
  }
});

// Multer uploads
export const uploadMedia = multer({ 
  storage: mediaStorage,
  limits: { fileSize: Infinity }
});

export const uploadAudio = multer({ 
  storage: audioStorage,
  limits: { fileSize: Infinity }
});

// Upload multiple (media + audio)
export const uploadMultiple = multer({
  storage: mediaStorage, // Storage par défaut
  limits: { fileSize: Infinity }
}).fields([
  { name: 'media', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]);

export default cloudinary;
