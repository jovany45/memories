import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Image, Video, FileText, Sparkles, Mic } from 'lucide-react';
import { memoryAPI } from '../api';
import toast from 'react-hot-toast';
import VoiceRecorder from '../components/VoiceRecorder';

const CreateMemory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'photo',
    mood: 'wholesome',
    tags: '',
    isPublic: true
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioRecorded = (file) => {
    setAudioFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('type', formData.type);
      data.append('mood', formData.mood);
      data.append('tags', formData.tags);
      data.append('isPublic', formData.isPublic);
      
      if (mediaFile) {
        data.append('media', mediaFile);
      }
      
      if (audioFile) {
        data.append('audio', audioFile);
      }

      await memoryAPI.createMemory(data);
      toast.success('🎉 Souvenir créé avec succès !');
      navigate('/');
    } catch (error) {
      toast.error('Erreur lors de la création du souvenir');
      console.error('Create memory error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            ✨
          </motion.div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Partage un Souvenir
          </h1>
          <p className="text-gray-400">
            Immortalise ce moment unique ! 📸
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                📝 Titre du souvenir
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Notre première victoire en hackathon ! 🏆"
                className="input"
                required
              />
            </div>

            {/* Type & Mood */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🎭 Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="photo">📸 Photo</option>
                  <option value="video">🎥 Vidéo</option>
                  <option value="anecdote">📝 Anecdote</option>
                  <option value="moment">⭐ Moment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  😊 Ambiance
                </label>
                <select
                  name="mood"
                  value={formData.mood}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="funny">😂 Drôle</option>
                  <option value="emotional">🥺 Émouvant</option>
                  <option value="epic">🔥 Épique</option>
                  <option value="geek">🤓 Geek</option>
                  <option value="sarcastic">😏 Sarcastique</option>
                  <option value="wholesome">🥰 Wholesome</option>
                  <option value="cringe">😬 Cringe</option>
                  <option value="excited">🤩 Excité</option>
                  <option value="nostalgic">🌅 Nostalgique</option>
                  <option value="proud">💪 Fier</option>
                  <option value="mysterious">🌙 Mystérieux</option>
                  <option value="romantic">💕 Romantique</option>
                  <option value="zen">🧘 Zen</option>
                  <option value="chaotic">🌪️ Chaotique</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                💬 Raconte-nous l'histoire
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décris ce moment mémorable..."
                className="textarea"
                rows={5}
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🏷️ Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="coding, fun, teamwork, victory"
                className="input"
              />
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {formData.type === 'video' ? '🎥' : '📸'} Média (optionnel)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                  onChange={handleFileChange}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="flex items-center justify-center w-full h-32 glass-dark rounded-lg border-2 border-dashed border-white/20 hover:border-primary-500 cursor-pointer transition-all"
                >
                  {mediaPreview ? (
                    <div className="relative w-full h-full">
                      {formData.type === 'video' ? (
                        <video
                          src={mediaPreview}
                          className="w-full h-full object-cover rounded-lg"
                          controls
                        />
                      ) : (
                        <img
                          src={mediaPreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload size={32} className="mx-auto mb-2 text-primary-400" />
                      <p className="text-gray-400">Clique pour uploader</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Voice Recorder */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                🎤 Anecdote vocale (optionnel)
              </label>
              <VoiceRecorder onRecordingComplete={handleAudioRecorded} />
              {audioFile && (
                <p className="mt-2 text-sm text-green-400 flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Vocal enregistré et prêt à être publié !
                </p>
              )}
            </div>

            {/* Public/Private */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-5 h-5 rounded border-gray-600 text-primary-500 focus:ring-primary-500"
              />
              <label htmlFor="isPublic" className="text-gray-300">
                🌍 Rendre ce souvenir public
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Publication...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Publier le souvenir</span>
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateMemory;
