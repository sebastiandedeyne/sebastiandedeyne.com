const defaultTheme = require("tailwindcss/defaultTheme");
const production = process.env.HUGO_ENV === "production";

module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  purge: {
    enabled: production,
    content: [
      "./assets/js/**/*.js",
      "./content/**/*.html",
      "./layouts/**/*.html",
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["Fira Code", ...defaultTheme.fontFamily.mono],
      },
      fontWeight: {
        bold: 600,
      },
      colors: {
        inherit: "inherit",
      },
      screens: {
        dark: { raw: "(prefers-color-scheme: dark)" },
      },
    },
  },
  plugins: [],
  important: true,
};
