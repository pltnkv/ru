import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function HintFinger({ targetRef, idleTimeout = 6000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer = setTimeout(() => setVisible(true), idleTimeout);

    const reset = () => {
      setVisible(false);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(true), idleTimeout);
    };

    window.addEventListener('pointerdown', reset);
    window.addEventListener('touchstart', reset);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', reset);
      window.removeEventListener('touchstart', reset);
    };
  }, [idleTimeout]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={styles.finger}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: [1, 1.2, 1], y: [0, -12, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          👆
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const styles = {
  finger: {
    position: 'fixed',
    bottom: 80,
    right: 40,
    fontSize: 64,
    zIndex: 100,
    pointerEvents: 'none',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
  },
};
