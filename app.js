const tabs = document.querySelectorAll(".tab");
const screens = document.querySelectorAll(".screen");

const appState = {
  user: {
    name: "Jordan",
    unit: "kg",
    gymDays: ["Mon", "Wed", "Fri"],
    favorites: ["Bench Press", "Squat", "Deadlift", "Lat Pulldown"],
  },
  exercises: [
    { id: "bench_press", name: "Bench Press", aliases: ["bench", "bp"] },
    { id: "squat", name: "Squat", aliases: ["back squat"] },
    { id: "deadlift", name: "Deadlift", aliases: ["dl"] },
    { id: "lat_pulldown", name: "Lat Pulldown", aliases: ["pulldown"] },
  ],
  workoutDays: [
    {
      date: "2025-03-18",
      entries: [
        {
          exerciseId: "bench_press",
          sets: [{ weight: 80, unit: "kg", reps: 8 }],
          notes: "easy",
          rpe: 6,
          source: "text",
        },
        {
          exerciseId: "squat",
          sets: [{ weight: 120, unit: "kg", reps: 5 }],
          notes: "reply from notification",
          rpe: 8,
          source: "notification",
        },
        {
          exerciseId: "lat_pulldown",
          sets: [{ weight: 55, unit: "kg", reps: 12 }],
          notes: "watch quick log",
          rpe: 7,
          source: "watch",
        },
      ],
    },
  ],
  prs: [
    { exerciseId: "bench_press", bestWeight: 95, reps: 5, date: "2025-02-22" },
  ],
};

const parseWorkoutInput = (input, source = "text") => {
  const parsed = {
    date: new Date().toISOString().slice(0, 10),
    entries: [
      {
        exercise_canonical: "Bench Press",
        sets: [{ weight: 80, unit: "kg", reps: 8 }],
        notes: "easy",
        rpe: 6,
        is_pr: false,
        needs_clarification: input.toLowerCase().includes("80"),
        clarifying_question: "Did you mean 80 kg or 80 lb?",
        source,
      },
    ],
  };

  if (input.toLowerCase().includes("squat")) {
    parsed.entries[0] = {
      exercise_canonical: "Squat",
      sets: [
        { weight: 120, unit: "kg", reps: 5 },
        { weight: 120, unit: "kg", reps: 5 },
        { weight: 120, unit: "kg", reps: 5 },
      ],
      notes: "RPE 8",
      rpe: 8,
      is_pr: false,
      needs_clarification: false,
      clarifying_question: null,
      source,
    };
  }

  return parsed;
};

const showScreen = (targetId) => {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === targetId);
  });
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.target === targetId);
  });
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    showScreen(tab.dataset.target);
  });
});

window.PulseLog = {
  appState,
  parseWorkoutInput,
};
