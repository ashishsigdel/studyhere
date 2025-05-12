interface Props {
  content: string;
  style?: string;
}
export default function HtmlRenderer({ content, style }: Props) {
  return (
    <div className="prose dark:prose-invert max-w-full overflow-x-auto whitespace-normal">
      <div
        className={`${style}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
