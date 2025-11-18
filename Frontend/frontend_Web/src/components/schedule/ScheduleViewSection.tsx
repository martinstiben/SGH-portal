import { Course } from "@/api/services/courseApi";

interface ScheduleViewSectionProps {
  courses: Course[];
  selectedCourse: number | '';
  onCourseChange: (courseId: number | '') => void;
}

export default function ScheduleViewSection({
  courses,
  selectedCourse,
  onCourseChange,
}: ScheduleViewSectionProps) {
  return (
    <div className="my-6">
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
          <span className="mr-2">📅</span>
          Ver Horario de Curso
        </h3>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Curso</label>
          <select
            value={selectedCourse || ''}
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
      </div>
    </div>
  );
}