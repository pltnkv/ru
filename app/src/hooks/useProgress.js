import { useState, useCallback } from 'react';

const STORAGE_KEY = 'maya_progress';

const defaultProgress = {
  unlockedLevels: [1],
  levelStars: {},       // { levelId: { exerciseIndex: stars } }
  catItems: [],         // unlocked reward ids
  equippedItems: [],    // currently equipped items
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultProgress, ...JSON.parse(raw) } : { ...defaultProgress };
  } catch {
    return { ...defaultProgress };
  }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const setExerciseStars = useCallback((levelId, exerciseIndex, stars) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        levelStars: {
          ...prev.levelStars,
          [levelId]: {
            ...(prev.levelStars[levelId] || {}),
            [exerciseIndex]: Math.max(stars, prev.levelStars[levelId]?.[exerciseIndex] || 0),
          },
        },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const completeLevel = useCallback((levelId, rewardId) => {
    setProgress(prev => {
      const nextLevel = levelId + 1;
      const updated = {
        ...prev,
        unlockedLevels: prev.unlockedLevels.includes(nextLevel)
          ? prev.unlockedLevels
          : [...prev.unlockedLevels, nextLevel],
        catItems: prev.catItems.includes(rewardId)
          ? prev.catItems
          : [...prev.catItems, rewardId],
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const toggleEquip = useCallback((itemId) => {
    setProgress(prev => {
      const equipped = prev.equippedItems.includes(itemId)
        ? prev.equippedItems.filter(i => i !== itemId)
        : [...prev.equippedItems, itemId];
      const updated = { ...prev, equippedItems: equipped };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const isLevelUnlocked = useCallback((levelId) => {
    return progress.unlockedLevels.includes(levelId);
  }, [progress.unlockedLevels]);

  const getLevelTotalStars = useCallback((levelId) => {
    const stars = progress.levelStars[levelId] || {};
    return Object.values(stars).reduce((sum, s) => sum + s, 0);
  }, [progress.levelStars]);

  const resetProgress = useCallback(() => {
    const fresh = { ...defaultProgress };
    saveProgress(fresh);
    setProgress(fresh);
  }, []);

  return {
    progress,
    setExerciseStars,
    completeLevel,
    toggleEquip,
    isLevelUnlocked,
    getLevelTotalStars,
    resetProgress,
  };
}
