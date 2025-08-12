import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light green theme with ancient cultural tones
        primary: {
          50: "#f0f9f0",
          100: "#d9f2d9",
          200: "#b3e6b3",
          300: "#8dd98d",
          400: "#66cc66",
          500: "#4ade80", // Main green
          600: "#3bb365",
          700: "#2d8f47",
          800: "#1e6b2e",
          900: "#0f4715",
        },
        // Ancient Vietnamese cultural colors
        ancient: {
          gold: "#d4af37",
          bronze: "#cd7f32",
          jade: "#00a86b",
          bamboo: "#8fbc8f",
          rice: "#faf0e6",
          earth: "#8b4513",
          ink: "#2c3e50",
        },
        // Background colors
        background: "#fdfffe",
        surface: "#f8fdf8",
        accent: "#e8f5e8",
      },
      fontFamily: {
        sans: [
          "Be Vietnam Pro",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: ["Playfair Display", "Georgia", "Times New Roman", "serif"],
        traditional: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        ancient: "0 4px 20px rgba(77, 222, 128, 0.15)",
        soft: "0 2px 10px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        traditional: "0.375rem",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
