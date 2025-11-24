import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Pause, Trash2, Check, Volume2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const VoiceRecorder = ({ onRecordingComplete, existingAudio = null }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(existingAudio);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioUrl && !existingAudio) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl, existingAudio]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(url);
        setDuration(0);
        
        // Arrêter tous les tracks du stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);

      // Compteur de durée
      let seconds = 0;
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          seconds++;
          setDuration(seconds);
        }
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Impossible d\'accéder au microphone');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrl && !existingAudio) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    onRecordingComplete(null);
  };

  const confirmRecording = () => {
    if (audioBlob) {
      // Créer un fichier à partir du blob
      const file = new File([audioBlob], `vocal-${Date.now()}.webm`, { type: 'audio/webm' });
      onRecordingComplete(file);
      toast.success('🎤 Vocal enregistré !');
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!audioUrl && !isRecording ? (
          // État initial - Bouton pour démarrer
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-red-500/10 to-purple-500/10 rounded-2xl border-2 border-dashed border-red-500/30 hover:border-red-500/50 transition-all"
          >
            <button
              onClick={startRecording}
              className="group relative"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"
              />
              <div className="relative bg-gradient-to-br from-red-500 to-pink-500 p-6 rounded-full hover:from-red-600 hover:to-pink-600 transition-all shadow-lg shadow-red-500/50">
                <Mic className="w-10 h-10 text-white" />
              </div>
            </button>
            <p className="mt-4 text-gray-300 font-medium">Enregistrer un vocal</p>
            <p className="text-sm text-gray-500">Raconte ton anecdote oralement</p>
          </motion.div>
        ) : isRecording ? (
          // État d'enregistrement
          <motion.div
            key="recording"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-2xl p-6 border border-red-500/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-4 h-4 bg-red-500 rounded-full"
                />
                <span className="text-white font-semibold">
                  {isPaused ? 'En pause' : 'Enregistrement en cours...'}
                </span>
              </div>
              <span className="text-2xl font-mono text-red-400 font-bold">
                {formatTime(duration)}
              </span>
            </div>

            {/* Visualisation audio simplifiée */}
            <div className="flex items-center gap-1 h-16 mb-4">
              {[...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isPaused ? '20%' : ['20%', '100%', '20%'],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isPaused ? 0 : Infinity,
                    delay: i * 0.05,
                  }}
                  className="flex-1 bg-gradient-to-t from-red-500 to-pink-500 rounded-full"
                />
              ))}
            </div>

            <div className="flex gap-3">
              {!isPaused ? (
                <button
                  onClick={pauseRecording}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={resumeRecording}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Reprendre
                </button>
              )}
              <button
                onClick={stopRecording}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Square className="w-5 h-5" />
                Terminer
              </button>
            </div>
          </motion.div>
        ) : (
          // État de prévisualisation
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-purple-500/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 p-3 rounded-full">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Vocal enregistré</p>
                  <p className="text-sm text-gray-400">
                    {audioRef.current?.duration ? formatTime(audioRef.current.duration) : '0:00'}
                  </p>
                </div>
              </div>
            </div>

            {/* Audio player */}
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={handleAudioEnded}
              onTimeUpdate={handleTimeUpdate}
              className="hidden"
            />

            {/* Contrôles personnalisés */}
            <div className="space-y-3">
              {/* Barre de progression */}
              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{
                    width: audioRef.current?.duration
                      ? `${(currentTime / audioRef.current.duration) * 100}%`
                      : '0%',
                  }}
                />
              </div>

              {/* Boutons de contrôle */}
              <div className="flex gap-3">
                <button
                  onClick={togglePlayPause}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Écouter
                    </>
                  )}
                </button>
                <button
                  onClick={deleteRecording}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-3 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {!existingAudio && (
                <button
                  onClick={confirmRecording}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Valider ce vocal
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceRecorder;
