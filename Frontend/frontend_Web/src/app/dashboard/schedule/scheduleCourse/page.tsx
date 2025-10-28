"use client";

import { useState, useEffect } from "react";
import { FileText, FileSpreadsheet, Image } from "lucide-react";
import SearchBar from "@/components/dashboard/SearchBar";
import HeaderSchedule from "@/components/schedule/scheduleCourse/HeaderSchedule";
import ScheduleModal from "@/components/schedule/scheduleCourse/ScheduleModal";
import ScheduleGenerateModal from "@/components/schedule/scheduleCourse/ScheduleGenerateModal";
import { getAllSchedules, generateSchedule, Schedule } from "@/api/services/scheduleApi";
import { getAllCourses, Course } from "@/api/services/courseApi";
import { getUserProfile } from "@/api/services/userApi";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

const exportSchedule = async (format: 'pdf' | 'excel' | 'image', type: 'course' | 'teacher' | 'all', id?: number) => {
  let url = `http://localhost:8085/schedules/${format}`;
  if (type === 'course' && id) {
    url += `/course/${id}`;
  } else if (type === 'teacher' && id) {
    url += `/teacher/${id}`;
  } else if (type === 'all') {
    url += '/all';
    if (format === 'pdf') url += '-teachers';
    else if (format === 'excel') url += '-teachers';
    else if (format === 'image') url += '-teachers';
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error en la exportación');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `horario.${format === 'pdf' ? 'pdf' : format === 'excel' ? 'xlsx' : 'png'}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error exporting:', error);
    alert('Error al exportar');
  }
};

const generateTimes = (schedules: Schedule[]) => {
  const timeSet = new Set<string>();
  schedules.forEach(schedule => {
    timeSet.add(schedule.startTime);
  });
  // Always include break times
  timeSet.add('09:00');
  timeSet.add('12:00');
  const sortedTimes = Array.from(timeSet).sort();
  const times: string[] = [];
  sortedTimes.forEach(startTime => {
    const [hours, minutes] = startTime.split(':').map(Number);
    let endHours = hours;
    let endMinutes = minutes;
    if (startTime === '09:00') {
      // Descanso de 30 minutos
      endMinutes += 30;
    } else {
      // Clases de 1 hora
      endHours += 1;
    }
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    times.push(`${formatTime(startTime)} - ${formatTime(endTime)}`);
  });
  return times;
};

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const getScheduleForTimeAndDay = (schedules: Schedule[], time: string, day: string) => {
  const [startTimeStr] = time.split(' - ');
  const [h, m, p] = startTimeStr.split(/[: ]/);
  const hours = p === 'PM' && h !== '12' ? parseInt(h) + 12 : p === 'AM' && h === '12' ? 0 : parseInt(h);
  const scheduleTime = `${hours.toString().padStart(2, '0')}:${m}`;

  return schedules.find(s => s.startTime.startsWith(scheduleTime) && s.day === day);
};

  export default function ScheduleCoursePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [userRole, setUserRole] = useState<string>("");
    const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    // Si no hay token, redirigir al login
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserRole = async () => {
      try {
        const profile = await getUserProfile();
        setUserRole(profile.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    const fetchData = async () => {
      try {
        const [schedulesData, coursesData] = await Promise.all([
          getAllSchedules(),
          getAllCourses()
        ]);
        setSchedules(schedulesData);
        setCourses(coursesData);
        setFilteredCourses(coursesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserRole();
    fetchData();
  }, []);

  // Agrupar schedules por courseId
  const schedulesByCourse = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.courseId]) {
      acc[schedule.courseId] = [];
    }
    acc[schedule.courseId].push(schedule);
    return acc;
  }, {} as Record<number, Schedule[]>);

  const handleEditSchedule = (courseId: number) => {
    const course = courses.find(c => c.courseId === courseId);
    if (course) {
      setSelectedCourse(course);
      setIsModalOpen(true);
    }
  };

  const handleGenerateSchedule = () => {
    setIsGenerateModalOpen(true);
  };

  const handleConfirmGenerate = async (params: {
    periodStart: string;
    periodEnd: string;
    dryRun: boolean;
    force: boolean;
    params?: string;
  }) => {
    setIsGenerating(true);
    try {
      const result = await generateSchedule(params);
      alert(`Horario generado exitosamente. ${result.message || ''}`);
      // Refrescar los datos
      const [schedulesData, coursesData] = await Promise.all([
        getAllSchedules(),
        getAllCourses()
      ]);
      setSchedules(schedulesData);
      setCourses(coursesData);
    } catch (error: any) {
      console.error('Error generando horario:', error);
      alert(`Error al generar horario: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsGenerating(false);
      setIsGenerateModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleCloseGenerateModal = () => {
    setIsGenerateModalOpen(false);
  };

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.courseName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  const renderScheduleTable = (schedules: Schedule[], courseName: string, key: string) => {
    const times = generateTimes(schedules);
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    return (
      <div key={key} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{courseName}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => exportSchedule('pdf', 'course', parseInt(key))}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Exportar PDF"
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={() => exportSchedule('excel', 'course', parseInt(key))}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Exportar Excel"
            >
              <FileSpreadsheet className="w-5 h-5" />
            </button>
            <button
              onClick={() => exportSchedule('image', 'course', parseInt(key))}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Exportar Imagen"
            >
              <Image className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider min-w-32">
                  Tiempo
                </th>
                {days.map((day) => (
                  <th key={day} className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider min-w-36">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {times.map((time, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {time}
                  </td>
                  {days.map((day) => {
                    const schedule = getScheduleForTimeAndDay(schedules, time, day);
                    const isLunchTime = time === "12:00 PM - 1:00 PM";
                    const isBreak = time === "9:00 AM - 9:30 AM";
                    const content = schedule ? `${schedule.teacherName || 'Profesor'}/${schedule.subjectName || 'Materia'}` : isLunchTime ? "Almuerzo" : isBreak ? "Descanso" : "";

                    return (
                      <td
                        key={day}
                        className={`px-6 py-4 text-center text-sm ${
                          isLunchTime
                            ? 'bg-orange-100 text-orange-800 font-medium'
                            : isBreak
                              ? 'bg-yellow-100 text-yellow-800 font-medium'
                              : content && schedule
                                ? 'bg-blue-100 text-blue-800 font-medium'
                                : 'text-gray-400'
                        }`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6">
        <HeaderSchedule/>

        {/* Role-based content */}
        {userRole === "ESTUDIANTE" && (
          <>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Visualización de Horarios:</strong> Aquí puedes ver los horarios de tus cursos asignados.
                  </p>
                </div>
              </div>
            </div>

            <div className="my-6">
              <SearchBar placeholder="Buscar cursos por nombre..." onSearch={handleSearch} />
            </div>

            {/* Tabla de Horarios - Solo lectura para estudiantes */}
            <div className="my-6">
              {filteredCourses.map((course) => {
                const courseSchedules = schedulesByCourse[course.courseId] || [];
                return courseSchedules.length > 0 ? (
                  renderScheduleTable(courseSchedules, course.courseName, course.courseId.toString())
                ) : (
                  <div key={course.courseId} className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">{course.courseName}</h3>
                    <p className="text-gray-500">No hay horarios asignados para este curso.</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {(userRole === "COORDINADOR" || userRole === "DIRECTOR_DE_AREA") && (
          <>
            <div className="my-6">
              <SearchBar placeholder="Buscar cursos por nombre..." onSearch={handleSearch} />
            </div>
            {/* Tabla de Horarios con controles de edición */}
            <div className="my-6">
              {filteredCourses.map((course) => {
                const courseSchedules = schedulesByCourse[course.courseId] || [];
                return courseSchedules.length > 0 ? (
                  renderScheduleTable(courseSchedules, course.courseName, course.courseId.toString())
                ) : (
                  <div key={course.courseId} className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">{course.courseName}</h3>
                    <p className="text-gray-500">No hay horarios asignados para este curso.</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRegenerate={handleGenerateSchedule}
        courseName={selectedCourse?.courseName || ''}
      />

      <ScheduleGenerateModal
        isOpen={isGenerateModalOpen}
        onClose={handleCloseGenerateModal}
        onGenerate={handleConfirmGenerate}
        isGenerating={isGenerating}
      />
    </>
  );
}
