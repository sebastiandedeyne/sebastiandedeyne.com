const production = process.env.HUGO_ENV === "production";

module.exports = {
  plugins: [
    require("tailwindcss"),
    production &&
      require("@fullhuman/postcss-purgecss")({
        content: ["./layouts/**/*.html", "./content/**/*.html"],
        defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
        whitelistPatterns: [/markup/, /pagination/]
      }),
    production && require("autoprefixer"),
    production && require("cssnano")
  ]
};
