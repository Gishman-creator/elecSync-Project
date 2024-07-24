/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}","./{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        'aspect-contain': 'aspect-contain', // Custom aspect-contain utility class
      },
      colors: {
        customYellow: '#ffc664',
      },
    },
  },
  plugins: [],
}

