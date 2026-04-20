import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cat } from '../../Cat/Cat';
import { useSpeech } from '../../../hooks/useSpeech';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function Sorting({ exercise, onComplete }) {
  const { speak, sayWithName } = useSpeech();
  const { vowelA, vowelB, syllables } = exercise;
  const [queue, setQueue] = useState(() => shuffle(syllables));
  const [catState, setCatState] = useState('idle');
  const [speech, setSpeech] = useState('');
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [errors, setErrors] = useState(0);
  const [flash, setFlash] = useState(null); // 'A' | 'B' | null

  const current = queue[0];

  useEffect(() => {
    setTimeout(() => {
      setSpeech(`Сортируй слоги по буквам ${vowelA} и ${vowelB}!`);
      sayWithName(`{name}, раскладывай слоги по корзинкам!`);
    }, 400);
  }, []);

  const handleBasket = (basket) => {
    if (!current) return;
    const correctBasket = current.includes(vowelA) ? 'A' : 'B';
    const isCorrect = basket === correctBasket;

    speak(current);
    setFlash(basket);
    setTimeout(() => setFlash(null), 500);

    if (isCorrect) {
      if (basket === 'A') setScoreA(s => s + 1);
      else setScoreB(s => s + 1);
      setCatState('happy');
      setSpeech('Верно!');
    } else {
      setErrors(e => e + 1);
      setCatState('thinking');
      setSpeech('Мя-р-р? Попробуй другую корзинку!');
    }

    const newQueue = queue.slice(1);
    setTimeout(() => {
      setCatState('idle');
      setQueue(newQueue);
      if (newQueue.length === 0) {
        const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
        onComplete(stars);
      } else {
        setSpeech(`Сортируй!`);
      }
    }, 900);
  };

  return (
    <div style={styles.screen}>
      <div style={styles.catRow}>
        <Cat state={catState} size={80} speech={speech} />
      </div>

      {/* Falling syllable */}
      <div style={styles.syllableArea}>
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current + queue.length}
              style={styles.syllableCard}
              initial={{ y: -60, opacity: 0, scale: 0.7 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
            >
              {current}
            </motion.div>
          )}
        </AnimatePresence>
        <div style={styles.remaining}>{queue.length} осталось</div>
      </div>

      {/* Baskets */}
      <div style={styles.baskets}>
        <motion.button
          style={{
            ...styles.basket,
            background: flash === 'A' ? '#06D6A0' : '#FFE4EF',
            borderColor: '#FF9EBC',
          }}
          onClick={() => handleBasket('A')}
          whileTap={{ scale: 0.92 }}
        >
          <span style={styles.basketLetter}>{vowelA}</span>
          <span style={styles.basketScore}>{scoreA}</span>
          <span style={styles.basketIcon}>🧺</span>
        </motion.button>
        <motion.button
          style={{
            ...styles.basket,
            background: flash === 'B' ? '#06D6A0' : '#EFF4FF',
            borderColor: '#8CB4FF',
          }}
          onClick={() => handleBasket('B')}
          whileTap={{ scale: 0.92 }}
        >
          <span style={styles.basketLetter}>{vowelB}</span>
          <span style={styles.basketScore}>{scoreB}</span>
          <span style={styles.basketIcon}>🧺</span>
        </motion.button>
      </div>
    </div>
  );
}

const styles = {
  screen: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'space-around', height: '100%',
    padding: '16px', fontFamily: 'sans-serif',
  },
  catRow: { display: 'flex', justifyContent: 'center' },
  syllableArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  syllableCard: {
    fontSize: 72, fontWeight: 900, color: '#FF6B9D',
    background: '#fff', borderRadius: 24,
    padding: '16px 40px',
    boxShadow: '0 8px 24px rgba(255,107,157,0.25)',
    border: '4px solid #FFD166',
  },
  remaining: { fontSize: 14, color: '#aaa', fontWeight: 600 },
  baskets: { display: 'flex', gap: 24 },
  basket: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    width: 130, height: 140,
    borderRadius: 24, border: '4px solid',
    cursor: 'pointer', transition: 'background 0.2s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  basketLetter: { fontSize: 36, fontWeight: 900, color: '#333' },
  basketScore: { fontSize: 20, fontWeight: 800, color: '#666' },
  basketIcon: { fontSize: 40 },
};
