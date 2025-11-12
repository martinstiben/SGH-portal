interface HeaderCourseProps {
  onAddCourse: () => void;
}

export default function HeaderCourse({ onAddCourse }: HeaderCourseProps) {
  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Cursos 🎓</h1>
        <p className="text-sm text-gray-600 mt-1">Gestiona la información de los cursos aquí.</p>
      </div>
      <button
        onClick={onAddCourse}
        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
      >
        Agregar Curso
      </button>
    </div>
  );
}
