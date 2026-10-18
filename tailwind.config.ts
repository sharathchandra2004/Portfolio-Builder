import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: { DEFAULT: "#0f0f0f", muted: "#525252", faint: "#a3a3a3" },
        paper: { DEFAULT: "#faf9f6", dim: "#f0ede6" },
        accent: { DEFAULT: "var(--accent)", soft: "color-mix(in srgb, var(--accent) 18%, transparent)" },
      },
      boxShadow: {
        soft: "0 24px 60px -24px rgba(15, 15, 15, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
