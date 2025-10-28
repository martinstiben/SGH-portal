import React from "react";

/**
 * Componente que renderiza los elementos decorativos animados del Hero
 *
 * Incluye el logo principal, trofeo, cohete y círculos decorativos con diversas animaciones.
 * Todos los elementos están posicionados absolutamente para crear una composición visual atractiva.
 *
 * @returns {JSX.Element} Los elementos decorativos del Hero
 */
const HeroDecorations: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center mt-12 lg:mt-0 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg opacity-0 animate-fade-in delay-4 ml-16 lg:ml-24">
      <img
        src="/byte.png"
        alt="Bytestock Logo"
        className="w-72 h-44 sm:w-88 sm:h-52 md:w-104 md:h-60 lg:w-120 lg:h-68 drop-shadow-2xl hover:scale-105 transition-transform duration-300 object-contain"
      />

      {/* Trofeo */}
      <img
        src="/trophy.png"
        alt="Trophy"
        className="absolute -top-4 -left-10 w-20 sm:w-24 lg:w-32 animate-bounce-slow"
      />

      {/* Cohete */}
      <img
        src="/rocket.png"
        alt="Rocket"
        className="absolute -top-2 right-0 w-20 sm:w-24 lg:w-32 animate-fly-up"
      />

      {/* Círculos decorativos principales */}
      <img
        src="/object1.png"
        alt="Blue Circle"
        className="absolute top-32 -left-10 w-12 sm:w-16 lg:w-20 animate-bounce"
      />
      <img
        src="/object2.png"
        alt="Orange Circle"
        className="absolute bottom-4 -left-8 w-12 sm:w-16 lg:w-20 animate-pulse"
      />
      <img
        src="/object3.png"
        alt="Yellow Circle"
        className="absolute top-36 -right-10 w-12 sm:w-16 lg:w-20 animate-float"
      />
      <img
        src="/object4.png"
        alt="Purple Circle"
        className="absolute bottom-12 right-4 w-12 sm:w-16 lg:w-20 animate-bounce"
      />

    </div>
  );
};

export default HeroDecorations;