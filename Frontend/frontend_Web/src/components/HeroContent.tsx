import React from "react";

/**
 * Componente que renderiza el contenido textual principal del Hero
 *
 * Incluye el título principal, la lista de características y la información de contacto.
 * Implementa animaciones de fade-in con delays progresivos.
 *
 * @returns {JSX.Element} El contenido textual del Hero
 */
const HeroContent: React.FC = React.memo(() => {
  return (
    <div className="space-y-6">
      {/* Título */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-800">
        Sistema de Gestión de Horarios{" "}
        <span className="text-blue-600">
          Académicos
        </span>
        <br className="hidden sm:block" />
        Optimizado para Instituciones Educativas
      </h1>

      {/* Subtítulo */}
      <p className="text-lg text-slate-600 max-w-lg">
        Automatiza la creación de horarios escolares con algoritmos avanzados,
        garantizando eficiencia operativa y satisfacción docente.
      </p>

      {/* Lista de características */}
      <ul className="space-y-4 text-slate-700">
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm font-bold">✓</span>
          </div>
          <span className="text-base">Algoritmos de optimización para distribución equitativa de cargas docentes</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm font-bold">✓</span>
          </div>
          <span className="text-base">Gestión integral de recursos humanos y curriculares</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm font-bold">✓</span>
          </div>
          <span className="text-base">Dashboard analítico con métricas de rendimiento institucional</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm font-bold">✓</span>
          </div>
          <span className="text-base">Arquitectura segura con encriptación de datos y autenticación robusta</span>
        </li>
      </ul>
    </div>
  );
});

export default HeroContent;