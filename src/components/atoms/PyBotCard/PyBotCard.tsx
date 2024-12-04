import React from "react";
import Image from "next/image";
import "./pyBotCard.scss";

const PyBotCard: React.FC = () => {
  return (
    <div className="pyBotCard">
      <Image src="/robot.png" alt="KodBot" width={300} height={300} />
      <div className="pyBotCard__text">
        <h2>¡Hola, Soy PyBot! 👋🏼</h2>
        <p>Tu tutor de Python virtual.</p>
        <p>
          Hazme las preguntas que quieras acerca del ejercicio o proyecto actual
          en el que estás trabajando.
        </p>
      </div>
    </div>
  );
};

export default PyBotCard;
