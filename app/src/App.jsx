import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HomeScreen } from './screens/HomeScreen';
import { LevelScreen } from './screens/LevelScreen';
import { GameScreen } from './screens/GameScreen';
import { useProgress } from './hooks/useProgress';
import { getLevelById } from './data/levels';

const SCREENS = {
  HOME: 'home',
  LEVEL: 'level',
  GAME: 'game',
};

const isDebug = new URLSearchParams(window.location.search).has('debug');

export default function App() {
  const { progress, setExerciseStars, completeLevel, resetProgress } = useProgress();
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const goHome = () => setScreen(SCREENS.HOME);
  const goLevel = (levelId) => { setSelectedLevel(levelId); setScreen(SCREENS.LEVEL); };
  const goGame = (levelId, exerciseIndex) => {
    setSelectedLevel(levelId);
    setSelectedExercise(exerciseIndex);
    setScreen(SCREENS.GAME);
  };

  const handleExerciseComplete = (levelId, exerciseIndex, stars) => {
    setExerciseStars(levelId, exerciseIndex, stars);
    const level = getLevelById(levelId);
    if (exerciseIndex === level.exercises.length - 1) {
      completeLevel(levelId, level.reward.id);
    }
  };

  return (
    <div style={styles.root}>
      <AnimatePresence mode="wait">
        {screen === SCREENS.HOME && (
          <motion.div key="home" style={styles.fill} {...slide}>
            <HomeScreen
              progress={progress}
              onSelectLevel={goLevel}
              debug={isDebug}
              onResetProgress={resetProgress}
            />
          </motion.div>
        )}
        {screen === SCREENS.LEVEL && (
          <motion.div key="level" style={styles.fill} {...slide}>
            <LevelScreen
              levelId={selectedLevel}
              levelStars={progress.levelStars}
              onStartExercise={(levelId, exIdx) => goGame(levelId, exIdx)}
              onBack={goHome}
            />
          </motion.div>
        )}
        {screen === SCREENS.GAME && (
          <motion.div key="game" style={styles.fill} {...slide}>
            <GameScreen
              levelId={selectedLevel}
              exerciseIndex={selectedExercise}
              onBack={() => setScreen(SCREENS.LEVEL)}
              onComplete={handleExerciseComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const slide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -40 },
  transition: { duration: 0.25 },
};

const styles = {
  root: {
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'manipulation',
  },
  fill: {
    position: 'absolute', inset: 0,
  },
};
