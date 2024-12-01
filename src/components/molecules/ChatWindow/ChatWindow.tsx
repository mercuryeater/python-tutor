"use client";
import React from "react";
import { useChat } from "ai/react";

import MessageBubble from "@/components/atoms/MessageBubble/MessageBubble";
import LoadingBubble from "@/components/atoms/LoadingBubble/LoadingBubble";

import "./chatWindow.scss";
const ChatWindow: React.FC = () => {
  const { isLoading, messages, input, handleInputChange, handleSubmit } =
    useChat({
      onResponse: (response) => {
        console.log("response onres:", response);
      },
    });

  return (
    <div className="chatWindow">
      <>
        <div className="messagesContainer">
          {mockMessages.map((message, index) => (
            <MessageBubble key={`message-${index}`} message={message} />
          ))}
        </div>
        {isLoading && <LoadingBubble />}
      </>
      <form className="sendMessageForm" onSubmit={handleSubmit}>
        <input
          className="sendMessageForm__input"
          onChange={handleInputChange}
          value={input}
          placeholder="Preguntame y lleguemos a la respuesta..."
        />
        <input className="sendMessageForm__sendBtn" type="submit" />
      </form>
    </div>
  );
};

export default ChatWindow;

const mockMessages = [
  {
    content: "Hello! How can I help you today?",
    role: "bot",
  },
  {
    content: "I need help with my order",
    role: "user",
  },
  {
    content: "sss",
    role: "bot",
  },
];
