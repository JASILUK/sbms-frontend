// ============================================
// useChallengeSequence.js — NOD FIXED
// ============================================

import { useState, useCallback } from 'react';

export const COMPLIANCE_CHALLENGES = {
  TURN_LEFT: 'TURN_LEFT',
  TURN_RIGHT: 'TURN_RIGHT',
  NOD_UP: 'NOD_UP',
  NOD_DOWN: 'NOD_DOWN',
  OPEN_MOUTH: 'OPEN_MOUTH',
};

export function useChallengeSequence() {
  const [sequence, setSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generateSequence = useCallback(() => {
    const pool = Object.values(COMPLIANCE_CHALLENGES);
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const chosen = shuffled.slice(0, 3);
    setSequence(chosen);
    setCurrentIndex(0);
    return chosen;
  }, []);

  const moveNext = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  const reset = useCallback(() => {
    setSequence([]);
    setCurrentIndex(0);
  }, []);

  const currentChallenge = currentIndex < sequence.length ? sequence[currentIndex] : null;
  const isComplete = currentIndex >= sequence.length;
  const progress = sequence.length > 0 ? (currentIndex / sequence.length) * 100 : 0;

  return {
    sequence,
    currentChallenge,
    currentIndex,
    isComplete,
    progress,
    generateSequence,
    moveNext,
    reset,
  };
}