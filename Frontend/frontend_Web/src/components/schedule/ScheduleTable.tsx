import { Edit, Trash2 } from "lucide-react";
import { Schedule } from "@/api/services/scheduleApi";
import { Course } from "@/api/services/courseApi";

interface ScheduleTableProps {
  schedules: Schedule[];
  courseId?: number;
  courses: Course[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
  readOnly?: boolean;
}

export default function ScheduleTable({
  schedules,
  courseId,
  courses,
  onEdit,
  onDelete,
  readOnly = false,
}: ScheduleTableProps) {
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

  const renderScheduleTable = (schedules: Schedule[], courseId?: number) => {
    const times = generateTimes(schedules);
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const course = courseId ? courses.find(c => c.courseId === courseId) : null;
    const courseName = course ? course.courseName : 'Curso';

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Horario del {courseName}</h3>
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
                    const isLunch = time === "12:00 PM - 1:00 PM";
                    const isBreak = time === "9:00 AM - 9:30 AM";
                    const content = schedule ? `${schedule.teacherName || 'Profesor'}/${schedule.subjectName || 'Materia'}` : isLunch ? "Almuerzo" : isBreak ? "Descanso" : "";

                    return (
                      <td
                        key={day}
                        className={`px-6 py-4 text-center text-sm relative group ${
                          isLunch
                            ? 'bg-orange-100 text-orange-800 font-medium'
                            : isBreak
                              ? 'bg-yellow-100 text-yellow-800 font-medium'
                              : content
                                ? 'bg-blue-100 text-blue-800 font-medium'
                                : 'text-gray-400'
                        }`}
                      >
                        <div className="relative">
                          <div className={`${readOnly ? '' : 'group-hover:opacity-0'} transition-opacity duration-200`}>
                            {content}
                          </div>
                          {schedule && !readOnly && (
                            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() => onEdit(schedule)}
                                className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Editar
                              </button>
                              <button
                                onClick={() => onDelete(schedule)}
                                className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 transition-colors"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
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

  return renderScheduleTable(schedules, courseId);
}