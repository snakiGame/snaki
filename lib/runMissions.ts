export type RunMissionType = "golden" | "combo" | "survive";

export interface RunMissionProgress {
  id: string;
  type: RunMissionType;
  title: string;
  target: number;
  current: number;
  completed: boolean;
  suffix?: string;
}

const RUN_MISSION_POOL: Omit<RunMissionProgress, "current" | "completed">[] = [
  {
    id: "golden-2",
    type: "golden",
    title: "Eat 2 golden food",
    target: 2,
  },
  {
    id: "golden-4",
    type: "golden",
    title: "Eat 4 golden food",
    target: 4,
  },
  {
    id: "combo-4",
    type: "combo",
    title: "Reach 4x combo",
    target: 4,
    suffix: "x",
  },
  {
    id: "combo-6",
    type: "combo",
    title: "Reach 6x combo",
    target: 6,
    suffix: "x",
  },
  {
    id: "survive-45",
    type: "survive",
    title: "Survive 45 seconds",
    target: 45,
    suffix: "s",
  },
  {
    id: "survive-60",
    type: "survive",
    title: "Survive 60 seconds",
    target: 60,
    suffix: "s",
  },
];

export const createRunMissions = (count: number = 3): RunMissionProgress[] => {
  const grouped: Record<
    RunMissionType,
    Omit<RunMissionProgress, "current" | "completed">[]
  > = {
    golden: RUN_MISSION_POOL.filter((m) => m.type === "golden"),
    combo: RUN_MISSION_POOL.filter((m) => m.type === "combo"),
    survive: RUN_MISSION_POOL.filter((m) => m.type === "survive"),
  };

  const selectedBase = (["golden", "combo", "survive"] as RunMissionType[]).map(
    (type) => {
      const options = grouped[type];
      return options[Math.floor(Math.random() * options.length)];
    },
  );

  return selectedBase.slice(0, count).map((mission) => ({
    ...mission,
    current: 0,
    completed: false,
  }));
};

export const applyMissionProgress = (
  missions: RunMissionProgress[],
  type: RunMissionType,
  value: number,
  mode: "setMax" | "increment" = "setMax",
): RunMissionProgress[] => {
  return missions.map((mission) => {
    if (mission.type !== type || mission.completed) return mission;

    const nextCurrent =
      mode === "increment"
        ? mission.current + value
        : Math.max(mission.current, value);

    const clamped = Math.min(nextCurrent, mission.target);
    return {
      ...mission,
      current: clamped,
      completed: clamped >= mission.target,
    };
  });
};
