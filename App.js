import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";

const SCREENS = [
  "Onboarding",
  "Home",
  "Quick Log",
  "Voice Log",
  "Session",
  "Progress",
  "Exercise",
  "History",
  "Recap",
  "Settings",
];

const mockState = {
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
  const lower = input.toLowerCase();
  const base = {
    date: new Date().toISOString().slice(0, 10),
    entries: [
      {
        exercise_canonical: "Bench Press",
        sets: [{ weight: 80, unit: "kg", reps: 8 }],
        notes: "easy",
        rpe: 6,
        is_pr: false,
        needs_clarification: lower.includes("80"),
        clarifying_question: "Did you mean 80 kg or 80 lb?",
        source,
      },
    ],
  };

  if (lower.includes("squat")) {
    base.entries[0] = {
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

  return base;
};

const ScreenHeader = ({ title, subtitle }) => (
  <View style={styles.screenHeader}>
    <Text style={styles.screenTitle}>{title}</Text>
    <Text style={styles.screenSubtitle}>{subtitle}</Text>
  </View>
);

const Chip = ({ label, active }) => (
  <View style={[styles.chip, active && styles.chipActive]}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>
      {label}
    </Text>
  </View>
);

const Card = ({ children, variant }) => (
  <View
    style={[
      styles.card,
      variant === "highlight" && styles.cardHighlight,
      variant === "outline" && styles.cardOutline,
      variant === "warning" && styles.cardWarning,
    ]}
  >
    {children}
  </View>
);

const PrimaryButton = ({ label }) => (
  <Pressable style={styles.primaryButton}>
    <Text style={styles.primaryButtonText}>{label}</Text>
  </Pressable>
);

const SecondaryButton = ({ label }) => (
  <Pressable style={styles.secondaryButton}>
    <Text style={styles.secondaryButtonText}>{label}</Text>
  </Pressable>
);

const LabelText = ({ children }) => (
  <Text style={styles.label}>{children}</Text>
);

const SummaryItem = ({ label, value }) => (
  <View style={styles.summaryItem}>
    <LabelText>{label}</LabelText>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const TrendPill = ({ label, variant }) => (
  <View style={[styles.trend, styles[`trend${variant}`]]}>
    <Text style={styles.trendText}>{label}</Text>
  </View>
);

const ListRow = ({ left, right }) => (
  <View style={styles.listRow}>
    <Text style={styles.listText}>{left}</Text>
    <Text style={styles.listText}>{right}</Text>
  </View>
);

const HomeScreen = () => (
  <View>
    <ScreenHeader
      title="Today"
      subtitle="Fastest way to log a workout."
    />
    <Card variant="highlight">
      <Text style={styles.cardTitle}>Quick Log</Text>
      <TextInput
        placeholder="Bench 80x8 easy"
        placeholderTextColor="#7d8698"
        style={styles.textInput}
      />
      <PrimaryButton label="Log now" />
    </Card>
    <View style={styles.twoColumn}>
      <SecondaryButton label="Voice Log" />
      <SecondaryButton label="Start Session" />
    </View>
    <Card>
      <Text style={styles.cardTitle}>Today summary</Text>
      <View style={styles.summaryGrid}>
        <SummaryItem label="Workouts" value="2" />
        <SummaryItem label="Last exercise" value="Bench Press" />
        <SummaryItem label="Streak" value="4 days" />
      </View>
    </Card>
    <Card variant="outline">
      <Text style={styles.cardTitle}>Reply from notification</Text>
      <Text style={styles.cardBody}>
        Reply “Squat 120x5” and we log it instantly without opening the app.
      </Text>
      <View style={styles.chipRow}>
        <Chip label="Bench 80x8" />
        <Chip label="Squat 120x5" />
        <Chip label="Rest day" />
      </View>
    </Card>
    <Card>
      <Text style={styles.cardTitle}>Smartwatch quick log</Text>
      <Text style={styles.cardBody}>
        One tap to log your last exercise. Two taps to repeat the set.
      </Text>
      <SecondaryButton label="Preview watch flow" />
    </Card>
  </View>
);

const OnboardingScreen = () => (
  <View>
    <ScreenHeader
      title="Onboarding"
      subtitle="Set your defaults in under 30 seconds."
    />
    <Card>
      <Text style={styles.cardTitle}>1. Choose unit</Text>
      <View style={styles.toggleRow}>
        <Chip label="kg" active />
        <Chip label="lb" />
      </View>
    </Card>
    <Card>
      <Text style={styles.cardTitle}>2. Default gym days</Text>
      <View style={styles.chipRow}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <Chip
            key={day}
            label={day}
            active={["Mon", "Wed", "Fri"].includes(day)}
          />
        ))}
      </View>
    </Card>
    <Card>
      <Text style={styles.cardTitle}>3. Top 5 exercises (optional)</Text>
      <View style={styles.chipRow}>
        {[
          "Bench Press",
          "Squat",
          "Deadlift",
          "Lat Pulldown",
          "Overhead Press",
        ].map((exercise, index) => (
          <Chip key={exercise} label={exercise} active={index < 3} />
        ))}
      </View>
    </Card>
    <Card variant="highlight">
      <Text style={styles.cardTitle}>4. Enable notifications</Text>
      <Text style={styles.cardBody}>
        Quick reply without opening the app. “Bench 80x8” logs instantly.
      </Text>
      <PrimaryButton label="Enable" />
    </Card>
  </View>
);

const QuickLogScreen = () => (
  <View>
    <ScreenHeader
      title="Quick Log"
      subtitle="Free-form input → structured workout."
    />
    <Card>
      <LabelText>Log</LabelText>
      <TextInput
        placeholder="Squat 3x5 @120kg RPE8"
        placeholderTextColor="#7d8698"
        style={styles.textInput}
        defaultValue="Bench 80x8 easy"
      />
      <PrimaryButton label="Send" />
    </Card>
    <Card>
      <View style={styles.parsedHeader}>
        <View>
          <LabelText>Parsed result</LabelText>
          <Text style={styles.cardTitle}>Bench Press</Text>
        </View>
        <Chip label="AI parsed" active />
      </View>
      <View style={styles.tableHeader}>
        <Text style={styles.tableCell}>Set</Text>
        <Text style={styles.tableCell}>Weight</Text>
        <Text style={styles.tableCell}>Reps</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>1</Text>
        <Text style={styles.tableCell}>80 kg</Text>
        <Text style={styles.tableCell}>8</Text>
      </View>
      <Text style={styles.note}>Note: “easy” · RPE 6</Text>
      <PrimaryButton label="Save" />
    </Card>
    <Card variant="warning">
      <LabelText>Need one clarification</LabelText>
      <Text style={styles.cardBody}>Did you mean 80 kg or 80 lb?</Text>
      <View style={styles.twoColumn}>
        <SecondaryButton label="kg" />
        <SecondaryButton label="lb" />
      </View>
    </Card>
  </View>
);

const VoiceLogScreen = () => (
  <View>
    <ScreenHeader
      title="Voice Log"
      subtitle="Hold to record. We’ll parse the rest."
    />
    <Card>
      <View style={styles.twoColumn}>
        <PrimaryButton label="Hold to record" />
        <SecondaryButton label="Tap to record" />
      </View>
      <View style={styles.transcript}>
        <LabelText>Transcript</LabelText>
        <Text style={styles.cardBody}>“Lat pulldown 55 for 12 x3”</Text>
      </View>
    </Card>
    <Card>
      <View style={styles.parsedHeader}>
        <View>
          <LabelText>Parsed result</LabelText>
          <Text style={styles.cardTitle}>Lat Pulldown</Text>
        </View>
        <Chip label="Voice → AI" active />
      </View>
      <View style={styles.tableHeader}>
        <Text style={styles.tableCell}>Set</Text>
        <Text style={styles.tableCell}>Weight</Text>
        <Text style={styles.tableCell}>Reps</Text>
      </View>
      {[1, 2, 3].map((set) => (
        <View key={set} style={styles.tableRow}>
          <Text style={styles.tableCell}>{set}</Text>
          <Text style={styles.tableCell}>55 kg</Text>
          <Text style={styles.tableCell}>12</Text>
        </View>
      ))}
      <PrimaryButton label="Save" />
    </Card>
  </View>
);

const SessionScreen = () => (
  <View>
    <ScreenHeader
      title="Start Session"
      subtitle="One-thumb flow to log sets fast."
    />
    <Card variant="highlight">
      <Text style={styles.cardTitle}>Log next set</Text>
      <View style={styles.sessionRow}>
        <View>
          <LabelText>Up next</LabelText>
          <Text style={styles.value}>Bench Press</Text>
        </View>
        <PrimaryButton label="80 kg × 8" />
      </View>
      <View style={styles.sessionRow}>
        <View>
          <LabelText>Suggestions</LabelText>
          <Text style={styles.note}>Based on last session</Text>
        </View>
        <View style={styles.chipRow}>
          <Chip label="Squat 120×5" />
          <Chip label="Lat Pulldown 55×12" />
          <Chip label="Deadlift 140×3" />
        </View>
      </View>
    </Card>
    <Card>
      <Text style={styles.cardTitle}>Session summary</Text>
      <ListRow left="Bench Press" right="3 sets" />
      <ListRow left="Squat" right="2 sets" />
      <ListRow left="Lat Pulldown" right="3 sets" />
      <SecondaryButton label="End session" />
    </Card>
  </View>
);

const ProgressScreen = () => (
  <View>
    <ScreenHeader
      title="Progress"
      subtitle="Search your exercise library."
    />
    <Card>
      <TextInput
        placeholder="Search exercises"
        placeholderTextColor="#7d8698"
        style={styles.textInput}
      />
      {[
        { name: "Bench Press", pr: "95 kg · 5 reps", trend: "Up" },
        { name: "Squat", pr: "140 kg · 3 reps", trend: "Same" },
        { name: "Lat Pulldown", pr: "70 kg · 10 reps", trend: "Down" },
      ].map((exercise) => (
        <View key={exercise.name} style={styles.exerciseRow}>
          <View>
            <Text style={styles.cardTitle}>{exercise.name}</Text>
            <Text style={styles.cardBody}>PR {exercise.pr}</Text>
          </View>
          <TrendPill
            label={
              exercise.trend === "Up"
                ? "Better"
                : exercise.trend === "Same"
                  ? "Same"
                  : "Worse"
            }
            variant={exercise.trend}
          />
        </View>
      ))}
    </Card>
  </View>
);

const ExerciseScreen = () => (
  <View>
    <ScreenHeader title="Bench Press" subtitle="Trend and history." />
    <Card variant="highlight">
      <View style={styles.summaryGrid}>
        <SummaryItem label="PR" value="95 kg × 5" />
        <SummaryItem label="Trend (4 wks)" value="▲ +4%" />
        <SummaryItem label="Vs last month" value="You’re up" />
      </View>
    </Card>
    <Card>
      <Text style={styles.cardTitle}>Recent sets</Text>
      <ListRow left="Today" right="80 kg × 8" />
      <ListRow left="Mon" right="82.5 kg × 6" />
      <ListRow left="Sat" right="75 kg × 10" />
    </Card>
    <Card>
      <Text style={styles.cardTitle}>4-week trend</Text>
      <View style={styles.trendLine}>
        {[1, 0.7, 0.4, 0.8, 0.55].map((height, index) => (
          <View
            key={`${height}-${index}`}
            style={[styles.trendBar, { flex: height }]}
          />
        ))}
      </View>
    </Card>
  </View>
);

const HistoryScreen = () => (
  <View>
    <ScreenHeader title="History" subtitle="Workout calendar + heatmap." />
    <Card>
      <View style={styles.heatmap}>
        {[
          ["low", "none", "high", "none", "none", "low", "none"],
          ["none", "high", "high", "none", "low", "none", "none"],
          ["low", "none", "none", "high", "none", "low", "none"],
        ].map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.heatRow}>
            {row.map((level, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.heatCell,
                  level === "low" && styles.heatLow,
                  level === "high" && styles.heatHigh,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      <Card variant="outline">
        <Text style={styles.cardTitle}>March 18</Text>
        <Text style={styles.cardBody}>
          Bench 80×8 · Squat 120×5 · Pull-ups 10×3
        </Text>
      </Card>
    </Card>
  </View>
);

const RecapScreen = () => (
  <View>
    <ScreenHeader title="Year Recap" subtitle="PulseLog highlights." />
    <Card variant="highlight">
      <Text style={styles.cardTitle}>Consistency Machine</Text>
      <View style={styles.summaryGrid}>
        <SummaryItem label="Total visits" value="142" />
        <SummaryItem label="Longest streak" value="18 days" />
        <SummaryItem label="Most trained" value="Bench Press" />
        <SummaryItem label="Biggest PR" value="Deadlift 180 kg" />
      </View>
      <PrimaryButton label="Share recap" />
    </Card>
    <View style={styles.recapGrid}>
      <Card>
        <Text style={styles.cardTitle}>Bench Day CEO</Text>
        <Text style={styles.cardBody}>42 bench sessions this year.</Text>
      </Card>
      <Card>
        <Text style={styles.cardTitle}>Morning Grinder</Text>
        <Text style={styles.cardBody}>62% of workouts before 9am.</Text>
      </Card>
    </View>
  </View>
);

const SettingsScreen = () => (
  <View>
    <ScreenHeader title="Settings" subtitle="Units, reminders, export, privacy." />
    <Card>
      <Text style={styles.cardTitle}>Units</Text>
      <View style={styles.toggleRow}>
        <Chip label="kg" active />
        <Chip label="lb" />
      </View>
    </Card>
    <Card>
      <Text style={styles.cardTitle}>Reminders</Text>
      <Text style={styles.cardBody}>Mon · Wed · Fri at 6:00 PM</Text>
      <SecondaryButton label="Edit" />
    </Card>
    <Card>
      <Text style={styles.cardTitle}>Export data</Text>
      <Text style={styles.cardBody}>Download CSV or JSON.</Text>
      <SecondaryButton label="Export" />
    </Card>
    <Card variant="outline">
      <Text style={styles.cardTitle}>Privacy</Text>
      <Text style={styles.cardBody}>Local-first logging. No social feed.</Text>
    </Card>
  </View>
);

const App = () => {
  const [activeScreen, setActiveScreen] = useState("Onboarding");
  const parsedExample = useMemo(
    () => parseWorkoutInput("Bench 80x8 easy", "text"),
    []
  );

  const screenMap = {
    Onboarding: <OnboardingScreen />,
    Home: <HomeScreen />,
    "Quick Log": <QuickLogScreen />,
    "Voice Log": <VoiceLogScreen />,
    Session: <SessionScreen />,
    Progress: <ProgressScreen />,
    Exercise: <ExerciseScreen />,
    History: <HistoryScreen />,
    Recap: <RecapScreen />,
    Settings: <SettingsScreen />,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.appName}>PulseLog</Text>
          <Text style={styles.heroTitle}>Log workouts in seconds.</Text>
          <Text style={styles.heroSubtitle}>
            One-tap logging, AI parsing, and quick replies from notifications.
          </Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Dark mode · Default</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabRow}>
            {SCREENS.map((screen) => (
              <Pressable
                key={screen}
                onPress={() => setActiveScreen(screen)}
                style={[
                  styles.tab,
                  activeScreen === screen && styles.tabActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeScreen === screen && styles.tabTextActive,
                  ]}
                >
                  {screen}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
        {screenMap[activeScreen]}
        <View style={styles.footer}>
          <LabelText>AI Parsing Contract (stub)</LabelText>
          <Text style={styles.cardBody}>{JSON.stringify(parsedExample)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0d10",
  },
  content: {
    paddingBottom: 48,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 32,
    paddingBottom: 24,
  },
  appName: {
    textTransform: "uppercase",
    letterSpacing: 4,
    color: "#9aa3b2",
    fontSize: 12,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    color: "#f6f7fb",
    fontWeight: "700",
  },
  heroSubtitle: {
    color: "#a8b0bf",
    marginTop: 8,
    fontSize: 14,
  },
  pill: {
    marginTop: 16,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(91, 140, 255, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(91, 140, 255, 0.4)",
  },
  pillText: {
    color: "#f6f7fb",
    fontSize: 12,
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 12,
  },
  tab: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2b3245",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tabActive: {
    borderColor: "#5b8cff",
    backgroundColor: "rgba(91, 140, 255, 0.12)",
  },
  tabText: {
    color: "#9aa3b2",
    fontSize: 12,
  },
  tabTextActive: {
    color: "#f6f7fb",
  },
  screenHeader: {
    marginTop: 16,
    marginBottom: 12,
  },
  screenTitle: {
    fontSize: 22,
    color: "#f6f7fb",
    fontWeight: "600",
  },
  screenSubtitle: {
    color: "#a8b0bf",
    marginTop: 6,
  },
  card: {
    backgroundColor: "#151821",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2b3245",
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  cardHighlight: {
    backgroundColor: "#1b2030",
    borderColor: "rgba(91, 140, 255, 0.4)",
  },
  cardOutline: {
    backgroundColor: "transparent",
  },
  cardWarning: {
    backgroundColor: "rgba(243, 168, 75, 0.12)",
    borderColor: "rgba(243, 168, 75, 0.6)",
  },
  cardTitle: {
    fontSize: 16,
    color: "#f6f7fb",
    fontWeight: "600",
  },
  cardBody: {
    color: "#a8b0bf",
  },
  textInput: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2b3245",
    padding: 12,
    color: "#f6f7fb",
    backgroundColor: "rgba(8, 9, 12, 0.75)",
  },
  primaryButton: {
    backgroundColor: "#2f63ff",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2b3245",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  secondaryButtonText: {
    color: "#f6f7fb",
    fontWeight: "600",
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2b3245",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  chipActive: {
    borderColor: "#5b8cff",
    backgroundColor: "rgba(91, 140, 255, 0.2)",
  },
  chipText: {
    color: "#9aa3b2",
    fontSize: 12,
  },
  chipTextActive: {
    color: "#f6f7fb",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
  },
  label: {
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 10,
    color: "#9aa3b2",
  },
  value: {
    fontSize: 16,
    color: "#f6f7fb",
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryItem: {
    minWidth: 120,
  },
  twoColumn: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  parsedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#2b3245",
    paddingBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#2b3245",
  },
  tableCell: {
    color: "#f6f7fb",
    width: "33%",
  },
  note: {
    color: "#9aa3b2",
  },
  transcript: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 12,
    padding: 12,
  },
  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  trend: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  trendText: {
    color: "#f6f7fb",
    fontSize: 12,
  },
  trendUp: {
    backgroundColor: "rgba(43, 213, 118, 0.2)",
  },
  trendSame: {
    backgroundColor: "rgba(168, 176, 191, 0.2)",
  },
  trendDown: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  listText: {
    color: "#f6f7fb",
  },
  sessionRow: {
    gap: 10,
  },
  trendLine: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    alignItems: "flex-end",
    height: 80,
  },
  trendBar: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: "#5b8cff",
    opacity: 0.5,
  },
  heatmap: {
    gap: 6,
  },
  heatRow: {
    flexDirection: "row",
    gap: 6,
  },
  heatCell: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  heatLow: {
    backgroundColor: "rgba(91, 140, 255, 0.3)",
  },
  heatHigh: {
    backgroundColor: "rgba(91, 140, 255, 0.7)",
  },
  recapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  footer: {
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#11131a",
    borderWidth: 1,
    borderColor: "#2b3245",
  },
});

export default App;
