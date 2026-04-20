import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IslandMap } from '../components/Map/IslandMap';
import { Cat } from '../components/Cat/Cat';
import { useSpeech } from '../hooks/useSpeech';

export function HomeScreen({ progress, onSelectLevel }) {
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

      <div style={styles.mapArea}>
        <IslandMap
          unlockedLevels={progress.unlockedLevels}
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
  mapArea: {
    flex: 1,
    padding: '0 24px 24px',
    overflow: 'hidden',
  },
};
