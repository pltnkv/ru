import { motion, AnimatePresence } from 'framer-motion';

export function RewardModal({ visible, reward, onClose }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            style={styles.card}
            initial={{ scale: 0.5, y: 60 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={styles.stars}>⭐⭐⭐</div>
            <div style={styles.catEmoji}>🐱</div>
            <h2 style={styles.title}>Молодец, Майя!</h2>
            <p style={styles.sub}>Ты получила новый подарок для котика:</p>
            <div style={styles.reward}>
              <span style={styles.rewardEmoji}>🎁</span>
              <span style={styles.rewardLabel}>{reward?.label}</span>
            </div>
            <motion.button
              style={styles.btn}
              onClick={onClose}
              whileTap={{ scale: 0.95 }}
            >
              Ура! 🎉
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 200,
  },
  card: {
    background: '#fff',
    borderRadius: 32,
    padding: '40px 48px',
    textAlign: 'center',
    maxWidth: 360,
    width: '90%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  stars: { fontSize: 40, marginBottom: 8 },
  catEmoji: { fontSize: 80, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 800, margin: '0 0 8px', color: '#333' },
  sub: { fontSize: 16, color: '#666', margin: '0 0 20px' },
  reward: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
    background: '#FFF9C4', borderRadius: 16, padding: '12px 24px', marginBottom: 24,
  },
  rewardEmoji: { fontSize: 36 },
  rewardLabel: { fontSize: 20, fontWeight: 700, color: '#333' },
  btn: {
    background: '#FF9EBC',
    border: 'none', borderRadius: 24,
    padding: '16px 48px',
    fontSize: 22, fontWeight: 800, color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(255,158,188,0.5)',
  },
};
