"use client";
import { useTheme } from "next-themes";
import React from "react";
import RichTextEditor from "richt-editor";

type Props = {
  text: string;
  setText: any;
  height?: string;
};

export default function RichTEditor({
  text,
  setText,
  height = "500px",
}: Props) {
  const { theme } = useTheme();
  return (
    <div style={{ height: height, marginBottom: "20px" }}>
      <RichTextEditor
        content={text}
        setContent={setText}
        theme={theme === "dark" ? "dark" : "light"}
      />
    </div>
  );
}
