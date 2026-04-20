import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cat } from '../../Cat/Cat';
import { MicButton } from '../../ui/MicButton';
import { useSpeech } from '../../../hooks/useSpeech';
import { useVoiceInput } from '../../../hooks/useVoiceInput';

export function VoiceFeed({ exercise, onComplete }) {
  const { speak, sayWithName } = useSpeech();
  const { listening, start, stop } = useVoiceInput();
  const syllables = exercise.syllables;
  const [index, setIndex] = useState(0);
  const [catState, setCatState] = useState('idle');
  const [speech, setSpeech] = useState('');
  const [fishVisible, setFishVisible] = useState(false);
  const [errors, setErrors] = useState(0);
  const current = syllables[index];

  useEffect(() => {
    setTimeout(() => {
      sayWithName(`{name}, прочитай слог, чтобы накормить котика!`);
      setSpeech(`Прочитай: ${current}`);
    }, 400);
  }, [index]);

  const handleMic = () => {
    if (listening) { stop(); return; }
    start(current, ({ success }) => {
      if (success) {
        setCatState('eating');
        setSpeech('Мурр! Вкуснотища!');
        setFishVisible(true);
        setTimeout(() => {
          setFishVisible(false);
          setCatState('idle');
          if (index + 1 >= syllables.length) {
            const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
            onComplete(stars);
          } else {
            setIndex(i => i + 1);
            setSpeech(`Прочитай: ${syllables[index + 1]}`);
          }
        }, 1500);
      } else {
        setErrors(e => e + 1);
        setCatState('thinking');
        setSpeech('Мя-р-р? Попробуй ещё раз!');
        setTimeout(() => { setCatState('idle'); setSpeech(`Прочитай: ${current}`); }, 1800);
      }
    });
  };

  return (
    <div style={styles.screen}>
      <div style={styles.catArea}>
        <Cat state={catState} size={100} speech={speech} />
        <AnimatePresence>
          {fishVisible && (
            <motion.div
              style={styles.fish}
              initial={{ y: -30, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              🐟
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={styles.bowl}>
        <div style={styles.syllableCloud}>
          <span style={styles.syllableText}>{current}</span>
        </div>
        <div style={styles.bowlEmoji}>🥣</div>
      </div>

      <div style={styles.progress}>
        {syllables.map((_, i) => (
          <div key={i} style={{
            ...styles.dot,
            background: i < index ? '#06D6A0' : i === index ? '#FFD166' : '#ddd',
          }} />
        ))}
      </div>

      <div style={styles.micArea}>
        <MicButton listening={listening} onClick={handleMic} />
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
  catArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  fish: { fontSize: 56, textAlign: 'center' },
  bowl: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  syllableCloud: {
    background: '#fff',
    border: '3px solid #FFD166',
    borderRadius: 20,
    padding: '16px 32px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  syllableText: { fontSize: 64, fontWeight: 900, color: '#FF6B9D' },
  bowlEmoji: { fontSize: 64 },
  progress: { display: 'flex', gap: 8 },
  dot: { width: 14, height: 14, borderRadius: '50%', transition: 'background 0.3s' },
  micArea: { display: 'flex', justifyContent: 'center' },
};
