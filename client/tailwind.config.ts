import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales ZoneSport
        'zs': {
          'dark': '#0f172a',      // Azul oscuro - fondo principal
          'darker': '#0a0f1a',    // Azul aún más oscuro - fondos secundarios
          'blue': '#0d47a1',      // Azul profundo - títulos
          'blue-light': '#1e88e5', // Azul claro - acentos y hover
          'green': '#7cb342',     // Verde lima - enlaces principales
          'green-light': '#9ccc65', // Verde lima claro - enlaces hover
          'text': '#ffffff',      // Blanco - texto principal
          'text-secondary': '#b0b0b0', // Gris claro - texto secundario
          'border': '#1e293b',    // Gris oscuro para bordes
        }
      },
      fontSize: {
        'title-h1': ['2.5rem', { lineHeight: '3rem', fontWeight: '700' }],
        'title-h2': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'title-h3': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'link': ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],
        'text': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
      }
    },
  },
  plugins: [],
};
export default config;