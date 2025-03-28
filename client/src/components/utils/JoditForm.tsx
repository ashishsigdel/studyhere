"use client";
import JoditEditor from "jodit-react";
import { useTheme } from "next-themes";
import React, { useMemo, useRef } from "react";

export default function JoditForm({
  text,
  setText,
  placeholder,
}: {
  text: string;
  setText: any;
  placeholder?: string;
}) {
  const { theme } = useTheme();
  const editor = useRef(null);
  const isDarkMode = theme === "dark";

  const config = useMemo(
    () => ({
      iframe: true,
      theme: isDarkMode ? "dark" : "",
      readonly: false,
      placeholder: placeholder || "Start Typing...",
      minHeight: 300,
      maxHeight: 600,
      statusbar: false,
      style: {
        backgroundColor: isDarkMode ? "#020617" : "#f3f4f6",
        color: isDarkMode ? "#ffffff" : "#000000",
        fontSize: "18px",
      },
      disablePlugins: "about",
    }),
    [placeholder, theme]
  );

  return (
    <div
      className={`w-full rounded-lg mb-5 border ${
        isDarkMode
          ? "bg-slate-800  border-white/20"
          : "bg-gray-200 border-black/10"
      }`}
    >
      <JoditEditor
        ref={editor}
        value={text}
        config={config}
        onBlur={(newContent) => setText(newContent)}
        onChange={() => {}}
      />
    </div>
  );
}
