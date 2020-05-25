const production = process.env.HUGO_ENV === "production";

module.exports = {
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
  variants: {
    margin: ["responsive", "last"],
  },
  plugins: [],
  important: true,
};
