/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#84C1FF",
      },
      backgroundImage: {
        fire: "url('/fire.gif')"
      },
    },
  },
  variants: {
    extend: {},
  },
  // Add your custom styles here
  corePlugins: {
    // Uncomment this line if you want to keep the default button styles
    // preflight: false,
  },
  // Add your custom styles here
  plugins: [
    // Add your custom components and utilities here
    function ({ addBase, addComponents }) {
      addBase([
        // Add base styles here
      ]);

      addComponents([
        {
          ".btn3": {
            "justify-content": "center",
            background: "linear-gradient(97deg, rgba(0,0,0,0) 0%, rgba(1,1,1,1) 31%, rgba(0,0,0,0) 99%)",
            "background-position": "125%",
            "background-size": "200% auto",
            "&:hover": {
              animation: "shine 2s infinite",
            },
          },
          ".btn2": {
            "justify-content": "center",
            background: "linear-gradient(97deg, rgb(255,255,255) 0%, rgb(99,102,241) 31%, rgb(255,255,255) 99%)",
            "background-position": "125%",
            "background-size": "200% auto",
            "&:hover": {
              animation: "shine 2s infinite",
            },
          },
          "@keyframes shine": {
            to: {
              "background-position": "-70%",
            },
          },
        },
      ]);
    },
  ],
};
