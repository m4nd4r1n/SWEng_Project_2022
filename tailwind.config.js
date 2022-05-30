module.exports = {
  content: [
    "./components/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        popin: {
          "0%": { opacity: "0", transform: "translateY(400px) scale(0.75)" },
          "75%": { opacity: "1", transform: "translateY(-16px) scale(1)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
        popout: {
          "0%": { opacity: "1", transform: "translateY(0px) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(400px) scale(0.75)" },
        },
      },
      animation: {
        popin: "popin 0.4s forwards ease-in-out",
        popout: "popout 0.4s forwards ease-in-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
