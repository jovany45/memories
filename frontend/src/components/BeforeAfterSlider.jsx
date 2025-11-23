import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';

const BeforeAfterSlider = ({ beforeImage, afterImage, beforeLabel = 'Avant', afterLabel = 'Après' }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleTouchEnd = () => setIsDragging(false);

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">🔄 Avant / Après</h3>
        <p className="text-gray-400 text-sm">Glisse le curseur pour comparer</p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-lg overflow-hidden cursor-col-resize select-none bg-gray-900"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (bottom layer) */}
        <div className="absolute inset-0">
          <img
            src={afterImage}
            alt={afterLabel}
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* After Label */}
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {afterLabel}
          </div>
        </div>

        {/* Before Image (top layer with clip) */}
        <div
          className="absolute inset-0 transition-all duration-100"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
          }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* Before Label */}
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {beforeLabel}
          </div>
        </div>

        {/* Slider Line and Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Handle */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
            }}
          >
            <MoveHorizontal className="text-gray-900" size={24} />
          </motion.div>

          {/* Arrows */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="flex items-center space-x-8">
              <motion.div
                animate={{ x: [-5, -10, -5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-white text-2xl"
              >
                ←
              </motion.div>
              <motion.div
                animate={{ x: [5, 10, 5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-white text-2xl"
              >
                →
              </motion.div>
            </div>
          </div>
        </div>

        {/* Gradient Overlays for better visibility */}
        <div
          className="absolute top-0 left-0 w-1/4 h-full pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.3), transparent)'
          }}
        />
        <div
          className="absolute top-0 right-0 w-1/4 h-full pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(0,0,0,0.3), transparent)'
          }}
        />
      </div>

      {/* Info */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2 text-blue-400">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          <span>{beforeLabel}</span>
        </div>
        <div className="text-gray-400">
          {sliderPosition.toFixed(0)}% / {(100 - sliderPosition).toFixed(0)}%
        </div>
        <div className="flex items-center space-x-2 text-green-400">
          <span>{afterLabel}</span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
