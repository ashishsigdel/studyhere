"use client";
import { useTheme } from "next-themes";
import React from "react";
import RichTextEditor from "richt-editor";

type Props = {
  text: string;
  setText: any;
};

export default function RichTEditor({ text, setText }: Props) {
  const { theme } = useTheme();
  return (
    <RichTextEditor
      content={text}
      setContent={setText}
      theme={theme === "dark" ? "dark" : "light"}
    />
  );
}
