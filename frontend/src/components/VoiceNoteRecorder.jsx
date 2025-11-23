import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Play, Pause, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const VoiceNoteRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success('🎤 Enregistrement démarré');
    } catch (error) {
      toast.error('Impossible d\'accéder au microphone');
      console.error('Microphone error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      toast.success('✅ Enregistrement terminé');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioBlob(null);
    setAudioURL(null);
    setIsPlaying(false);
    setDuration(0);
    toast.success('🗑️ Enregistrement supprimé');
  };

  const uploadRecording = () => {
    if (audioBlob && onRecordingComplete) {
      // Créer un File object à partir du Blob
      const file = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });
      onRecordingComplete(file);
      toast.success('📤 Note vocale ajoutée');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2">
          <Mic className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Note Vocale</h3>
          <p className="text-sm text-gray-400">Enregistre un message audio</p>
        </div>
      </div>

      {/* Recording/Playback Interface */}
      <div className="bg-gray-800 rounded-lg p-6">
        {!audioURL ? (
          // Recording Mode
          <div className="text-center">
            {isRecording && (
              <div className="mb-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block"
                >
                  <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-4">
                    <Mic className="text-white" size={40} />
                  </div>
                </motion.div>
                <div className="text-3xl font-bold text-white mb-2">
                  {formatTime(recordingTime)}
                </div>
                <p className="text-gray-400">
                  {isPaused ? '⏸️ En pause' : '🔴 Enregistrement en cours...'}
                </p>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-full transition-all transform hover:scale-105"
                >
                  <div className="flex items-center space-x-2">
                    <Mic size={24} />
                    <span>Démarrer</span>
                  </div>
                </button>
              ) : (
                <>
                  <button
                    onClick={pauseRecording}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-4 rounded-full transition-all"
                  >
                    {isPaused ? <Play size={24} /> : <Pause size={24} />}
                  </button>
                  <button
                    onClick={stopRecording}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-4 rounded-full transition-all"
                  >
                    <Square size={24} />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          // Playback Mode
          <div>
            <audio
              ref={audioRef}
              src={audioURL}
              onEnded={() => setIsPlaying(false)}
              onLoadedMetadata={(e) => setDuration(Math.floor(e.target.duration))}
            />

            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                {isPlaying ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <Play className="text-white" size={40} />
                  </motion.div>
                ) : (
                  <Play className="text-white" size={40} />
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {formatTime(duration)}
              </div>
              <p className="text-gray-400">Note vocale prête</p>
            </div>

            {/* Waveform Visualization (simplified) */}
            <div className="flex items-center justify-center space-x-1 mb-6">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isPlaying ? [12, 24, 12] : 12
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isPlaying ? Infinity : 0,
                    delay: i * 0.05
                  }}
                  className="w-1 bg-primary-500 rounded-full"
                  style={{ height: 12 }}
                />
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={playAudio}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-6 py-3 rounded-lg transition-all"
              >
                <div className="flex items-center space-x-2">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  <span>{isPlaying ? 'Pause' : 'Écouter'}</span>
                </div>
              </button>
              <button
                onClick={deleteRecording}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-lg transition-all"
              >
                <div className="flex items-center space-x-2">
                  <Trash2 size={20} />
                  <span>Supprimer</span>
                </div>
              </button>
              <button
                onClick={uploadRecording}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition-all"
              >
                <div className="flex items-center space-x-2">
                  <Upload size={20} />
                  <span>Utiliser</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-4 text-center text-sm text-gray-500">
        💡 Astuce : Les notes vocales rendent tes souvenirs encore plus personnels
      </div>
    </div>
  );
};

export default VoiceNoteRecorder;
