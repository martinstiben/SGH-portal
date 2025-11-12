interface HeaderProfessorProps {
  onAddProfessor: () => void;
}

export default function HeaderProfessor({ onAddProfessor }: HeaderProfessorProps) {
  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Profesores 👨‍🏫</h1>
        <p className="text-sm text-gray-600 mt-1">Gestiona la información de los profesores aquí.</p>
      </div>
      <button
        onClick={onAddProfessor}
        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
      >
        Agregar Profesor
      </button>
    </div>
  );
}
