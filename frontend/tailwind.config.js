/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      colors: {
        surface: {
          DEFAULT: "#0f0f1a",
          card: "#16162a",
          border: "#2a2a4a",
        },
      },

      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },

        orb: {
          "0%,100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(20px,-20px)" },
        },

        particle: {
          "0%,100%": { transform: "translateY(0)", opacity: "0.6" },
          "50%": { transform: "translateY(-15px)", opacity: "1" },
        },

        scan: {
          "0%": { top: "-2px", opacity: "0" },
          "50%": { opacity: "0.5" },
          "100%": { top: "100vh", opacity: "0" },
        },
      },

      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "orb-1": "orb 12s ease-in-out infinite",
        "orb-2": "orb 16s ease-in-out infinite reverse",
        "particle": "particle 8s ease-in-out infinite",
        "scan-line": "scan 8s ease-in-out infinite",
      },

      backdropBlur: {
        xs: "2px",
      },
    },
  },

  plugins: [],
};