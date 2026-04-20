import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cat } from '../../Cat/Cat';
import { useSpeech } from '../../../hooks/useSpeech';

export function LetterIntro({ exercise, level, onComplete }) {
  const { speakLetter, sayWithName } = useSpeech();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [catState, setCatState] = useState('idle');
  const letters = exercise.letters;
  const currentLetter = letters[currentIndex];

  useEffect(() => {
    const timer = setTimeout(() => {
      sayWithName(`{name}, послушай новые буквы!`);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleTap = () => {
    speakLetter(currentLetter);
    setCatState('happy');
    setTimeout(() => setCatState('idle'), 1200);

    if (currentIndex < letters.length - 1) {
      setTimeout(() => setCurrentIndex(i => i + 1), 1000);
    } else {
      setTimeout(() => onComplete(3), 1200);
    }
  };

  return (
    <div style={styles.screen}>
      <div style={styles.catRow}>
        <Cat state={catState} size={90} speech={`Звук: ${currentLetter}!`} />
      </div>

      <div style={styles.progress}>
        {letters.map((l, i) => (
          <div
            key={l}
            style={{
              ...styles.dot,
              background: i <= currentIndex ? '#FF9EBC' : '#ddd',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.button
          key={currentLetter}
          style={styles.letterBtn}
          onClick={handleTap}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          whileTap={{ scale: 0.92 }}
        >
          {currentLetter}
        </motion.button>
      </AnimatePresence>

      <p style={styles.hint}>Нажми на букву, чтобы услышать звук!</p>

      <div style={styles.counter}>
        {currentIndex + 1} / {letters.length}
      </div>
    </div>
  );
}

const styles = {
  screen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
    padding: '20px',
    fontFamily: 'sans-serif',
  },
  catRow: { display: 'flex', justifyContent: 'center' },
  progress: { display: 'flex', gap: 8 },
  dot: { width: 12, height: 12, borderRadius: '50%' },
  letterBtn: {
    fontSize: 160,
    fontWeight: 900,
    lineHeight: 1,
    background: 'linear-gradient(135deg, #FF9EBC, #FFD166)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    filter: 'drop-shadow(0 4px 12px rgba(255,100,150,0.3))',
  },
  hint: {
    fontSize: 18,
    color: '#888',
    margin: 0,
    textAlign: 'center',
  },
  counter: {
    fontSize: 16,
    color: '#aaa',
    fontWeight: 600,
  },
};
