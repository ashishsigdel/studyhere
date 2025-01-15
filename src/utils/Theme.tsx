"use client";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Theme() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded p-2"
    >
      {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
    </button>
  );
}
