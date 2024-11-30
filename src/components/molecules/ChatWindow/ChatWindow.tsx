"use client";
import React from "react";
import { useChat } from "ai/react";

import MessageBubble from "@/components/atoms/MessageBubble/MessageBubble";
import LoadingBubble from "@/components/atoms/LoadingBubble/LoadingBubble";

const ChatWindow: React.FC = () => {
  const {
    // append,
    isLoading,
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({
    onResponse: (response) => {
      console.log("response onres:", response);
      // append(response);
    },
  });

  return (
    <div>
      <>
        <p>aa</p>
        {/* Map messages onto text bubbles */}
        {messages.map((message, index) => (
          <MessageBubble key={`message-${index}`} message={message} />
        ))}
        {isLoading && <LoadingBubble />}
      </>
      <form onSubmit={handleSubmit}>
        <input
          className="question-box"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me something..."
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default ChatWindow;
