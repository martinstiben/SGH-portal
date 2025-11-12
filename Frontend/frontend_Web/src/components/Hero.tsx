import React from "react";
import Link from "next/link";
import Image from "next/image";
import HeroContent from "./HeroContent";
import HeroStats from "./HeroStats";
import HeroDecorations from "./HeroDecorations";

/**
 * Componente principal del Hero section de la landing page
 *
 * Renderiza la sección principal con contenido, estadísticas y decoraciones animadas.
 * Está compuesto por subcomponentes especializados para mantener la separación de responsabilidades.
 *
 * @returns {JSX.Element} El componente Hero renderizado
 *
 * @example
 * ```tsx
 * <Hero />
 * ```
 */
export default function Hero() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col lg:flex-row items-center justify-center px-6 sm:px-10 lg:px-20 py-16">

      {/* Logo esquina */}
      <div className="absolute top-8 left-8 lg:top-12 lg:left-16">
        <span className="text-slate-900 font-extrabold text-3xl lg:text-4xl tracking-tight drop-shadow-sm">SGH</span>
      </div>

      {/* Botón ingresar */}
      <Link
        href="/login"
        className="absolute top-6 right-6 lg:top-8 lg:right-8 bg-slate-800 text-white px-5 py-2.5 rounded-lg shadow-lg hover:bg-slate-700 transition-all duration-200 text-sm font-medium"
      >
        Acceder
      </Link>

      {/* Columna izquierda */}
      <div className="max-w-2xl space-y-8 text-center lg:text-left z-10 animate-slideInLeft">
        <HeroContent />
        <HeroStats />
      </div>

      {/* Columna derecha */}
      <div className="animate-slideInRight">
        <HeroDecorations />
      </div>
    </div>
  );
}

