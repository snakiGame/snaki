import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ── Challenge definitions ──────────────────────────────────────
export interface ChallengeDefinition {
  id: string;
  title: string;
  description: string;
  target: number;
  type: "score" | "combo" | "golden" | "rainbow" | "no_poison" | "food_count";
  xpReward: number;
}

// Pool of challenges to rotate from
const CHALLENGE_POOL: ChallengeDefinition[] = [
  { id: "score_30", title: "Warm Up", description: "Score 30 points", target: 30, type: "score", xpReward: 20 },
  { id: "score_50", title: "Getting Serious", description: "Score 50 points", target: 50, type: "score", xpReward: 35 },
  { id: "score_100", title: "Century", description: "Score 100 points", target: 100, type: "score", xpReward: 60 },
  { id: "combo_3", title: "Combo Starter", description: "Get a 3x combo", target: 3, type: "combo", xpReward: 15 },
  { id: "combo_5", title: "Combo Master", description: "Get a 5x combo", target: 5, type: "combo", xpReward: 30 },
  { id: "golden_3", title: "Gold Rush", description: "Eat 3 golden foods", target: 3, type: "golden", xpReward: 25 },
  { id: "golden_5", title: "Midas Touch", description: "Eat 5 golden foods", target: 5, type: "golden", xpReward: 40 },
  { id: "rainbow_2", title: "Rainbow Chaser", description: "Eat 2 rainbow foods", target: 2, type: "rainbow", xpReward: 30 },
  { id: "no_poison", title: "Clean Run", description: "Score 40 without eating poison", target: 40, type: "no_poison", xpReward: 35 },
  { id: "food_15", title: "Hungry Snake", description: "Eat 15 foods in one game", target: 15, type: "food_count", xpReward: 20 },
  { id: "food_25", title: "Feast Mode", description: "Eat 25 foods in one game", target: 25, type: "food_count", xpReward: 40 },
  { id: "score_75", title: "Almost There", description: "Score 75 points", target: 75, type: "score", xpReward: 45 },
];

const DAILY_CHALLENGE_COUNT = 3;

export interface DailyChallengeProgress {
  challengeId: string;
  current: number;
  completed: boolean;
  claimed: boolean;
}

interface DailyChallengeState {
  challenges: DailyChallengeProgress[];
  definitions: ChallengeDefinition[];
  lastRefreshDate: string; // ISO date string (YYYY-MM-DD)
  streak: number;
  xp: number;
  level: number;

  refreshIfNeeded: () => void;
  updateProgress: (type: ChallengeDefinition["type"], value: number) => void;
  claimReward: (challengeId: string) => void;
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function pickDailyChallenges(): { defs: ChallengeDefinition[]; progress: DailyChallengeProgress[] } {
  // Seed from date so same challenges for a given day
  const today = getTodayString();
  let seed = 0;
  for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i) * (i + 1);

  const shuffled = [...CHALLENGE_POOL].sort((a, b) => {
    const ha = (seed * 31 + a.id.charCodeAt(0)) % 1000;
    const hb = (seed * 31 + b.id.charCodeAt(0)) % 1000;
    return ha - hb;
  });

  const picked = shuffled.slice(0, DAILY_CHALLENGE_COUNT);
  return {
    defs: picked,
    progress: picked.map((c) => ({
      challengeId: c.id,
      current: 0,
      completed: false,
      claimed: false,
    })),
  };
}

// XP needed per level (level N needs N * 50 XP)
export function xpForLevel(level: number): number {
  return level * 50;
}

export const useDailyChallengeStore = create<DailyChallengeState>()(
  persist(
    (set, get) => ({
      challenges: [],
      definitions: [],
      lastRefreshDate: "",
      streak: 0,
      xp: 0,
      level: 1,

      refreshIfNeeded: () => {
        const today = getTodayString();
        const state = get();
        if (state.lastRefreshDate === today && state.challenges.length > 0) return;

        // Check streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        const streakContinues = state.lastRefreshDate === yesterdayStr;
        const allCompleted = state.challenges.length > 0 && state.challenges.every((c) => c.completed);

        const { defs, progress } = pickDailyChallenges();
        set({
          challenges: progress,
          definitions: defs,
          lastRefreshDate: today,
          streak: streakContinues && allCompleted ? state.streak + 1 : streakContinues ? state.streak : allCompleted ? 1 : 0,
        });
      },

      updateProgress: (type, value) => {
        set((state) => {
          let newXp = state.xp;
          let newLevel = state.level;

          const updated = state.challenges.map((c) => {
            const def = state.definitions.find((d) => d.id === c.challengeId);
            if (!def || c.completed || def.type !== type) return c;

            const newCurrent = type === "score" || type === "no_poison"
              ? Math.max(c.current, value) // score/no_poison: track max
              : c.current + value; // others: accumulate
            const nowCompleted = newCurrent >= def.target;

            return { ...c, current: Math.min(newCurrent, def.target), completed: nowCompleted };
          });

          return { challenges: updated, xp: newXp, level: newLevel };
        });
      },

      claimReward: (challengeId) => {
        set((state) => {
          const challenge = state.challenges.find((c) => c.challengeId === challengeId);
          const def = state.definitions.find((d) => d.id === challengeId);
          if (!challenge || !def || !challenge.completed || challenge.claimed) return state;

          const newXp = state.xp + def.xpReward;
          let newLevel = state.level;
          while (newXp >= xpForLevel(newLevel)) {
            newLevel++;
          }

          return {
            challenges: state.challenges.map((c) =>
              c.challengeId === challengeId ? { ...c, claimed: true } : c
            ),
            xp: newXp,
            level: newLevel,
          };
        });
      },
    }),
    {
      name: "daily-challenge-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
