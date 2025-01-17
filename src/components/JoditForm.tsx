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
  const config = useMemo(
    () => ({
      uploader: {
        insertImageAsBase64URI: true,
      },
      theme: theme === "light" ? "" : "dark",
      readonly: false,
      placeholder: placeholder ? placeholder : "Start Typing...",
      minHeight: 300,
      maxHeight: 400,
      buttons:
        "bold,italic,underline,ol,superscript,subscript,image,table,symbols,source,preview",
      buttonsMD:
        "bold,italic,underline,ol,superscript,subscript,image,table,symbols,source,preview",
      buttonsSM:
        "bold,italic,underline,ol,superscript,subscript,image,table,symbols,source,preview",
      buttonsXS:
        "bold,italic,underline,ol,superscript,subscript,image,table,symbols,source,preview",
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      statusbar: false,
      toolbarAdaptive: false,
    }),
    []
  );

  return (
    <div className="w-full rounded-lg mb-5">
      <JoditEditor
        ref={editor}
        value={text}
        config={config}
        onBlur={(newContent) => setText(newContent)}
        onChange={(newContent) => {}}
      />
    </div>
  );
}
