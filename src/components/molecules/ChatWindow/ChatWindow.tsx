"use client";
import React, { useEffect, useRef } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { useChat } from "ai/react";

import MessageBubble from "@/components/atoms/MessageBubble/MessageBubble";
import LoadingBubble from "@/components/atoms/LoadingBubble/LoadingBubble";

import "./chatWindow.scss";

const ChatWindow: React.FC = () => {
  const messagesContainerRef = useRef(null);
  const textAreaRef = useRef(null);

  const { isLoading, messages, input, handleInputChange, handleSubmit } =
    useChat({
      onResponse: (response) => {
        console.log("response onres:", response);
      },
    });

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chatWindow">
      <>
        <div ref={messagesContainerRef} className="messagesContainer">
          {messages.map((message, index) => (
            <MessageBubble key={`message-${index}`} message={message} />
          ))}
        </div>
        {isLoading && <LoadingBubble />}
      </>
      <form
        className="sendMessageForm"
        onSubmit={handleSubmit}
        onClick={() => textAreaRef.current?.focus()}
      >
        <textarea
          ref={textAreaRef} // Attach the ref
          className="sendMessageForm__input"
          onChange={(e) => {
            handleInputChange(e);
            // 3 rem set as min height beacuse of padding and text sum
            e.target.style.height = "3rem"; // Reset height
            e.target.style.height = `${e.target.scrollHeight}px`; // Set new height
          }}
          value={input}
          placeholder="Preguntame y lleguemos a la respuesta..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button type="submit" className="sendMessageForm__sendBtn">
          <PaperPlaneTilt size={22} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
