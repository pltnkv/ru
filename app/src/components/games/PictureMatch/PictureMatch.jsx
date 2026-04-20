import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cat } from '../../Cat/Cat';
import { useSpeech } from '../../../hooks/useSpeech';
import { getPictogramUrl } from '../../../data/pictograms';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildRounds(words, allLevelWords) {
  return words.map(target => {
    const distractors = allLevelWords
      .filter(w => w !== target)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return {
      target,
      choices: shuffle([target, ...distractors]),
    };
  });
}

export function PictureMatch({ exercise, level, onComplete }) {
  const { speak, sayWithName } = useSpeech();
  const allWords = level.words.map(w => w.text);
  const [rounds] = useState(() => buildRounds(exercise.words, allWords));
  const [roundIndex, setRoundIndex] = useState(0);
  const [catState, setCatState] = useState('idle');
  const [speech, setSpeech] = useState('');
  const [errors, setErrors] = useState(0);
  const [selected, setSelected] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const round = rounds[roundIndex];

  useEffect(() => {
    setSelected(null);
    setImgLoaded(false);
    setTimeout(() => {
      sayWithName(`{name}, какое слово подходит к картинке?`);
      setSpeech('Какое слово?');
    }, 300);
  }, [roundIndex]);

  const handleChoice = (word) => {
    if (selected) return;
    setSelected(word);

    if (word === round.target) {
      speak(word.toLowerCase());
      setCatState('happy');
      setSpeech('Правильно! Молодец!');
      setTimeout(() => {
        setCatState('idle');
        if (roundIndex + 1 >= rounds.length) {
          const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
          onComplete(stars);
        } else {
          setRoundIndex(i => i + 1);
        }
      }, 1400);
    } else {
      setErrors(e => e + 1);
      setCatState('thinking');
      setSpeech('Мя-р-р? Попробуй ещё!');
      setTimeout(() => {
        setSelected(null);
        setCatState('idle');
        setSpeech('Какое слово?');
      }, 1200);
    }
  };

  const imageUrl = getPictogramUrl(round.target);

  return (
    <div style={styles.screen}>
      <div style={styles.catRow}>
        <Cat state={catState} size={70} speech={speech} />
      </div>

      <div style={styles.progress}>
        {rounds.map((_, i) => (
          <div key={i} style={{
            ...styles.dot,
            background: i < roundIndex ? '#06D6A0' : i === roundIndex ? '#FFD166' : '#ddd',
          }} />
        ))}
      </div>

      {/* Picture */}
      <AnimatePresence mode="wait">
        <motion.div
          key={round.target}
          style={styles.imageCard}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          {imageUrl ? (
            <>
              {!imgLoaded && <div style={styles.imgPlaceholder}>🖼️</div>}
              <img
                src={imageUrl}
                alt={round.target}
                style={{ ...styles.img, display: imgLoaded ? 'block' : 'none' }}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
              />
            </>
          ) : (
            <div style={styles.imgPlaceholder}>🖼️</div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Word choices */}
      <div style={styles.choices}>
        {round.choices.map((word) => {
          const isCorrect = word === round.target;
          const isSelected = selected === word;
          let borderColor = '#ddd';
          let bg = '#fff';
          if (isSelected) {
            borderColor = isCorrect ? '#06D6A0' : '#FF6B6B';
            bg = isCorrect ? '#E8FFF6' : '#FFF0F0';
          }
          return (
            <motion.button
              key={word}
              style={{ ...styles.choice, borderColor, background: bg }}
              onClick={() => handleChoice(word)}
              whileTap={!selected ? { scale: 0.93 } : {}}
              animate={isSelected && !isCorrect ? { x: [-6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              {word}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  screen: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'space-around', height: '100%',
    padding: '12px 16px', fontFamily: 'sans-serif', gap: 12,
  },
  catRow: { display: 'flex', justifyContent: 'center', flexShrink: 0 },
  progress: { display: 'flex', gap: 8, flexShrink: 0 },
  dot: { width: 14, height: 14, borderRadius: '50%', transition: 'background 0.3s' },
  imageCard: {
    background: '#fff',
    borderRadius: 24,
    padding: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    border: '3px solid #FFD166',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 220, height: 220, flexShrink: 0,
  },
  img: {
    width: '100%', height: '100%',
    objectFit: 'contain',
  },
  imgPlaceholder: {
    fontSize: 80, lineHeight: 1,
  },
  choices: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    width: '100%',
    maxWidth: 440,
    flexShrink: 0,
  },
  choice: {
    padding: '18px 8px',
    borderRadius: 18,
    border: '3px solid',
    fontSize: 22, fontWeight: 900, color: '#333',
    cursor: 'pointer',
    transition: 'all 0.15s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    minHeight: 64,
  },
};
