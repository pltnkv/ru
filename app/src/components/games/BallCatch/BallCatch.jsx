import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cat } from '../../Cat/Cat';
import { useSpeech } from '../../../hooks/useSpeech';

const COLORS = ['#FF9EBC', '#FFD166', '#06D6A0', '#8CB4FF', '#FFB347', '#4ECDC4', '#B5838D'];

// 4×3 grid of non-overlapping positions (% of field)
const GRID_POSITIONS = [
  { x: 18, y: 22 }, { x: 38, y: 22 }, { x: 62, y: 22 }, { x: 82, y: 22 },
  { x: 18, y: 52 }, { x: 38, y: 52 }, { x: 62, y: 52 }, { x: 82, y: 52 },
  { x: 18, y: 80 }, { x: 38, y: 80 }, { x: 62, y: 80 }, { x: 82, y: 80 },
];

function getRandomBalls(syllables, target) {
  const pool = syllables.filter(s => s !== target);
  const distractors = pool.sort(() => Math.random() - 0.5).slice(0, 4);
  const all = [...distractors, target].sort(() => Math.random() - 0.5);
  const positions = [...GRID_POSITIONS].sort(() => Math.random() - 0.5).slice(0, all.length);
  return all.map((syl, i) => ({
    id: i,
    text: syl,
    isTarget: syl === target,
    color: COLORS[i % COLORS.length],
    x: positions[i].x,
    y: positions[i].y,
  }));
}

// Build a queue: each syllable repeated 5 times, each repeat independently shuffled
function buildRoundQueue(syllables) {
  const queue = [];
  for (let rep = 0; rep < 5; rep++) {
    const shuffled = [...syllables].sort(() => Math.random() - 0.5);
    queue.push(...shuffled);
  }
  return queue;
}

export function BallCatch({ exercise, onComplete }) {
  const { speak, sayWithName } = useSpeech();
  const syllables = exercise.syllables;
  const [roundQueue] = useState(() => buildRoundQueue(syllables));
  const [round, setRound] = useState(0);
  const [balls, setBalls] = useState([]);
  const [catState, setCatState] = useState('idle');
  const [speech, setSpeech] = useState('');
  const [errors, setErrors] = useState(0);
  const [popped, setPopped] = useState(null);
  const totalRounds = roundQueue.length;

  const setupRound = useCallback((r) => {
    const target = roundQueue[r];
    setBalls(getRandomBalls(syllables, target));
    setTimeout(() => {
      sayWithName(`{name}, поймай клубочек ${target}!`);
      setSpeech(`Поймай ${target}!`);
    }, 300);
  }, [roundQueue, syllables, sayWithName]);

  useEffect(() => {
    setupRound(round);
  }, [round]);

  const handleTap = (ball) => {
    if (ball.isTarget) {
      speak(ball.text);
      setCatState('happy');
      setSpeech('Ура! Правильно!');
      setPopped(ball.id);
      setTimeout(() => {
        setPopped(null);
        setCatState('idle');
        if (round + 1 >= totalRounds) {
          const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
          onComplete(stars);
        } else {
          setRound(r => r + 1);
        }
      }, 1000);
    } else {
      setErrors(e => e + 1);
      setCatState('thinking');
      setSpeech('Мя-р-р? Попробуй ещё!');
      setTimeout(() => { setCatState('idle'); setSpeech(`Поймай ${roundQueue[round]}!`); }, 1500);
    }
  };

  const progressPct = Math.round((round / totalRounds) * 100);

  return (
    <div style={styles.screen}>
      <div style={styles.catRow}>
        <Cat state={catState} size={80} speech={speech} />
      </div>
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
        <span style={styles.progressLabel}>{round} / {totalRounds}</span>
      </div>

      <div style={styles.field}>
        <AnimatePresence>
          {balls.map(ball => (
            popped !== ball.id && (
              <motion.button
                key={ball.id}
                style={{
                  ...styles.ball,
                  background: ball.color,
                  left: `${ball.x}%`,
                  top: `${ball.y}%`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1, y: [0, -8, 0] }}
                exit={{ scale: 3, opacity: 0 }}
                transition={{ y: { repeat: Infinity, duration: 1.5 + Math.random(), ease: 'easeInOut' } }}
                onClick={() => handleTap(ball)}
                whileTap={{ scale: 0.85 }}
              >
                {ball.text}
              </motion.button>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const styles = {
  screen: {
    display: 'flex', flexDirection: 'column', height: '100%',
    fontFamily: 'sans-serif', overflow: 'hidden',
  },
  catRow: { display: 'flex', justifyContent: 'center', padding: '12px 0', flexShrink: 0 },
  progressBar: {
    position: 'relative',
    height: 18, borderRadius: 9,
    background: '#eee',
    margin: '0 20px 8px',
    flexShrink: 0,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    background: 'linear-gradient(90deg, #FF9EBC, #FFD166)',
    borderRadius: 9,
    transition: 'width 0.4s ease',
  },
  progressLabel: {
    position: 'absolute', right: 8, top: 0, bottom: 0,
    display: 'flex', alignItems: 'center',
    fontSize: 11, fontWeight: 700, color: '#888',
  },
  field: { flex: 1, position: 'relative' },
  ball: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    width: 90, height: 90,
    borderRadius: '50%',
    border: '4px solid rgba(255,255,255,0.5)',
    fontSize: 22, fontWeight: 900, color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
};
