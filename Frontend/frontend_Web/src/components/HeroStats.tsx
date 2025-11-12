import React from "react";

/**
 * Componente que renderiza las estadísticas destacadas del Hero
 *
 * Muestra métricas clave del colegio con animaciones y diseño responsivo.
 * Cada estadística incluye un número, descripción y colores temáticos.
 *
 * @returns {JSX.Element} Las estadísticas del Hero
 */
const HeroStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
      {[
        {
          num: "99.9%",
          text: "Tasa de disponibilidad del sistema",
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
        },
        {
          num: "50%",
          text: "Reducción en tiempo de planificación",
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-200",
        },
        {
          num: "24/7",
          text: "Soporte técnico especializado",
          color: "text-slate-600",
          bg: "bg-slate-50",
          border: "border-slate-200",
        },
      ].map((stat, i) => (
        <div
          key={i}
          className={`${stat.bg} ${stat.border} border p-6 rounded-lg hover:shadow-lg transition-all duration-300 text-center`}
        >
          <h2 className={`text-3xl font-bold ${stat.color} mb-2`}>
            {stat.num}
          </h2>
          <p className="text-slate-700 text-sm leading-relaxed">{stat.text}</p>
        </div>
      ))}
    </div>
  );
};

export default HeroStats;