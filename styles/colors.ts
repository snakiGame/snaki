// Block World Design System
// 3 roles: Background (dark), Primary (green/player), Accent (yellow/score)
export const Colors = {
  // Core
  background: "#1c1c24",   // Deep dark navy — the world
  primary: "#889c77",       // Olive sage — snake / player color
  primaryDark: "#6b7f5e",   // Darker olive — block shadow
  accent: "#facc15",        // Yellow — score, highlights, trophies
  accentDark: "#ca8a04",    // Darker yellow — block shadow for accent

  // Neutrals
  surface: "#24242e",       // Slightly lighter than bg — cards, boards
  surfaceLight: "#35354a",  // Borders, subtle contrast
  white: "#f0f0f0",         // Off-white text
  textDim: "#8899aa",       // Dimmed text

  // Danger
  danger: "#ef4444",        // Red — poison, game over
  dangerDark: "#b91c1c",    // Darker red shadow

  // Legacy aliases (keep old code from breaking)
  secondary: "#889c77",
  tertiary: "#facc15",
  accents: "#889c77",
  text: "#f0f0f0",
};

// Consistent block radius — EVERYTHING uses this
export const BLOCK_RADIUS = 12;
export const BLOCK_SHADOW_OFFSET = 4;
