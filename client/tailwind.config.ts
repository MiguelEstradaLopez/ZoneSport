import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'zs-blue': '#007ACC',   // Azul Profundo
        'zs-green': '#8BC34A',  // Verde Lima
      },
    },
  },
  plugins: [],
};
export default config;