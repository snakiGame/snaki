// Block World Design System
// 3 roles: Background (dark), Primary (green/player), Accent (yellow/score)
export const Colors = {
  // Core
  background: "#1a1a2e",   // Deep dark navy — the world
  primary: "#4ade80",       // Bright green — snake / player color
  primaryDark: "#22c55e",   // Darker green — block shadow
  accent: "#facc15",        // Yellow — score, highlights, trophies
  accentDark: "#ca8a04",    // Darker yellow — block shadow for accent

  // Neutrals
  surface: "#16213e",       // Slightly lighter than bg — cards, boards
  surfaceLight: "#0f3460",  // Borders, subtle contrast
  white: "#f0f0f0",         // Off-white text
  textDim: "#8899aa",       // Dimmed text

  // Danger
  danger: "#ef4444",        // Red — poison, game over
  dangerDark: "#b91c1c",    // Darker red shadow

  // Legacy aliases (keep old code from breaking)
  secondary: "#4ade80",
  tertiary: "#facc15",
  accents: "#4ade80",
  text: "#f0f0f0",
};

// Consistent block radius — EVERYTHING uses this
export const BLOCK_RADIUS = 12;
export const BLOCK_SHADOW_OFFSET = 4;
