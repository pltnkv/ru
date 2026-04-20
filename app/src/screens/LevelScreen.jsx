import { motion } from 'framer-motion';
import { getLevelById } from '../data/levels';
import { StarRating } from '../components/ui/StarRating';
import { Cat } from '../components/Cat/Cat';

const EXERCISE_NAMES = {
  'letter-intro':  'Знакомство с буквами',
  'ball-catch':    'Поймай клубочек',
  'voice-feed':    'Накорми котика',
  'train-build':   'Кото-поезд',
  'box-hide':      'Коробки и прятки',
  'sorting':       'Сортировка',
  'line-match':    'Соедини линией',
  'picture-match': 'Картинка и слово',
};

const EXERCISE_EMOJI = {
  'letter-intro':  '📖',
  'ball-catch':    '🧶',
  'voice-feed':    '🐟',
  'train-build':   '🚂',
  'box-hide':      '📦',
  'sorting':       '🧺',
  'line-match':    '🖊️',
  'picture-match': '🖼️',
};

export function LevelScreen({ levelId, levelStars, onStartExercise, onBack }) {
  const level = getLevelById(levelId);
  if (!level) return null;

  const stars = levelStars[levelId] || {};

  return (
    <div style={{ ...styles.screen, background: `linear-gradient(160deg, ${level.color}33, #fff)` }}>
      <div style={styles.topBar}>
        <motion.button
          style={styles.backBtn}
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
        >
          ← Карта
        </motion.button>
        <h2 style={styles.levelName}>{level.emoji} {level.name}</h2>
        <Cat state="idle" size={56} />
      </div>

      <div style={styles.newLetters}>
        <span style={styles.newLettersLabel}>Новые буквы: </span>
        {level.newLetters.map(l => (
          <span key={l} style={{ ...styles.letterChip, background: level.color }}>
            {l}
          </span>
        ))}
      </div>

      <div style={styles.list}>
        {level.exercises.map((ex, index) => {
          const done = stars[index] > 0;
          return (
            <motion.button
              key={index}
              style={{
                ...styles.exBtn,
                opacity: done ? 1 : 1,
                border: `3px solid ${done ? level.color : '#eee'}`,
              }}
              onClick={() => onStartExercise(levelId, index)}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              whileTap={{ scale: 0.97 }}
            >
              <span style={styles.exEmoji}>{EXERCISE_EMOJI[ex.type]}</span>
              <span style={styles.exName}>{EXERCISE_NAMES[ex.type] || ex.type}</span>
              <div style={styles.exStars}>
                <StarRating stars={stars[index] || 0} size={20} />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  screen: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    fontFamily: 'sans-serif',
    overflow: 'hidden',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    flexShrink: 0,
  },
  backBtn: {
    background: 'rgba(255,255,255,0.8)',
    border: '2px solid #ddd',
    borderRadius: 16,
    padding: '10px 18px',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    color: '#555',
  },
  levelName: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
    color: '#333',
    textAlign: 'center',
  },
  newLetters: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    padding: '0 20px 12px',
    flexShrink: 0,
  },
  newLettersLabel: { fontSize: 15, color: '#666', fontWeight: 600 },
  letterChip: {
    borderRadius: 12,
    padding: '6px 14px',
    fontSize: 22,
    fontWeight: 800,
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 16px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  exBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '16px 20px',
    borderRadius: 20,
    background: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  exEmoji: { fontSize: 36, flexShrink: 0 },
  exName: { flex: 1, fontSize: 18, fontWeight: 700, color: '#333' },
  exStars: { flexShrink: 0 },
};
