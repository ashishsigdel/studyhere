"use client";

import MarkupRenderer from "@ashish-ui/markup-renderer";
import HtmlFormatter from "./HtmlFormatter";
import { useTheme } from "next-themes";

interface Props {
  content: string;
  style?: string;
}
export default function HtmlRenderer({ content, style }: Props) {
  const { theme } = useTheme();
  if (content && content.includes("<") && content.includes("</")) {
    return (
      <HtmlFormatter content={content} theme={theme as "light" | "dark"} />
    );
  } else {
    return (
      <MarkupRenderer
        content={content || "No Content Avaiable"}
        isDark={theme === "dark"}
      />
    );
  }
}
