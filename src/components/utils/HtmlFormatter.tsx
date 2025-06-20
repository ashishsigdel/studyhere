import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import parse, {
  domToReact,
  type HTMLReactParserOptions,
} from "html-react-parser";

type Props = {
  code: string;
  language: string;
  theme: string;
};

function CodeBlock({ code, language, theme }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
  };

  return (
    <div
      style={{
        position: "relative",
        border: theme === "dark" ? "1px solid #333" : "1px solid #ccc",
        borderRadius: "0.5rem",
        overflow: "hidden",
        margin: "1rem 0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 1rem",
          backgroundColor: theme === "dark" ? "#1a1a1a" : "#f9f9f9",
          borderBottom: "1px solid",
          borderColor: theme === "dark" ? "#333" : "#ccc",
          borderTopLeftRadius: "0.5rem",
          borderTopRightRadius: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            color: theme === "dark" ? "#ccc" : "#333",
            fontFamily: "monospace",
          }}
        >
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          style={{
            transitionProperty: "opacity",
            transitionDuration: "200ms",
            padding: "0.25rem 0.75rem",
            borderRadius: "0.25rem",
            cursor: "pointer",
            backgroundColor: theme === "dark" ? "#333" : "#f9f9f9",
            color: theme === "dark" ? "#ccc" : "#333",
            border: theme === "dark" ? "1px solid #333" : "1px solid #ccc",
            outline: "none",
          }}
        >
          {copied ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="green"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#16a34a" }}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </span>
          ) : (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </span>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        customStyle={{ margin: 0 }}
        language={language}
        style={theme === "dark" ? atomDark : prism}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function InlineCode({ code, theme }: { code: string; theme: string }) {
  return (
    <span
      style={{
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#ccc" : "#333",
        padding: "0.25rem 0.5rem",
        borderRadius: "0.25rem",
        fontSize: "0.875rem",
        fontFamily: "monospace",
        border: theme === "dark" ? "1px solid #444" : "1px solid #ccc",
      }}
    >
      {code}
    </span>
  );
}

const parseInlineStyle = (styleString = "") => {
  const style: any = {};
  styleString.split(";").forEach((rule) => {
    const [key, value] = rule.split(":").map((s) => s.trim());
    if (!key || !value) return;
    const camelKey = key.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
    style[camelKey] = value;
  });
  return style;
};

type MainProps = {
  content: string;
  theme: "light" | "dark";
};

export default function HtmlFormatter({ content, theme }: MainProps) {
  const replace: HTMLReactParserOptions["replace"] = (domNode: any) => {
    const { name, attribs = {}, children } = domNode;

    if (!name) return;

    if (name === "body") {
      return <div>{domToReact(children, { replace })}</div>;
    }

    if (name === "pre" && children?.[0]?.name === "code") {
      const codeNode = children[0];
      const codeText = codeNode.children?.[0]?.data || "";
      const langMatch = (codeNode.attribs?.class || "").match(/language-(\w+)/);
      const language = langMatch?.[1] || "text";
      return (
        <CodeBlock code={codeText.trim()} language={language} theme={theme} />
      );
    }

    if (name === "code" && domNode.parent?.name !== "pre") {
      const inlineCode = domNode.children?.[0]?.data || "";
      return <InlineCode code={inlineCode} theme={theme} />;
    }

    const headingDefaults = {
      h1: { fontSize: "2rem", margin: "0.67em 0" },
      h2: { fontSize: "1.5rem", margin: "0.75em 0" },
      h3: { fontSize: "1.17em", margin: "0.83em 0" },
      h4: { fontSize: "1em", margin: "1.12em 0" },
    };
    if (["h1", "h2", "h3", "h4"].includes(name)) {
      const Tag = name as keyof typeof headingDefaults;
      return (
        <Tag style={headingDefaults[Tag]}>
          {domToReact(children, { replace })}
        </Tag>
      );
    }

    if (name === "p") {
      const inlineStyle = parseInlineStyle(attribs?.style);
      const mergedStyle = {
        fontSize: "1rem",
        margin: "0 0 1em 0",
        ...inlineStyle,
      };
      return <p style={mergedStyle}>{domToReact(children, { replace })}</p>;
    }

    if (name === "blockquote") {
      return (
        <blockquote
          style={{
            borderLeft: "4px solid #2f67ff",
            padding: "1rem",
            margin: "1rem 0",
            backgroundColor: theme === "dark" ? "#b3d8ff" : "#d5ebff",
            color: theme === "dark" ? "#0a195c" : "#0a195c",
            fontStyle: "italic",
          }}
        >
          {domToReact(children, { replace })}
        </blockquote>
      );
    }

    if (name === "hr") {
      return (
        <hr
          style={{
            margin: "1rem 0",
            borderTop:
              theme === "dark" ? "1px solid #374151" : "1px solid #e5e7eb",
            borderTopWidth: "0.5px",
            borderTopStyle: "solid",
          }}
        />
      );
    }

    if (name === "ol") {
      return (
        <ol
          style={{
            listStyleType: "decimal",
            listStylePosition: "inside",
            margin: "1rem 0",
            paddingLeft: "2rem",
            listStyle: "initial",
          }}
        >
          {domToReact(children, { replace })}
        </ol>
      );
    }

    if (name === "ul") {
      return (
        <ul
          style={{
            listStyleType: "disc",
            listStylePosition: "inside",
            margin: "1rem 0",
            paddingLeft: "2rem",
            listStyle: "initial",
          }}
        >
          {domToReact(children, { replace })}
        </ul>
      );
    }

    if (name === "li") {
      return (
        <li
          style={{
            marginBottom: "0.35em",
          }}
        >
          {domToReact(children, { replace })}
        </li>
      );
    }

    if (name === "table") {
      return (
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            margin: "1.5rem 0",
            fontSize: "0.95rem",
            backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
            color: theme === "dark" ? "#e0e0e0" : "#222",
            borderRadius: "12px",
            border: `1px solid ${theme === "dark" ? "#444" : "#ddd"}`,
            overflow: "hidden",
          }}
        >
          {domToReact(children, { replace })}
        </table>
      );
    }

    if (name === "thead") {
      return <thead>{domToReact(children, { replace })}</thead>;
    }

    if (name === "tbody") {
      return <tbody>{domToReact(children, { replace })}</tbody>;
    }

    if (name === "tr") {
      const trStyles = {
        transition: "background-color 0.2s ease",
      };

      const handleMouseOver = (e: React.MouseEvent<HTMLTableRowElement>) => {
        e.currentTarget.style.backgroundColor =
          theme === "dark" ? "#2c2c2c" : "#f8f8f8";
      };

      const handleMouseOut = (e: React.MouseEvent<HTMLTableRowElement>) => {
        e.currentTarget.style.backgroundColor = "";
      };

      return (
        <tr
          style={trStyles}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {domToReact(children, { replace })}
        </tr>
      );
    }

    if (name === "th") {
      const thStyles = {
        padding: "1rem",
        borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e0e0e0"}`,
        borderRight: `1px solid ${theme === "dark" ? "#333" : "#e0e0e0"}`,
        textAlign: "left" as const,
        backgroundColor: theme === "dark" ? "#252525" : "#f0f0f0",
        color: theme === "dark" ? "#f0f0f0" : "#333",
        fontWeight: 600,
        fontSize: "0.9em",
        textTransform: "capitalize" as const,
        letterSpacing: "0.5px",
      };

      return <th style={thStyles}>{domToReact(children, { replace })}</th>;
    }

    if (name === "td") {
      const tdStyles = {
        padding: "1rem",
        borderBottom: `1px solid ${theme === "dark" ? "#2a2a2a" : "#eee"}`,
        borderRight: `1px solid ${theme === "dark" ? "#2a2a2a" : "#eee"}`,
        backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
      };

      return <td style={tdStyles}>{domToReact(children, { replace })}</td>;
    }

    if (name === "img") {
      return (
        <img
          src={attribs.src}
          alt={attribs.alt}
          style={{
            margin: "1.5rem 0",
            objectFit: "contain",
          }}
        />
      );
    }

    return undefined;
  };

  const parsedContent = parse(content, { replace });

  return <div>{parsedContent}</div>;
}
