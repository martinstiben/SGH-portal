import React from 'react';
import { Schedule } from '@/api/services/scheduleApi';
import { Teacher } from '@/api/services/teacherApi';
import { Course } from '@/api/services/courseApi';

interface ProfessorScheduleTableProps {
  schedules: Schedule[];
  teachers: Teacher[];
  courses: Course[];
}

const ProfessorScheduleTable: React.FC<ProfessorScheduleTableProps> = ({ schedules, teachers, courses }) => {
  const courseMap = courses.reduce((acc, course) => {
    acc[course.courseId] = course;
    return acc;
  }, {} as Record<number, Course>);

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

  // Agrupar schedules por teacherId
  const schedulesByTeacher = schedules.reduce((acc, schedule) => {
    if (schedule.teacherId && !acc[schedule.teacherId]) {
      acc[schedule.teacherId] = [];
    }
    if (schedule.teacherId) {
      acc[schedule.teacherId].push(schedule);
    }
    return acc;
  }, {} as Record<number, Schedule[]>);

  const renderScheduleTable = (schedules: Schedule[], teacherName: string, key: string) => {
    const times = generateTimes(schedules);
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    return (
      <div key={key} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gray-100 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{teacherName}</h3>
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
                    const content = schedule ? `${courseMap[schedule.courseId]?.courseName || 'Curso'}/${schedule.subjectName || 'Materia'}` : isLunchTime ? "Almuerzo" : isBreak ? "Descanso" : "";

                    return (
                      <td
                        key={day}
                        className={`px-6 py-4 text-center text-sm ${
                          isLunchTime
                            ? 'bg-orange-100 text-orange-800 font-medium'
                            : isBreak
                              ? 'bg-yellow-100 text-yellow-800 font-medium'
                              : content
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
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-5 h-5 border-2 border-gray-600 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-bold text-lg leading-none">+</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Horarios de Profesores</h1>
        </div>

        {teachers.map((teacher) => {
          const teacherSchedules = schedulesByTeacher[teacher.teacherId] || [];
          return teacherSchedules.length > 0 ? (
            renderScheduleTable(teacherSchedules, teacher.teacherName, teacher.teacherId.toString())
          ) : (
            <div key={teacher.teacherId} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800">{teacher.teacherName}</h3>
              <p className="text-gray-500">No hay horarios asignados para este profesor.</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfessorScheduleTable;