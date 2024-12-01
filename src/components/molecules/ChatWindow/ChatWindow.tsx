"use client";
import React, { useEffect, useRef } from "react";
import { useChat } from "ai/react";

import MessageBubble from "@/components/atoms/MessageBubble/MessageBubble";
import LoadingBubble from "@/components/atoms/LoadingBubble/LoadingBubble";

import "./chatWindow.scss";

const ChatWindow: React.FC = () => {
  const messagesContainerRef = useRef(null);

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
    content:
      '¡Por supuesto! Aquí tienes un ejemplo que mezcla texto normal, markdown y algo de código:\n\n---\n\n**Un Día en Usaquén**:\n\n*Por la mañana*:\n- **7:00 AM**: **Despierta** y disfruta una taza de _café colombiano recién hecho_. ☕\n\n*Por la tarde*:\n- **1:00 PM**: Disfruta un **almuerzo** delicioso en un puesto local de _arepas_. 🌮\n\n*Por la noche*:\n- **6:00 PM**: Da un paseo tranquilo por las pintorescas calles de Usaquén.\n\n```python\n# Ejemplo de código simple en Python\ndef saludos(nombre):\n    return f"Hola, {nombre}! Bienvenido a Usaquén."\n\nnombre_usuario = "Amigo"\nprint(saludos(nombre_usuario))\n```\n\n---\n\nEspero que esto te muestre cómo puedes combinar texto normal, markdown y código para crear contenido atractivo y estructurado. 😊',
    role: "assistant",
  },
  {
    content: "I need help with my order",
    role: "user",
  },
  {
    content: "sss",
    role: "assistant",
  },
];

const mockMarkdown = `# ¡Hola! 👋 `;
