import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F7F2E7",
        surface: "#FFFFFF",
        ink: "#2B2A25",
        inkSoft: "#6E6A5C",
        green: "#1F4732",
        greenSoft: "#2F5C42",
        gold: "#B8924A",
        sand: "#EFE6D3",
        border: "#E2D7BE",
      },
      fontFamily: {
        amiri: ["var(--font-amiri)"],
        lora: ["var(--font-lora)"],
        inter: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
};
export default config;
