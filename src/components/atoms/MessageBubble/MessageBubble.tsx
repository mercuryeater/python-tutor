import { Message } from "ai/react";
import "./messageBubble.scss";

interface MessageBubbleProps {
  message: Message | any;
}
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { content, role } = message;
  return <div className={`${role} bubble`}>{content}</div>;
};

export default MessageBubble;
