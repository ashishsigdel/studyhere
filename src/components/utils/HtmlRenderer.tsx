"use client";

import MarkupRenderer from "@ashish-ui/markup-renderer";
import { useTheme } from "next-themes";

interface Props {
  content: string;
  style?: string;
}
export default function HtmlRenderer({ content, style }: Props) {
  const { theme } = useTheme();
  if (content && (content.includes("</p>") || content.includes("</"))) {
    return (
      <div className="prose dark:prose-invert max-w-full overflow-x-auto whitespace-normal">
        <div
          className={`${style}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
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
