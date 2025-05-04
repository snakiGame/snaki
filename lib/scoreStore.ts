import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Score {
  score: number;
  date: string;
  id: string;
}

interface ScoreState {
  highScore: number;
  scores: Score[];
  addScore: (score: number) => void;
  clearScores: () => void;
}

export const useScoreStore = create<ScoreState>()(
  persist(
    (set, get) => ({
      highScore: 0,
      scores: [],
      addScore: (score: number) => {
        const newScore: Score = {
          score,
          date: new Date().toISOString(),
          id: Math.random().toString(36).substring(7),
        };

        set((state) => {
          const newScores = [newScore, ...state.scores].slice(0, 50); // Keep last 50 scores
          const newHighScore = Math.max(score, state.highScore);
          
          return {
            scores: newScores,
            highScore: newHighScore,
          };
        });
      },
      clearScores: () => set({ scores: [], highScore: 0 }),
    }),
    {
      name: 'score-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 