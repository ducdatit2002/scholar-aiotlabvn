/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#194280',
          light: '#1e51a0',
          dark: '#143666'
        }
      }
    }
  },
  theme: {
    extend: {
      animation: {
        marquee: "marquee 60s linear infinite",
        marquee2: "marquee2 60s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#ffffff",
        white_blue: "#F5F7FD",
        black: "#0E0E0E",
        blue_dark: "#146C94",
        blue: "#19A7CE",
        grey: "#585858",
        grey_light: "#19A7CE",
        yellow: "#E8A423",
        primary: {
          DEFAULT: "#194280",
          light: "#1e51a0",
          dark: "#143666"
        },
        red: "#FF0000"
      }
    }
  },
  plugins: [],
};

export default config;
