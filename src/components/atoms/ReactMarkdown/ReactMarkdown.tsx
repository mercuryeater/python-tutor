import ReactMarkdown from "react-markdown";

interface MarkdownComponentProps {
  text: string;
}

function MarkdownComponent({ text }: MarkdownComponentProps) {
  return (
    <section>
      <ReactMarkdown>{text}</ReactMarkdown>
    </section>
  );
}

export default MarkdownComponent;
