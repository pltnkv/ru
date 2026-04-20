import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEVELS } from '../../data/levels';
import { getPictogramUrl } from '../../data/pictograms';

function PicCard({ word }) {
  const url = getPictogramUrl(word);
  const [status, setStatus] = useState('loading'); // loading | ok | error

  return (
    <div style={{ ...styles.card, borderColor: status === 'error' ? '#FF6B6B' : status === 'ok' ? '#06D6A0' : '#ddd' }}>
      <div style={styles.imgBox}>
        {url ? (
          <img
            src={url}
            alt={word}
            style={styles.img}
            loading="lazy"
            onLoad={() => setStatus('ok')}
            onError={() => setStatus('error')}
          />
        ) : (
          <span style={styles.noImg}>—</span>
        )}
      </div>
      <div style={styles.wordLabel}>{word}</div>
      {status === 'error' && <div style={styles.errorBadge}>404</div>}
      {!url && <div style={styles.missingBadge}>нет ID</div>}
    </div>
  );
}

export function PictogramsDebug({ onClose }) {
  // collect unique words across all levels
  const allWords = [];
  const seen = new Set();
  for (const level of LEVELS) {
    for (const w of level.words) {
      if (!seen.has(w.text)) {
        seen.add(w.text);
        allWords.push({ word: w.text, levelId: level.id, levelName: level.name });
      }
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        style={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div style={styles.panel}>
          <div style={styles.topBar}>
            <h2 style={styles.title}>🖼 Все картинки ({allWords.length} слов)</h2>
            <button style={styles.closeBtn} onClick={onClose}>✕</button>
          </div>

          <div style={styles.grid}>
            {LEVELS.map(level => {
              const words = level.words.map(w => w.text);
              return (
                <div key={level.id} style={styles.levelSection}>
                  <div style={{ ...styles.levelHeader, background: level.color }}>
                    {level.emoji} Уровень {level.id} — {level.name}
                  </div>
                  <div style={styles.cardsRow}>
                    {words.map(word => (
                      <PicCard key={word} word={word} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 300,
    display: 'flex', alignItems: 'stretch',
  },
  panel: {
    background: '#f8f8f8',
    width: '100%',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  },
  topBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 20px',
    background: '#333',
    flexShrink: 0,
  },
  title: {
    margin: 0, fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'sans-serif',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none', borderRadius: 8,
    padding: '8px 14px', fontSize: 18, color: '#fff',
    cursor: 'pointer', fontWeight: 700,
  },
  grid: {
    flex: 1, overflowY: 'auto',
    padding: '16px',
    display: 'flex', flexDirection: 'column', gap: 20,
  },
  levelSection: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  levelHeader: {
    padding: '8px 16px',
    fontSize: 14, fontWeight: 700, color: '#fff',
    fontFamily: 'sans-serif',
    borderRadius: '16px 16px 0 0',
  },
  cardsRow: {
    display: 'flex', flexWrap: 'wrap', gap: 10,
    padding: 12,
  },
  card: {
    width: 90,
    border: '2px solid',
    borderRadius: 12,
    background: '#fafafa',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '8px 4px 6px',
    gap: 4,
    position: 'relative',
    transition: 'border-color 0.3s',
  },
  imgBox: {
    width: 70, height: 70,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  img: {
    width: '100%', height: '100%', objectFit: 'contain',
  },
  noImg: {
    fontSize: 28, color: '#ccc',
  },
  wordLabel: {
    fontSize: 13, fontWeight: 800, color: '#333',
    fontFamily: 'sans-serif', textAlign: 'center',
  },
  errorBadge: {
    position: 'absolute', top: 4, right: 4,
    background: '#FF6B6B', color: '#fff',
    fontSize: 9, fontWeight: 700,
    borderRadius: 4, padding: '1px 4px',
  },
  missingBadge: {
    position: 'absolute', top: 4, right: 4,
    background: '#aaa', color: '#fff',
    fontSize: 9, fontWeight: 700,
    borderRadius: 4, padding: '1px 4px',
  },
};
