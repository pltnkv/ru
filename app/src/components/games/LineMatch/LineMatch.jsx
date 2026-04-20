import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cat } from '../../Cat/Cat';
import { useSpeech } from '../../../hooks/useSpeech';
import { getLevelById } from '../../../data/levels';
import { getPictogramUrl } from '../../../data/pictograms';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function PictogramImage({ word, size = 70 }) {
  const url = getPictogramUrl(word);
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {url ? (
        <>
          {!loaded && <span style={{ fontSize: size * 0.5 }}>⏳</span>}
          <img
            src={url}
            alt={word}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: loaded ? 'block' : 'none' }}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
        </>
      ) : (
        <span style={{ fontSize: size * 0.6 }}>📦</span>
      )}
    </div>
  );
}

export function LineMatch({ exercise, levelId, onComplete }) {
  const { speak, sayWithName } = useSpeech();
  const wordKeys = exercise.words.slice(0, 3);
  const [picOrder] = useState(() => shuffle(wordKeys));

  const [matched, setMatched] = useState({});   // { wordIndex: true }
  const [selected, setSelected] = useState(null);
  const [errors, setErrors] = useState(0);
  const [catState, setCatState] = useState('idle');
  const [speech, setSpeech] = useState('');

  useEffect(() => {
    setTimeout(() => {
      sayWithName(`{name}, соедини слова и картинки!`);
      setSpeech('Соедини слова с картинками!');
    }, 400);
  }, []);

  const handleWordTap = (word) => {
    if (matched[word]) return;
    setSelected(word);
    speak(word.toLowerCase());
  };

  const handlePicTap = (picWord) => {
    if (!selected) return;
    if (picWord === selected) {
      setMatched(m => ({ ...m, [selected]: true }));
      setCatState('happy');
      setSpeech('Правильно!');
      setSelected(null);
      setTimeout(() => {
        setCatState('idle');
        setSpeech('Соедини слова с картинками!');
        const newCount = Object.keys(matched).length + 1;
        if (newCount >= wordKeys.length) {
          const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
          setTimeout(() => onComplete(stars), 500);
        }
      }, 1000);
    } else {
      setErrors(e => e + 1);
      setSelected(null);
      setCatState('thinking');
      setSpeech('Мя-р-р? Попробуй ещё!');
      setTimeout(() => { setCatState('idle'); setSpeech('Соедини слова с картинками!'); }, 1400);
    }
  };

  return (
    <div style={styles.screen}>
      <div style={styles.catRow}>
        <Cat state={catState} size={80} speech={speech} />
      </div>

      <div style={styles.columns}>
        {/* Words column */}
        <div style={styles.col}>
          {wordKeys.map((word) => (
            <motion.button
              key={word}
              style={{
                ...styles.wordBtn,
                background: matched[word] ? '#E8FFF6' : selected === word ? '#FFF9C4' : '#fff',
                borderColor: matched[word] ? '#06D6A0' : selected === word ? '#FFD166' : '#ddd',
                opacity: matched[word] ? 0.6 : 1,
              }}
              onClick={() => handleWordTap(word)}
              whileTap={{ scale: 0.95 }}
            >
              {matched[word] && <span style={styles.checkmark}>✓ </span>}
              {word}
            </motion.button>
          ))}
        </div>

        {/* Pictures column */}
        <div style={styles.col}>
          {picOrder.map((picWord) => (
            <motion.button
              key={picWord}
              style={{
                ...styles.picBtn,
                background: matched[picWord] ? '#E8FFF6' : '#fff',
                borderColor: matched[picWord] ? '#06D6A0' : '#ddd',
                opacity: matched[picWord] ? 0.6 : 1,
              }}
              onClick={() => handlePicTap(picWord)}
              whileTap={{ scale: 0.95 }}
            >
              <PictogramImage word={picWord} size={70} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  screen: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'space-around', height: '100%',
    padding: '16px', fontFamily: 'sans-serif', gap: 16,
  },
  catRow: { display: 'flex', justifyContent: 'center' },
  columns: { display: 'flex', gap: 40, alignItems: 'center' },
  col: { display: 'flex', flexDirection: 'column', gap: 14 },
  wordBtn: {
    padding: '16px 24px',
    borderRadius: 18, border: '3px solid',
    fontSize: 22, fontWeight: 900, color: '#333',
    cursor: 'pointer', minWidth: 130, minHeight: 64,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'all 0.2s', textAlign: 'left',
  },
  checkmark: { color: '#06D6A0' },
  picBtn: {
    width: 100, height: 100,
    borderRadius: 18, border: '3px solid',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'all 0.2s', background: '#fff',
  },
};
