import { type Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",  
  "./index.html", 

],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    require("tailwindcss-animate"),
    require("tailwind-scrollbar"),
    require("tailwindcss-elevation"),
],
  // daisyUI config (optional - here are the default values)
  daisyui: {
    themes: ["cupcake", "luxury", "light", "lofi", "bumblebee"],
  },
} satisfies Config;
