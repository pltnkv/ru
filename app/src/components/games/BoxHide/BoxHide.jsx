import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cat } from '../../Cat/Cat';
import { useSpeech } from '../../../hooks/useSpeech';
import { getLevelById } from '../../../data/levels';
import { getPictogramUrl } from '../../../data/pictograms';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function PictogramImage({ word, size = 56 }) {
  const url = getPictogramUrl(word);
  const [loaded, setLoaded] = useState(false);
  if (!url) return <span style={{ fontSize: size * 0.6 }}>📦</span>;
  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {!loaded && <span style={{ fontSize: size * 0.5 }}>⏳</span>}
      <img
        src={url}
        alt={word}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: loaded ? 'block' : 'none' }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
}

export function BoxHide({ exercise, levelId, onComplete }) {
  const { speak, sayWithName } = useSpeech();
  const level = getLevelById(levelId);
  const wordKeys = exercise.words;

  const [round, setRound] = useState(0);
  const [boxes, setBoxes] = useState([]);
  const [target, setTarget] = useState(null);
  const [opened, setOpened] = useState(null);
  const [catState, setCatState] = useState('idle');
  const [speech, setSpeech] = useState('');
  const [errors, setErrors] = useState(0);
  const totalRounds = wordKeys.length;

  const setupRound = (r) => {
    const targetWord = wordKeys[r];
    const others = wordKeys.filter(w => w !== targetWord);
    const pool = shuffle(others).slice(0, 2);
    const roundWords = shuffle([targetWord, ...pool]);
    const wordData = roundWords.map(w => ({ text: w, isTarget: w === targetWord }));
    setBoxes(wordData);
    setTarget(wordData.find(b => b.isTarget));
    setOpened(null);
    setTimeout(() => {
      setSpeech(`Найди: ${targetWord}`);
      sayWithName(`{name}, найди слово ${targetWord.toLowerCase()}!`);
    }, 300);
  };

  useEffect(() => { setupRound(round); }, [round]);

  const handleTap = (box) => {
    if (opened !== null) return;
    setOpened(box.text);
    if (box.isTarget) {
      speak(box.text.toLowerCase());
      setCatState('happy');
      setSpeech('Правильно!');
      setTimeout(() => {
        setCatState('idle');
        if (round + 1 >= totalRounds) {
          const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
          onComplete(stars);
        } else {
          setRound(r => r + 1);
        }
      }, 1500);
    } else {
      setErrors(e => e + 1);
      setCatState('thinking');
      setSpeech('Мя-р-р? Попробуй другую!');
      setTimeout(() => {
        setOpened(null);
        setCatState('idle');
        setSpeech(`Найди: ${target?.text}`);
      }, 1500);
    }
  };

  return (
    <div style={styles.screen}>
      <div style={styles.catRow}>
        <Cat state={catState} size={80} speech={speech} />
      </div>

      <div style={styles.progress}>
        {Array.from({ length: totalRounds }).map((_, i) => (
          <div key={i} style={{
            ...styles.dot,
            background: i < round ? '#06D6A0' : i === round ? '#FFD166' : '#ddd',
          }} />
        ))}
      </div>

      <div style={styles.boxes}>
        {boxes.map((box) => (
          <motion.button
            key={box.text}
            style={{
              ...styles.box,
              borderColor: opened === box.text
                ? box.isTarget ? '#06D6A0' : '#FF6B6B'
                : '#FFD166',
            }}
            onClick={() => handleTap(box)}
            whileTap={{ scale: 0.93 }}
          >
            <AnimatePresence mode="wait">
              {opened === box.text ? (
                <motion.div
                  key="open"
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  style={styles.boxContent}
                >
                  <PictogramImage word={box.text} size={60} />
                  <span style={styles.boxWord}>{box.text}</span>
                </motion.div>
              ) : (
                <motion.div key="closed" exit={{ rotateY: -90 }} style={styles.boxContent}>
                  <span style={styles.boxWord}>{box.text}</span>
                  <span style={styles.boxIcon}>📦</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  screen: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'space-around', height: '100%',
    padding: '20px', fontFamily: 'sans-serif',
  },
  catRow: { display: 'flex', justifyContent: 'center' },
  progress: { display: 'flex', gap: 8 },
  dot: { width: 14, height: 14, borderRadius: '50%', transition: 'background 0.3s' },
  boxes: { display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' },
  box: {
    width: 130, height: 140,
    borderRadius: 20, border: '4px solid',
    background: '#FFFDE7', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'border-color 0.2s',
  },
  boxContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  boxWord: { fontSize: 20, fontWeight: 900, color: '#333' },
  boxIcon: { fontSize: 28 },
};
