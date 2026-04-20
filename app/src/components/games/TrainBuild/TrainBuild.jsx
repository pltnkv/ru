import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cat } from '../../Cat/Cat';
import { useSpeech } from '../../../hooks/useSpeech';
import { getLevelById } from '../../../data/levels';
import { getPictogramUrl } from '../../../data/pictograms';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function WordPicture({ url, word, completed }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.div
      style={styles.pictureCard}
      animate={completed ? { scale: [1, 1.1, 1], borderColor: '#06D6A0' } : { borderColor: '#FFD166' }}
      transition={{ duration: 0.4 }}
    >
      {url ? (
        <>
          {!loaded && <span style={{ fontSize: 36 }}>⏳</span>}
          <img
            src={url}
            alt={word}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: loaded ? 'block' : 'none' }}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
        </>
      ) : (
        <span style={{ fontSize: 56 }}>🖼️</span>
      )}
    </motion.div>
  );
}

export function TrainBuild({ exercise, levelId, onComplete }) {
  const { speak, sayWithName } = useSpeech();
  const level = getLevelById(levelId);
  const words = exercise.words.map(w => level.words.find(lw => lw.text === w)).filter(Boolean);

  const [wordIndex, setWordIndex] = useState(0);
  const [slots, setSlots] = useState([]);
  const [available, setAvailable] = useState([]);
  const [catState, setCatState] = useState('idle');
  const [speech, setSpeech] = useState('');
  const [errors, setErrors] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentWord = words[wordIndex];

  useEffect(() => {
    if (!currentWord) return;
    setSlots(currentWord.syllables.map(() => null));
    const extras = shuffle(level.syllables).slice(0, 3).filter(s => !currentWord.syllables.includes(s));
    setAvailable(shuffle([...currentWord.syllables, ...extras.slice(0, 2)]));
    setSpeech(`Собери слово!`);
    setTimeout(() => sayWithName(`{name}, собери слово — ${currentWord.text.toLowerCase()}!`), 400);
  }, [wordIndex]);

  const handleDrop = (slotIndex, syllable) => {
    const expected = currentWord.syllables[slotIndex];
    if (syllable === expected) {
      const newSlots = [...slots];
      newSlots[slotIndex] = syllable;
      setAvailable(av => av.filter(s => s !== syllable));
      setSlots(newSlots);

      if (newSlots.every(s => s !== null)) {
        // word complete
        const word = newSlots.join('');
        speak(currentWord.text.toLowerCase());
        setCatState('happy');
        setSpeech('Ура! Слово готово!');
        setCompleted(true);
        setTimeout(() => {
          setCompleted(false);
          setCatState('idle');
          if (wordIndex + 1 >= words.length) {
            const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
            onComplete(stars);
          } else {
            setWordIndex(i => i + 1);
          }
        }, 1800);
      }
    } else {
      setErrors(e => e + 1);
      setCatState('thinking');
      setSpeech('Мя-р-р? Попробуй другой слог!');
      setTimeout(() => { setCatState('idle'); setSpeech('Собери слово!'); }, 1500);
    }
  };

  if (!currentWord) return null;

  const pictogramUrl = getPictogramUrl(currentWord.text);

  return (
    <div style={styles.screen}>
      <div style={styles.topRow}>
        <Cat state={catState} size={70} speech={speech} />
        <WordPicture url={pictogramUrl} word={currentWord.text} completed={completed} />
      </div>

      {/* Train wagons */}
      <div style={styles.trainArea}>
        <span style={styles.locomotive}>🚂</span>
        {slots.map((slot, i) => (
          <motion.div
            key={i}
            style={{
              ...styles.wagon,
              borderColor: slot ? '#06D6A0' : '#FFD166',
              background: slot ? '#E8FFF6' : '#FFFDE7',
            }}
            animate={completed && slot ? { y: [0, -8, 0] } : {}}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            {slot || '?'}
          </motion.div>
        ))}
      </div>

      {/* Available syllables */}
      <div style={styles.syllablesArea}>
        {available.map((syl, i) => {
          const nextEmpty = slots.findIndex(s => s === null);
          return (
            <motion.button
              key={`${syl}-${i}`}
              style={styles.syllableBtn}
              onClick={() => nextEmpty >= 0 && handleDrop(nextEmpty, syl)}
              whileTap={{ scale: 0.88 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              {syl}
            </motion.button>
          );
        })}
      </div>

      <div style={styles.progress}>
        {words.map((_, i) => (
          <div key={i} style={{
            ...styles.dot,
            background: i < wordIndex ? '#06D6A0' : i === wordIndex ? '#FFD166' : '#ddd',
          }} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  screen: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'space-around', height: '100%',
    padding: '16px', fontFamily: 'sans-serif', gap: 12,
  },
  topRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 20, width: '100%', flexShrink: 0,
  },
  pictureCard: {
    width: 120, height: 120,
    background: '#fff',
    borderRadius: 20,
    border: '3px solid #FFD166',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
    padding: 8,
  },
  trainArea: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,255,255,0.6)', borderRadius: 24,
    padding: '12px 20px',
  },
  locomotive: { fontSize: 48 },
  wagon: {
    width: 80, height: 70,
    border: '3px solid',
    borderRadius: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 24, fontWeight: 900, color: '#333',
    transition: 'all 0.2s',
  },
  syllablesArea: {
    display: 'flex', flexWrap: 'wrap', gap: 12,
    justifyContent: 'center', maxWidth: 400,
  },
  syllableBtn: {
    width: 80, height: 70,
    borderRadius: 16,
    background: 'linear-gradient(135deg, #FF9EBC, #FFD166)',
    border: 'none', cursor: 'pointer',
    fontSize: 24, fontWeight: 900, color: '#fff',
    boxShadow: '0 4px 12px rgba(255,100,150,0.3)',
  },
  progress: { display: 'flex', gap: 8 },
  dot: { width: 14, height: 14, borderRadius: '50%', transition: 'background 0.3s' },
};
