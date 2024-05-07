const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./resources/views/**/*.{blade.php,antlers.html}",
      "./content/collections/pages/**/*.md",
  ],
  theme: {
    extend: {
        colors: {
            gray: colors.zinc,
        },
        fontFamily: {
            sans: ['trade-gothic-next', 'system-ui', 'sans-serif'],
            condensed: ['trade-gothic-next-compressed', 'system-ui', 'sans-serif'],
            mono: ['Berkeley Mono', 'monospace'],
        },
    },
  },
  plugins: [],
}

