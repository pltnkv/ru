import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IslandMap } from '../components/Map/IslandMap';
import { Cat } from '../components/Cat/Cat';
import { useSpeech } from '../hooks/useSpeech';
import { LEVELS } from '../data/levels';
import { PictogramsDebug } from '../components/ui/PictogramsDebug';

const ALL_LEVEL_IDS = LEVELS.map(l => l.id);

export function HomeScreen({ progress, onSelectLevel, debug, onResetProgress }) {
  const { sayWithName } = useSpeech();
  const [catState, setCatState] = useState('happy');

  useEffect(() => {
    const timer = setTimeout(() => {
      sayWithName('Привет, {name}! Выбери остров на карте!');
      setCatState('happy');
      setTimeout(() => setCatState('idle'), 2000);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const [showPicDebug, setShowPicDebug] = useState(false);
  const unlockedLevels = debug ? ALL_LEVEL_IDS : progress.unlockedLevels;

  return (
    <div style={styles.screen}>
      <div style={styles.header}>
        <motion.h1
          style={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🐱 Читай с Котиком
        </motion.h1>
        <div style={styles.catArea}>
          <Cat state={catState} size={80} speech="Майя, выбери остров!" />
        </div>
      </div>

      {debug && (
        <div style={styles.debugBar}>
          <span style={styles.debugBadge}>🛠 DEBUG</span>
          <motion.button
            style={styles.resetBtn}
            onClick={onResetProgress}
            whileTap={{ scale: 0.93 }}
          >
            🗑 Стереть прогресс
          </motion.button>
          <motion.button
            style={styles.picDebugBtn}
            onClick={() => setShowPicDebug(true)}
            whileTap={{ scale: 0.93 }}
          >
            🖼 Картинки
          </motion.button>
        </div>
      )}
      {showPicDebug && <PictogramsDebug onClose={() => setShowPicDebug(false)} />}

      <div style={styles.mapArea}>
        <IslandMap
          unlockedLevels={unlockedLevels}
          levelStars={progress.levelStars}
          onSelectLevel={onSelectLevel}
        />
      </div>
    </div>
  );
}

const styles = {
  screen: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    background: 'linear-gradient(160deg, #E8F4FF 0%, #FFF0F5 50%, #FFFDE7 100%)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: '#FF6B9D',
    fontFamily: 'sans-serif',
  },
  catArea: { flexShrink: 0 },
  debugBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '6px 24px',
    background: 'rgba(0,0,0,0.06)',
    flexShrink: 0,
  },
  debugBadge: {
    fontSize: 13,
    fontWeight: 700,
    color: '#888',
    fontFamily: 'monospace',
  },
  resetBtn: {
    background: '#FF6B6B',
    border: 'none',
    borderRadius: 12,
    padding: '8px 18px',
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
    cursor: 'pointer',
  },
  picDebugBtn: {
    background: '#6B8EFF',
    border: 'none',
    borderRadius: 12,
    padding: '8px 18px',
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
    cursor: 'pointer',
  },
  mapArea: {
    flex: 1,
    padding: '0 24px 24px',
    overflow: 'hidden',
  },
};
