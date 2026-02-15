import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores corporativa ZoneSport
        'zonesport': {
          'bg-dark': '#0d1b2a',        // Azul muy oscuro - fondo principal
          'blue': '#007ACC',            // Azul profundo - botones primarios
          'blue-hover': '#0062A3',      // Azul hover (15% más oscuro)
          'lime': '#8BC34A',            // Verde lima - títulos y headings
          'link': '#6B9B37',            // Verde suave - enlaces y elementos secundarios
        },
        // Colores antiguos mantenidos para compatibilidad
        'zs-dark': '#0d1b2a',      // Azul oscuro actualizado
        'zs-darker': '#0a0f1a',    // Azul aún más oscuro
        'zs-blue': '#007ACC',      // Azul primario actualizado
        'zs-blue-light': '#0062A3', // Azul hover actualizado
        'zs-green': '#8BC34A',     // Verde lima actualizado
        'zs-green-light': '#6B9B37', // Verde suave actualizado
        'zs-text': '#ffffff',      // Blanco - texto principal
        'zs-text-secondary': '#b0b0b0', // Gris claro - texto secundario
        'zs-border': '#1e293b',    // Gris oscuro para bordes
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