import { X, Edit, BookOpen, Calendar, Book, User, Clock } from "lucide-react";
import { Course } from "@/api/services/courseApi";
import { Subject } from "@/api/services/subjectApi";
import { Teacher } from "@/api/services/teacherApi";

interface ScheduleEditModalProps {
  isOpen: boolean;
  courses: Course[];
  subjects: Subject[];
  teachers: Teacher[];
  teacherAvailabilities: { [key: number]: any[] };
  selectedCourse: number | '';
  selectedDay: string;
  selectedSubject: number | '';
  selectedTeacher: number | '';
  startTime: string;
  errorMessage: string;
  onClose: () => void;
  onCourseChange: (courseId: number | '') => void;
  onDayChange: (day: string) => void;
  onSubjectChange: (subjectId: number | '') => void;
  onTeacherChange: (teacherId: number | '') => void;
  onStartTimeChange: (time: string) => void;
  onUpdate: () => void;
}

export default function ScheduleEditModal({
  isOpen,
  courses,
  subjects,
  teachers,
  teacherAvailabilities,
  selectedCourse,
  selectedDay,
  selectedSubject,
  selectedTeacher,
  startTime,
  errorMessage,
  onClose,
  onCourseChange,
  onDayChange,
  onSubjectChange,
  onTeacherChange,
  onStartTimeChange,
  onUpdate,
}: ScheduleEditModalProps) {
  if (!isOpen) return null;

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  const filteredTeachers = teachers.filter(t => {
    if (!selectedSubject || t.subjectId !== selectedSubject) return false;
    if (!selectedDay) return true;
    const avails = teacherAvailabilities[t.teacherId];
    if (!avails) return false;
    return avails.some(a => a.day === selectedDay);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Editar Horario</h2>
              <p className="text-sm text-gray-600">Modifica la información del horario</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Curso */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <BookOpen className="w-4 h-4 mr-2" />
                Curso
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => onCourseChange(Number(e.target.value) || '')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
              >
                <option value="">Seleccionar Curso</option>
                {courses.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            {/* Día */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 mr-2" />
                Día
              </label>
              <select
                value={selectedDay}
                onChange={(e) => onDayChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
              >
                <option value="">Seleccionar Día</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Materia */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Book className="w-4 h-4 mr-2" />
                Materia
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  onSubjectChange(Number(e.target.value) || '');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
              >
                <option value="">Seleccionar Materia</option>
                {subjects.map((subject) => (
                  <option key={subject.subjectId} value={subject.subjectId}>
                    {subject.subjectName}
                  </option>
                ))}
              </select>
            </div>

            {/* Profesor */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <User className="w-4 h-4 mr-2" />
                Profesor
              </label>
              <select
                value={selectedTeacher}
                onChange={(e) => onTeacherChange(Number(e.target.value) || '')}
                disabled={!selectedSubject}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
              >
                <option value="">Seleccionar Profesor</option>
                {filteredTeachers.map((teacher) => (
                  <option key={teacher.teacherId} value={teacher.teacherId}>
                    {teacher.teacherName}
                  </option>
                ))}
              </select>
              {selectedTeacher && teacherAvailabilities[selectedTeacher] && selectedDay && (() => {
                const dayAvail = teacherAvailabilities[selectedTeacher].find(a => a.day === selectedDay);
                if (!dayAvail) return <p className="text-red-600 text-sm mt-1">No tiene disponibilidad en este día</p>;
                return (
                  <div className="text-red-600 text-sm mt-1">
                    Disponibilidad:
                    {dayAvail.amStart && dayAvail.amEnd && <div>AM: {dayAvail.amStart}-{dayAvail.amEnd}</div>}
                    {dayAvail.pmStart && dayAvail.pmEnd && <div>PM: {dayAvail.pmStart}-{dayAvail.pmEnd}</div>}
                  </div>
                );
              })()}
            </div>

            {/* Hora Inicio */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Clock className="w-4 h-4 mr-2" />
                Hora Inicio
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onUpdate}
            className="px-6 py-2.5 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors font-medium"
          >
            Actualizar Horario
          </button>
        </div>
      </div>
    </div>
  );
}