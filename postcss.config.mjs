import autoprefixer from "autoprefixer";

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {}, // ✅ phải là object, không chỉ ghi "autoprefixer"
  },
};
