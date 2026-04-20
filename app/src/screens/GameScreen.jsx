import { useState } from 'react';
import { motion } from 'framer-motion';
import { getLevelById } from '../data/levels';
import { HintFinger } from '../components/ui/HintFinger';
import { RewardModal } from '../components/ui/RewardModal';
import { StarRating } from '../components/ui/StarRating';

import { LetterIntro } from '../components/games/LetterIntro/LetterIntro';
import { BallCatch } from '../components/games/BallCatch/BallCatch';
import { VoiceFeed } from '../components/games/VoiceFeed/VoiceFeed';
import { TrainBuild } from '../components/games/TrainBuild/TrainBuild';
import { BoxHide } from '../components/games/BoxHide/BoxHide';
import { Sorting } from '../components/games/Sorting/Sorting';
import { LineMatch } from '../components/games/LineMatch/LineMatch';
import { PictureMatch } from '../components/games/PictureMatch/PictureMatch';

const GAME_COMPONENTS = {
  'letter-intro':  LetterIntro,
  'ball-catch':    BallCatch,
  'voice-feed':    VoiceFeed,
  'train-build':   TrainBuild,
  'box-hide':      BoxHide,
  'sorting':       Sorting,
  'line-match':    LineMatch,
  'picture-match': PictureMatch,
};

const BG_COLORS = {
  valley:   'linear-gradient(160deg, #FFE4EF, #FFF9C4)',
  beach:    'linear-gradient(160deg, #FFF9C4, #E0F7FA)',
  mountain: 'linear-gradient(160deg, #E8F4FF, #F3E5F5)',
  pond:     'linear-gradient(160deg, #E0F7FA, #E8F5E9)',
  jungle:   'linear-gradient(160deg, #E8F5E9, #FFFDE7)',
  meadow:   'linear-gradient(160deg, #F3E5F5, #FCE4EC)',
  summit:   'linear-gradient(160deg, #FFF8E1, #E8EAF6)',
};

export function GameScreen({ levelId, exerciseIndex, onBack, onComplete }) {
  const level = getLevelById(levelId);
  const exercise = level?.exercises[exerciseIndex];
  const [done, setDone] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const isLastExercise = exerciseIndex === level.exercises.length - 1;

  const handleComplete = (stars) => {
    setEarnedStars(stars);
    setDone(true);
    onComplete(levelId, exerciseIndex, stars);
    if (isLastExercise) {
      setTimeout(() => setShowReward(true), 600);
    }
  };

  const GameComponent = exercise ? GAME_COMPONENTS[exercise.type] : null;

  return (
    <div style={{ ...styles.screen, background: BG_COLORS[level?.background] || '#fff' }}>
      <div style={styles.topBar}>
        <motion.button
          style={styles.backBtn}
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
        <div style={styles.levelInfo}>
          <span style={styles.levelName}>{level?.emoji} {level?.name}</span>
        </div>
        <div style={styles.exNum}>
          {exerciseIndex + 1}/{level?.exercises.length}
        </div>
      </div>

      <div style={styles.gameArea}>
        {GameComponent && !done && (
          <GameComponent
            exercise={exercise}
            level={level}
            levelId={levelId}
            onComplete={handleComplete}
          />
        )}
        {done && !showReward && (
          <motion.div
            style={styles.doneScreen}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div style={styles.doneEmoji}>🎉</div>
            <h2 style={styles.doneTitle}>Отлично, Майя!</h2>
            <StarRating stars={earnedStars} size={48} />
            <motion.button
              style={styles.nextBtn}
              onClick={onBack}
              whileTap={{ scale: 0.95 }}
            >
              {isLastExercise ? 'На карту' : 'Следующее задание'}
            </motion.button>
          </motion.div>
        )}
      </div>

      <HintFinger idleTimeout={7000} />

      <RewardModal
        visible={showReward}
        reward={level?.reward}
        onClose={() => { setShowReward(false); onBack(); }}
      />
    </div>
  );
}

const styles = {
  screen: {
    display: 'flex', flexDirection: 'column',
    height: '100dvh', overflow: 'hidden', fontFamily: 'sans-serif',
  },
  topBar: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px', flexShrink: 0,
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.9)',
    border: '2px solid #ddd', borderRadius: 12,
    padding: '10px 16px', fontSize: 20,
    fontWeight: 700, cursor: 'pointer', color: '#555',
    minWidth: 48, minHeight: 48,
  },
  levelInfo: { flex: 1, textAlign: 'center' },
  levelName: { fontSize: 16, fontWeight: 700, color: '#444' },
  exNum: { fontSize: 15, fontWeight: 700, color: '#999', minWidth: 36, textAlign: 'right' },
  gameArea: { flex: 1, overflow: 'hidden' },
  doneScreen: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100%', gap: 24,
  },
  doneEmoji: { fontSize: 96 },
  doneTitle: { fontSize: 32, fontWeight: 800, color: '#333', margin: 0 },
  nextBtn: {
    background: 'linear-gradient(135deg, #FF9EBC, #FFD166)',
    border: 'none', borderRadius: 24,
    padding: '18px 48px', fontSize: 22, fontWeight: 800, color: '#fff',
    cursor: 'pointer', boxShadow: '0 6px 20px rgba(255,150,100,0.4)',
  },
};
