export default function HeaderSchedule({ onGenerateClick }: { onGenerateClick?: () => void }) {
  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Horarios 📆</h1>
        <p className="text-sm text-gray-600 mt-1">Gestiona la generación y visualización de horarios.</p>
      </div>
      {onGenerateClick && (
        <button
          onClick={onGenerateClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
        >
          <span>⚡</span>
          Generar Horarios
        </button>
      )}
    </div>
  );
}
