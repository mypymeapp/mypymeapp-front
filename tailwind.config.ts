// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  
  darkMode: 'class',

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'animated-gradient': 'animated-gradient 5s ease infinite',
      },
      backgroundSize: {
        '400%': '400%',
      }
    },
  },
  plugins: [],
};
export default config;