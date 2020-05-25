const production = process.env.HUGO_ENV === "production";

module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    production && require("cssnano"),
  ],
};
