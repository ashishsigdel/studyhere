export const convertMarkdownToHtml = (text: string): string => {
  // Convert bold text (**text**) to <strong>text</strong>
  const boldRegex = /\*\*(.*?)\*\*/g;
  let processedText = text.replace(boldRegex, "<strong>$1</strong>");

  // Convert lists (assuming '*' or '-' for bullet points)
  const listItemRegex = /^\s*[\*\-]\s+(.*)$/gm;
  if (listItemRegex.test(processedText)) {
    listItemRegex.lastIndex = 0;
    const lines = processedText.split("\n");
    let inList = false;

    processedText = lines
      .map((line) => {
        const listMatch = line.match(/^\s*[\*\-]\s+(.*)/);
        if (listMatch) {
          const prefix = !inList ? "<ul>\n" : "";
          inList = true;
          return `${prefix}<li>${listMatch[1]}</li>`;
        } else {
          const suffix = inList ? "</ul>\n" : "";
          inList = false;
          return `${suffix}${line}`;
        }
      })
      .join("\n");

    if (inList) {
      processedText += "\n</ul>";
    }
  }

  // Convert ## text to <h2>text</h2>
  const headerRegex = /^##\s+(.*)$/gm;
  processedText = processedText.replace(headerRegex, "<h2>$1</h2>");

  // Convert ### text to <h2>text</h2>
  const subHeaderRegex = /^###\s+(.*)$/gm;
  processedText = processedText.replace(subHeaderRegex, "<h2>$1</h2>");

  // Convert --- to <hr>
  const hrRegex = /^---$/gm;
  processedText = processedText.replace(hrRegex, "<hr>");

  // Convert paragraphs
  const paragraphs = processedText.split(/\n\s*\n/);
  processedText = paragraphs
    .map((para) => {
      if (para.trim() === "" || /<\/?[a-z][\s\S]*>/i.test(para)) {
        return para;
      }
      return `<p>${para}</p>`;
    })
    .join("\n\n");

  return processedText;
};
