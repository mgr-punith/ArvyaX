import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: "#1a2e1a",
        moss: "#2d4a2d",
        sage: "#7a9e7e",
        mist: "#c8dbc9",
        cream: "#f5f0e8",
        sand: "#e8dcc8",
        ocean: "#1a2e3d",
        warm: "#c4956a",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;