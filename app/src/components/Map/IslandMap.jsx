import { motion } from 'framer-motion';
import { LEVELS } from '../../data/levels';

const MAP_POSITIONS = [
  { x: 12, y: 75 },
  { x: 28, y: 55 },
  { x: 48, y: 38 },
  { x: 68, y: 52 },
  { x: 80, y: 30 },
  { x: 62, y: 12 },
  { x: 42, y: 8 },
];

export function IslandMap({ unlockedLevels, levelStars, onSelectLevel }) {
  return (
    <div style={styles.container}>
      <svg style={styles.pathSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
        {MAP_POSITIONS.slice(0, -1).map((pos, i) => {
          const next = MAP_POSITIONS[i + 1];
          return (
            <line
              key={i}
              x1={pos.x} y1={pos.y}
              x2={next.x} y2={next.y}
              stroke="#D4A017" strokeWidth="1.5"
              strokeDasharray="3 2"
              opacity="0.6"
            />
          );
        })}
      </svg>

      {LEVELS.map((level, index) => {
        const pos = MAP_POSITIONS[index];
        const unlocked = unlockedLevels.includes(level.id);
        const stars = Object.values(levelStars[level.id] || {}).reduce((s, v) => s + v, 0);

        return (
          <motion.button
            key={level.id}
            style={{
              ...styles.levelBtn,
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              background: unlocked ? level.color : '#ccc',
              boxShadow: unlocked ? `0 4px 16px ${level.color}88` : 'none',
            }}
            onClick={() => unlocked && onSelectLevel(level.id)}
            disabled={!unlocked}
            whileHover={unlocked ? { scale: 1.15 } : {}}
            whileTap={unlocked ? { scale: 0.95 } : {}}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.08, type: 'spring', stiffness: 280 }}
          >
            <span style={styles.emoji}>{unlocked ? level.emoji : '🔒'}</span>
            <span style={styles.levelNum}>{level.id}</span>
            {stars > 0 && (
              <span style={styles.stars}>
                {Array.from({ length: Math.min(stars, 3) }).map(() => '⭐').join('')}
              </span>
            )}
            {unlocked && (
              <span style={styles.name}>{level.name}</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: 500,
  },
  pathSvg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  levelBtn: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '12px 16px',
    borderRadius: 20,
    border: '3px solid rgba(255,255,255,0.6)',
    cursor: 'pointer',
    minWidth: 70,
  },
  emoji: { fontSize: 32, lineHeight: 1 },
  levelNum: {
    fontSize: 14, fontWeight: 800, color: '#fff',
    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  stars: { fontSize: 10 },
  name: {
    fontSize: 10, fontWeight: 600, color: '#fff',
    textShadow: '0 1px 2px rgba(0,0,0,0.4)',
    whiteSpace: 'nowrap',
    maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis',
  },
};
