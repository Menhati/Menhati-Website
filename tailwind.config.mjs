/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Primary surface / brand color — deep, official, "ministry letterhead" navy
        // Full scale on purpose: missing steps fail silently in class attributes
        // (the style just never applies) and only error inside @apply, which made
        // for confusing half-broken UI. Keep every step defined.
        navy: {
          50: '#EEF2F7',
          100: '#D3DEEA',
          200: '#A6BEDA',
          300: '#7B99C4',
          400: '#4A6FA1',
          500: '#2F5480',
          600: '#1B3A63',
          700: '#152E4F',
          800: '#122A4A',
          900: '#0A1B30',
          950: '#06111F',
        },
        // Accent — used sparingly, like foil on a certificate: seals, deadlines, badges
        gold: {
          100: '#F4E7C6',
          200: '#EAD59A',
          300: '#DEBB68',
          400: '#D3AA50',
          500: '#C89B3C',
          600: '#AF8533',
          700: '#96712A',
        },
        // Status
        live: '#3E7A5C',
        closing: '#B4542A',
        paper: '#F7F6F2',
        ink: '#1A1D22',
      },
      fontFamily: {
        display: ['Tajawal', 'sans-serif'],
        body: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
