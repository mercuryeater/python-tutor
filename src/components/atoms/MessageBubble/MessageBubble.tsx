import { Message } from "ai/react";
import "./messageBubble.scss";
import MarkdownComponent from "../ReactMarkdown/ReactMarkdown";

interface MessageBubbleProps {
  message: Message | any;
}
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { content, role } = message;
  return (
    <div className={`${role} bubble`}>
      <MarkdownComponent text={content} />
    </div>
  );
};

export default MessageBubble;
