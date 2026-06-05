export const TAG_COLORS = {
  Fours: { text: "#4ade80", bg: "#14532d", border: "#166534" },
  Sixes: { text: "#c084fc", bg: "#3b0764", border: "#581c87" },
  Wicket: { text: "#f87171", bg: "#7f1d1d", border: "#991b1b" },
  Catch: { text: "#60a5fa", bg: "#1e3a5f", border: "#1d4ed8" },
  "Run Out": { text: "#fb923c", bg: "#431407", border: "#c2410c" },
  "No Ball": { text: "#facc15", bg: "#422006", border: "#b45309" },
};

export const TAG_OPTIONS = Object.keys(TAG_COLORS);

const TAG_COMBOS = [
  ["Fours", "Sixes"],
  ["Sixes", "Wicket", "Fours"],
  ["Wicket"],
  ["Fours"],
  ["Sixes", "Wicket", "Fours"],
  ["Wicket"],
  ["Fours"],
  ["Sixes"],
  ["Wicket"],
  ["Fours", "Sixes", "Wicket"],
];

export const INITIAL_CLIPS = [];

export const THUMB_COLORS = [
  "#1a2e1a",
  "#1e1a2e",
  "#2e1a1a",
  "#1a2a2e",
  "#2e2a1a",
  "#2e1e2a",
  "#162616",
  "#16162a",
  "#2a1616",
  "#161e26",
  "#262416",
  "#241626",
  "#1c3020",
  "#20181c",
  "#301c18",
  "#182030",
  "#2a2818",
  "#18282a",
  "#142818",
  "#181428",
];
