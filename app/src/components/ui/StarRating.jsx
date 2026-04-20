import { motion } from 'framer-motion';

export function StarRating({ stars = 0, max = 3, size = 32 }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: max }).map((_, i) => (
        <motion.span
          key={i}
          style={{ fontSize: size, filter: i < stars ? 'none' : 'grayscale(1) opacity(0.3)' }}
          initial={i < stars ? { scale: 0 } : {}}
          animate={i < stars ? { scale: 1 } : {}}
          transition={{ delay: i * 0.15, type: 'spring', stiffness: 300 }}
        >
          ⭐
        </motion.span>
      ))}
    </div>
  );
}
