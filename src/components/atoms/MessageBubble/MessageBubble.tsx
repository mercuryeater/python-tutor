import { Message } from "ai/react";

interface MessageBubbleProps {
  message: Message;
}
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { content, role } = message;
  return <div className={`${role} bubble`}>{content}</div>;
};

export default MessageBubble;
