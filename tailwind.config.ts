import type { Config } from "tailwindcss";
import flowbite from "flowbite/plugin";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        border: 'var(--border)',
        'button-text': 'var(--button-text)',
      },
      keyframes: {
        'rgb-border-glow': {
          '0%, 100%': { 'box-shadow': '0 0 8px 2px var(--primary)' },
          '25%': { 'box-shadow': '0 0 8px 2px #00ff85' },
          '50%': { 'box-shadow': '0 0 8px 2px #03a9f4' },
          '75%': { 'box-shadow': '0 0 8px 2px #ff005a' },
        },
      },
      animation: {
        'rgb-border-glow': 'rgb-border-glow 8s linear infinite',
      },
    },
  },
    plugins: [
    flowbite,
  ],
};
export default config;