"use client";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import React from "react";

const RichTextEditor = dynamic(() => import("@ashish-ui/richsee"), {
  ssr: false,
  loading: () => (
    <div
      className="animate-pulse bg-gray-200 dark:bg-dark-variant rounded-md w-full"
      style={{ height: "500px" }}
    />
  ),
});

type Props = {
  text: string;
  setText: any;
  height?: string;
};

export default function RichTEditor({ text, setText, height }: Props) {
  const { theme } = useTheme();
  console.log(height);

  return (
    <div style={{ height: height, marginBottom: "20px" }}>
      <RichTextEditor
        content={text}
        setContent={setText}
        theme={theme === "dark" ? "dark" : "light"}
        showFooter={false}
        imageUploadAPIUrl={`/api/contact/for-image`}
      />
    </div>
  );
}
