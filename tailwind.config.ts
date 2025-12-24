import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f5ff",
          100: "#e6e9fe",
          200: "#c7cdfb",
          300: "#a7b1f8",
          400: "#3f59f2",
          500: "#223ad4",
          600: "#1a2faf",
          700: "#132489",
          800: "#0d195e",
          900: "#070f38"
        }
      },
      fontFamily: {
        heading: ["'Poppins'", "sans-serif"],
        body: ["'Inter'", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
