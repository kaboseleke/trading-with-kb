import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
        display: ["Rajdhani", "sans-serif"],
      },
      colors: {
        gold: "#f0b429",
        cyan: "#00d4ff",
        green: "#00e676",
        red: "#ff3d57",
      },
    },
  },
  plugins: [],
};

export default config;
