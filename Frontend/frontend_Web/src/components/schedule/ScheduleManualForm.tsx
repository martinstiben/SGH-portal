import { Course } from "@/api/services/courseApi";
import { Subject } from "@/api/services/subjectApi";
import { Teacher } from "@/api/services/teacherApi";

interface ScheduleManualFormProps {
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
  onCourseChange: (courseId: number | '') => void;
  onDayChange: (day: string) => void;
  onSubjectChange: (subjectId: number | '') => void;
  onTeacherChange: (teacherId: number | '') => void;
  onStartTimeChange: (time: string) => void;
  onClearForm: () => void;
  onAddToSchedule: () => void;
}

export default function ScheduleManualForm({
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
  onCourseChange,
  onDayChange,
  onSubjectChange,
  onTeacherChange,
  onStartTimeChange,
  onClearForm,
  onAddToSchedule,
}: ScheduleManualFormProps) {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  const filteredTeachers = teachers.filter(t => {
    if (!selectedSubject || t.subjectId !== selectedSubject) return false;
    if (!selectedDay) return true;
    const avails = teacherAvailabilities[t.teacherId];
    if (!avails) return false;
    return avails.some(a => a.day === selectedDay);
  });

  return (
    <div className="my-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
          <span className="mr-2">✏️</span>
          Asignar Horario Manual
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Curso</label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                const courseId = Number(e.target.value) || '';
                onCourseChange(courseId);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm transition-all duration-200"
            >
              <option value="">Seleccionar Curso</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Día</label>
            <select
              value={selectedDay}
              onChange={(e) => onDayChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm transition-all duration-200"
            >
              <option value="">Seleccionar Día</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Materia</label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                onSubjectChange(Number(e.target.value) || '');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm transition-all duration-200"
            >
              <option value="">Seleccionar Materia</option>
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Profesor asociado a la materia</label>
            <select
              value={selectedTeacher}
              onChange={(e) => onTeacherChange(Number(e.target.value) || '')}
              disabled={!selectedSubject}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hora Inicio</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm transition-all duration-200"
            />
          </div>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={onClearForm}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            🗑️ Vaciar contenido
          </button>
          <button
            onClick={onAddToSchedule}
            className="px-6 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            ➕ Añadir al horario
          </button>
        </div>
      </div>
    </div>
  );
}