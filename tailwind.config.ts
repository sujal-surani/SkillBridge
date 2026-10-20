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
        cream: {
          50: "#FFFEFD",
          100: "#FDFBF7", // Main background canvas
          200: "#F7F2EA",
          300: "#EFE6D8",
          400: "#E5D8C3",
          500: "#D3BEA1",
        },
        burgundy: {
          50: "#FBF4F5",
          100: "#F5E4E6",
          200: "#E8BFC4",
          300: "#D8959E",
          400: "#BA5564",
          500: "#8C3843",
          600: "#722F37", // Primary Brand Color
          700: "#5A252C", // Hover state
          800: "#441D22",
          900: "#2F1418",
        },
        peach: {
          50: "#FFF8F4",
          100: "#FFE8D6", // Light Accent / Badge background
          200: "#FFD0B3",
          300: "#FFB085", // Soft Peach / Coral highlight
          400: "#F98B53",
          500: "#E86927",
        },
        slate: {
          heading: "#2D3748",
          body: "#4A5568",
          muted: "#718096",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(0, 0, 0, 0.03)",
        card: "0 8px 30px rgba(114, 47, 55, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02)",
        "card-hover": "0 20px 40px rgba(114, 47, 55, 0.08), 0 6px 16px rgba(0, 0, 0, 0.03)",
        float: "0 25px 50px -12px rgba(114, 47, 55, 0.12)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
