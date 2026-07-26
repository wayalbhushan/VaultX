/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: "#070a12",
        "card-dark": "#0f172a",
        "card-border": "#1e293b",
        "emerald-glow": "#10b981",
        "cyan-glow": "#06b6d4",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "emerald-glow": "0 0 20px -5px rgba(16, 185, 129, 0.4)",
        "cyan-glow": "0 0 20px -5px rgba(6, 182, 212, 0.4)",
      },
    },
  },
  plugins: [],
};
