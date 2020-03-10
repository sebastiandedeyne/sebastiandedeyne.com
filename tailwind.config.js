module.exports = {
  theme: {
    extend: {
      colors: {
        inherit: "inherit"
      },
      screens: {
        dark: { raw: "(prefers-color-scheme: dark)" }
      }
    }
  },
  variants: {
    margin: ["responsive", "last"]
  },
  plugins: [],
  important: true
};
