"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/dashboard/Header";
import TeacherCard from "@/components/dashboard/TeacherCard";
import AvailabilityModal from "@/components/professors/AvailabilityModal";
import { getAllTeachers, Teacher } from "@/api/services/teacherApi";
import { getUserProfile } from "@/api/services/userApi";
import { getSchedulesByCourse, Schedule } from "@/api/services/scheduleApi";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function DashboardPage() {
  const [teachers, setTeachers] = useState<{ name: string; stats: { materias: number; cursos: number; horas: number } }[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [currentTeacherId, setCurrentTeacherId] = useState<number | null>(null);
  const [currentTeacherName, setCurrentTeacherName] = useState<string>("");
  const [studentSchedules, setStudentSchedules] = useState<Schedule[]>([]);
  const { isAuthenticated } = useAuth();
  const { isStudent, studentCourseId, studentCourseName } = useUserProfile();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUserRole = async () => {
      try {
        const profile = await getUserProfile();
        setUserRole(profile.role);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || (userRole !== "MAESTRO" && userRole !== "COORDINADOR" && userRole !== "DIRECTOR_DE_AREA")) return;

    const fetchTeachers = async () => {
      try {
        const teachersData: Teacher[] = await getAllTeachers();

        // If user is a teacher, add themselves to the list
        let allTeachers = teachersData;
        if (userRole === "MAESTRO" && userProfile) {
          // Check if current user is already in the teachers list
          const userAlreadyInList = teachersData.some(teacher => teacher.teacherName === userProfile.name);
          if (!userAlreadyInList) {
            // Add current user as a teacher
            allTeachers = [{
              teacherId: -1, // Temporary ID for current user
              teacherName: userProfile.name,
              subjectId: 0, // Default subject ID
              availabilitySummary: "Pendiente de configurar"
            }, ...teachersData];
          }
        }

        // TODO: Obtener stats reales desde la API cuando esté disponible
        const mappedTeachers = allTeachers.map((teacher) => ({
          name: teacher.teacherName,
          stats: { materias: 1, cursos: 1, horas: 25 }, // Temporal: implementar API de stats
        }));
        setTeachers(mappedTeachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, [isAuthenticated, userRole, userProfile]);

  useEffect(() => {
    if (!isAuthenticated || !isStudent || !studentCourseId) return;

    const fetchStudentSchedules = async () => {
      try {
        const schedules = await getSchedulesByCourse(studentCourseId);
        setStudentSchedules(schedules);
      } catch (error) {
        console.error("Error fetching student schedules:", error);
      }
    };

    fetchStudentSchedules();
  }, [isAuthenticated, isStudent, studentCourseId]);

  const handleOpenAvailabilityModal = (teacherId: number, teacherName: string) => {
    setCurrentTeacherId(teacherId);
    setCurrentTeacherName(teacherName);
    setShowAvailabilityModal(true);
  };

  const handleCloseAvailabilityModal = () => {
    setShowAvailabilityModal(false);
    setCurrentTeacherId(null);
    setCurrentTeacherName("");
  };

  const handleAvailabilityUpdated = (teacherId: number, availabilityDays: string) => {
    // Update teacher availability in the list if needed
    console.log(`Updated availability for teacher ${teacherId}: ${availabilityDays}`);
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

  const renderStudentScheduleTable = () => {
    const times = generateTimes(studentSchedules);
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 bg-gray-50 border-b border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900">Mi Horario - {studentCourseName}</h3>
        </motion.div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider min-w-32">
                  Tiempo
                </th>
                {days.map((day, index) => (
                  <motion.th
                    key={day}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider min-w-36"
                  >
                    {day}
                  </motion.th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {times.map((time, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {time}
                  </td>
                  {days.map((day) => {
                    const schedule = getScheduleForTimeAndDay(studentSchedules, time, day);
                    const isLunchTime = time === "12:00 PM - 1:00 PM";
                    const isBreak = time === "9:00 AM - 9:30 AM";
                    const content = schedule ? `${schedule.teacherName || 'Profesor'}/${schedule.subjectName || 'Materia'}` : isLunchTime ? "Almuerzo" : isBreak ? "Descanso" : "";

                    return (
                      <motion.td
                        key={day}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
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
                      </motion.td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 p-6 bg-gray-50"
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <Header />
        </motion.div>

        {/* Role-based content */}
        {userRole === "MAESTRO" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.4
                }
              }
            }}
          >
            {/* Mandatory Availability Notice */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Importante:</strong> Debe configurar su disponibilidad horaria antes de continuar usando el sistema.
                    Haga clic en "Configurar Disponibilidad" en cualquier profesor para comenzar.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Cards Profesores */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6"
            >
              {teachers.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                >
                  <TeacherCard
                    name={t.name}
                    onConfigureAvailability={() => handleOpenAvailabilityModal(
                      t.name === userProfile?.name ? -1 : i + 1,
                      t.name
                    )}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {userRole === "ESTUDIANTE" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="my-6"
          >
            {studentSchedules.length > 0 ? (
              renderStudentScheduleTable()
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Horarios</h2>
                <p className="text-sm text-gray-600">No hay horarios asignados para tu curso actualmente.</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {(userRole === "COORDINADOR" || userRole === "DIRECTOR_DE_AREA") && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.3,
                  delayChildren: 0.6
                }
              }
            }}
          >
            {/* Cards Profesores */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6"
            >
              {teachers.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                >
                  <TeacherCard name={t.name} />
                </motion.div>
              ))}
            </motion.div>

            {/* Reportes */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Generales</h3>
                <p className="text-sm text-gray-600">Panel de estadísticas del sistema.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes</h3>
                <p className="text-sm text-gray-600">Generación de reportes del sistema.</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Reportes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        </div>
      </motion.div>

      {/* Availability Modal for Teachers */}
      {showAvailabilityModal && currentTeacherId && (
        <AvailabilityModal
          isOpen={showAvailabilityModal}
          onClose={handleCloseAvailabilityModal}
          teacherId={currentTeacherId}
          teacherName={currentTeacherName}
          onAvailabilityUpdated={handleAvailabilityUpdated}
        />
      )}
    </>
  );
}
