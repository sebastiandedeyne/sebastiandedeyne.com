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
