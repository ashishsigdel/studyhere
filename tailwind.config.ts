import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@ashish-ui/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#4caf50",
        "white-variant": "#dddee0",
        "dark-variant": "#2c2f34",
        "white-light-variant": "#F5F5F5",
        "dark-light-variant": "#464646",
        "dark-bg": "#323232",
      },
    },
  },
  plugins: [],
} satisfies Config;
