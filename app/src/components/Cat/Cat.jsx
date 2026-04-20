import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CAT_STATES = {
  idle: { emoji: '😺', label: 'idle' },
  happy: { emoji: '😸', label: 'happy' },
  thinking: { emoji: '🤔', label: 'thinking' },
  surprised: { emoji: '😲', label: 'surprised' },
  eating: { emoji: '😋', label: 'eating' },
  sleeping: { emoji: '😴', label: 'sleeping' },
  question: { emoji: '🙀', label: 'question' },
};

const IDLE_ANIMATIONS = ['sleeping', 'thinking'];

export function Cat({ state = 'idle', size = 120, speech, className }) {
  const [currentState, setCurrentState] = useState(state);
  const [idleTimer, setIdleTimer] = useState(null);

  useEffect(() => {
    setCurrentState(state);
  }, [state]);

  // random idle animations when in idle state
  useEffect(() => {
    if (state !== 'idle') return;
    const timer = setTimeout(() => {
      const anim = IDLE_ANIMATIONS[Math.floor(Math.random() * IDLE_ANIMATIONS.length)];
      setCurrentState(anim);
      setTimeout(() => setCurrentState('idle'), 2500);
    }, 8000 + Math.random() * 6000);
    setIdleTimer(timer);
    return () => clearTimeout(timer);
  }, [state, currentState]);

  const cat = CAT_STATES[currentState] || CAT_STATES.idle;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentState}
          style={{ fontSize: size, lineHeight: 1, userSelect: 'none' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25, type: 'spring', stiffness: 300 }}
        >
          {cat.emoji}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {speech && (
          <motion.div
            style={styles.bubble}
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {speech}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  bubble: {
    background: '#fff',
    border: '3px solid #FFD166',
    borderRadius: 20,
    padding: '12px 20px',
    fontSize: 18,
    fontWeight: 600,
    color: '#333',
    maxWidth: 260,
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    fontFamily: 'sans-serif',
  },
};
