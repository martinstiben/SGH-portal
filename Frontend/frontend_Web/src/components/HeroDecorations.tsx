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
    <div className="relative flex items-center justify-center w-full max-w-md lg:max-w-lg">
      <div className="relative">
        {/* Imagen principal */}
        <img
          src="/byte.png"
          alt="SGH - Sistema de Gestión de Horarios"
          className="w-80 h-60 lg:w-96 lg:h-72 rounded-2xl shadow-2xl object-contain"
        />

        {/* Elemento decorativo sutil */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-slate-200 rounded-full opacity-30"></div>
      </div>
    </div>
  );
};

export default HeroDecorations;