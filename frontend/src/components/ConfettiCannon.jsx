import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const ConfettiCannon = ({ trigger, intensity = 'medium', duration = 3000 }) => {
  useEffect(() => {
    if (trigger) {
      fireConfetti();
    }
  }, [trigger]);

  const fireConfetti = () => {
    const configs = {
      low: {
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      },
      medium: {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      },
      high: {
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 }
      },
      victory: {
        particleCount: 300,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#FFA500', '#FF6347']
      },
      rainbow: {
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']
      }
    };

    const config = configs[intensity] || configs.medium;

    // Fire confetti multiple times for effect
    const end = Date.now() + duration;
    
    const frame = () => {
      confetti({
        ...config,
        startVelocity: 30,
        ticks: 60,
        gravity: 1
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  // Preset animations
  const celebrations = {
    achievement: () => {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    },

    fireworks: () => {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        confetti({
          particleCount: 100,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2
          },
          colors: ['#FFD700', '#FF6347', '#4169E1', '#32CD32', '#FF1493']
        });
      }, 400);
    },

    snow: () => {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const skew = 1;

      (function frame() {
        const timeLeft = animationEnd - Date.now();
        const ticks = Math.max(200, 500 * (timeLeft / duration));
        
        confetti({
          particleCount: 1,
          startVelocity: 0,
          ticks: ticks,
          origin: {
            x: Math.random(),
            y: Math.random() * skew - 0.2
          },
          colors: ['#ffffff'],
          shapes: ['circle'],
          gravity: 0.3,
          scalar: 0.8,
          drift: Math.random() - 0.5
        });

        if (timeLeft > 0) {
          requestAnimationFrame(frame);
        }
      }());
    },

    stars: () => {
      const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['star'],
        colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8']
      };

      function shoot() {
        confetti({
          ...defaults,
          particleCount: 40,
          scalar: 1.2,
          shapes: ['star']
        });

        confetti({
          ...defaults,
          particleCount: 10,
          scalar: 0.75,
          shapes: ['circle']
        });
      }

      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);
    },

    emoji: (emojis = ['🎉', '🎊', '🥳', '✨', '🌟']) => {
      const scalar = 2;
      const confettiEmojis = confetti.shapeFromText({ text: emojis[Math.floor(Math.random() * emojis.length)], scalar });

      const defaults = {
        spread: 360,
        ticks: 60,
        gravity: 1,
        decay: 0.96,
        startVelocity: 20,
        shapes: [confettiEmojis],
        scalar
      };

      function shoot() {
        confetti({
          ...defaults,
          particleCount: 30
        });

        confetti({
          ...defaults,
          particleCount: 5
        });
      }

      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);
    }
  };

  return { celebrations };
};

// Hook pour utiliser facilement les confettis
export const useConfetti = () => {
  const fire = (type = 'medium', duration = 3000) => {
    const confettiCannon = ConfettiCannon({ trigger: true, intensity: type, duration });
    return confettiCannon;
  };

  const celebrate = (type = 'achievement') => {
    const confettiCannon = ConfettiCannon({ trigger: false });
    if (confettiCannon.celebrations[type]) {
      confettiCannon.celebrations[type]();
    }
  };

  return { fire, celebrate };
};

export default ConfettiCannon;
