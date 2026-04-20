import { motion } from 'framer-motion';

export function MicButton({ listening, onClick, disabled }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.btn,
        background: listening ? '#FF6B6B' : '#4ECDC4',
      }}
      animate={listening ? { scale: [1, 1.15, 1] } : { scale: 1 }}
      transition={listening ? { duration: 0.8, repeat: Infinity } : {}}
      whileTap={{ scale: 0.9 }}
    >
      <span style={styles.icon}>{listening ? '🎤' : '🎙️'}</span>
      <span style={styles.label}>{listening ? 'Говори!' : 'Нажми и читай'}</span>
    </motion.button>
  );
}

const styles = {
  btn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '20px 40px',
    borderRadius: 32,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    minWidth: 160,
    minHeight: 100,
  },
  icon: { fontSize: 48 },
  label: {
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
    fontFamily: 'sans-serif',
  },
};
