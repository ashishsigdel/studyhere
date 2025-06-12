"use client";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import React from "react";

const RichTextEditor = dynamic(() => import("richt-editor"), {
  ssr: false,
  loading: () => (
    <div
      className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full"
      style={{ height: "500px" }}
    />
  ),
});

type Props = {
  text: string;
  setText: any;
};

export default function JoditForm({ text, setText }: Props) {
  const { theme } = useTheme();
  return (
    <RichTextEditor
      content={text}
      setContent={setText}
      theme={theme === "dark" ? "dark" : "light"}
      showFooter={false}
    />
  );
}
