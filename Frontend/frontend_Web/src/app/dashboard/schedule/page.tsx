"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, FileSpreadsheet, Image } from "lucide-react";
import HeaderSchedule from "@/components/schedule/scheduleCourse/HeaderSchedule";
import ScheduleConfirmModal from "@/components/schedule/ScheduleConfirmModal";
import ScheduleEditModal from "@/components/schedule/ScheduleEditModal";
import ScheduleViewSection from "@/components/schedule/ScheduleViewSection";
import ScheduleTable from "@/components/schedule/ScheduleTable";
import { Schedule, createSchedule, getSchedulesByCourse, getAllSchedules, updateSchedule, deleteSchedule } from "@/api/services/scheduleApi";
import { getAllCourses, Course } from "@/api/services/courseApi";
import { getAllSubjects, Subject } from "@/api/services/subjectApi";
import { getAllTeachers, Teacher, getTeacherAvailability } from "@/api/services/teacherApi";
import { useUserProfile } from "@/hooks/useUserProfile";
import Cookies from 'js-cookie';
import { config } from "@/config/env";

const calculateEndTime = (startTime: string): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endHours = hours + 1;
  const endMinutes = minutes;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

const exportSchedule = async (format: 'pdf' | 'excel' | 'image', type: 'course' | 'teacher' | 'all' | 'all-teachers', id?: number) => {
  let url = `${config.apiBaseUrl}/schedules`;
  if (type === 'course' && id) {
    url += `/${format}/course/${id}`;
  } else if (type === 'teacher' && id) {
    url += `/${format}/teacher/${id}`;
  } else if (type === 'all') {
    if (format === 'pdf') {
      url += '/pdf/all';
    } else if (format === 'excel') {
      url += '/excel/all';
    } else if (format === 'image') {
      url += '/image/all';
    }
  } else if (type === 'all-teachers') {
    if (format === 'pdf') {
      url += '/pdf/all-teachers';
    } else if (format === 'excel') {
      url += '/excel/all-teachers';
    } else if (format === 'image') {
      url += '/image/all-teachers';
    }
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

export default function SchedulePage() {
  const router = useRouter();
  const { isStudent, studentCourseId, studentCourseName } = useUserProfile();

  // Estados para formulario manual
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [teacherAvailabilities, setTeacherAvailabilities] = useState<{ [key: number]: any[] }>({});
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<number | ''>('');
  const [selectedTeacher, setSelectedTeacher] = useState<number | ''>('');
  const [startTime, setStartTime] = useState<string>('');
  const [courseSchedules, setCourseSchedules] = useState<Schedule[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);


  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  useEffect(() => {
    const token = Cookies.get('token');

    // Si no hay token, redirigir al login
    if (!token) {
      router.push("/login");
      return;
    }

    // Si es estudiante, cargar automáticamente su horario de curso
    if (isStudent && studentCourseId) {
      loadCourseSchedules(studentCourseId);
      setSelectedCourse(studentCourseId);
    }
  }, [isStudent, studentCourseId]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, subjectsData, teachersData, schedulesData] = await Promise.all([
          getAllCourses(),
          getAllSubjects(),
          getAllTeachers(),
          getAllSchedules()
        ]);
        setCourses(coursesData);
        setSubjects(subjectsData);
        setTeachers(teachersData);
        setAllSchedules(schedulesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [isStudent]);

  useEffect(() => {
    if (selectedSubject) {
      const teachersForSubject = teachers.filter(t => t.subjectId === selectedSubject);
      const loadAvailabilities = async () => {
        const availabilities: { [key: number]: any[] } = {};
        for (const teacher of teachersForSubject) {
          try {
            const avails = await getTeacherAvailability(teacher.teacherId);
            availabilities[teacher.teacherId] = avails;
          } catch (error) {
            console.error(`Error loading availability for teacher ${teacher.teacherId}:`, error);
          }
        }
        setTeacherAvailabilities(availabilities);
      };
      loadAvailabilities();
    } else {
      setTeacherAvailabilities({});
    }
  }, [selectedSubject, teachers]);

  const loadCourseSchedules = async (courseId: number) => {
    try {
      const data = await getSchedulesByCourse(courseId);
      setCourseSchedules(data);
    } catch (error) {
      console.error("Error loading course schedules:", error);
    }
  };



  const clearForm = () => {
    setSelectedCourse('');
    setSelectedDay('');
    setSelectedSubject('');
    setSelectedTeacher('');
    setStartTime('');
  };

  const addToSchedule = async () => {
    setErrorMessage('');
    if (!selectedCourse || !selectedDay || !selectedSubject || !selectedTeacher || !startTime) {
      setErrorMessage('Por favor complete todos los campos');
      return;
    }

    const endTime = calculateEndTime(startTime);

    // Validar que no se programe durante los descansos
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]);

    // Convertir a minutos desde medianoche para facilitar comparación
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // Descanso de 9:00 AM (30 minutos)
    const breakStart = 9 * 60; // 9:00 AM
    const breakEnd = 9 * 60 + 30; // 9:30 AM

    // Almuerzo de 12:00 PM (1 hora)
    const lunchStart = 12 * 60; // 12:00 PM
    const lunchEnd = 13 * 60; // 1:00 PM

    // Verificar si el horario se solapa con el descanso
    if ((startMinutes < breakEnd && endMinutes > breakStart) ||
        (startMinutes < lunchEnd && endMinutes > lunchStart)) {
      setErrorMessage('No se puede programar clases durante los tiempos de descanso (9:00-9:30 AM) o almuerzo (12:00-1:00 PM)');
      return;
    }

    const course = courses.find(c => c.courseId === selectedCourse);
    const subject = subjects.find(s => s.subjectId === selectedSubject);
    const teacher = teachers.find(t => t.teacherId === selectedTeacher);
    if (!course || !subject || !teacher) return;

    // Validar disponibilidad del profesor
    const availabilities = await getTeacherAvailability(selectedTeacher);
    const dayAvailability = availabilities.find(a => a.day === selectedDay);
    if (!dayAvailability) {
      setErrorMessage('Este maestro no tiene disponibilidad en ese día');
      return;
    }
    const inAM = dayAvailability.amStart && dayAvailability.amEnd && startTime >= dayAvailability.amStart && endTime <= dayAvailability.amEnd;
    const inPM = dayAvailability.pmStart && dayAvailability.pmEnd && startTime >= dayAvailability.pmStart && endTime <= dayAvailability.pmEnd;
    if (!inAM && !inPM) {
      setErrorMessage('Este maestro no tiene disponibilidad en ese horario');
      return;
    }

    // Validar que no haya conflictos en el mismo curso
    const courseSchedulesOnDay = allSchedules.filter(s => s.courseId === selectedCourse && s.day === selectedDay);
    const newStartMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const newEndMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
    for (const existing of courseSchedulesOnDay) {
      const existingStart = parseInt(existing.startTime.split(':')[0]) * 60 + parseInt(existing.startTime.split(':')[1]);
      const existingEnd = parseInt(existing.endTime.split(':')[0]) * 60 + parseInt(existing.endTime.split(':')[1]);
      if (newStartMinutes < existingEnd && existingStart < newEndMinutes) {
        setErrorMessage('Ese bloque de tiempo ya está ocupado en este curso.');
        return;
      }
    }

    // Validar que el profesor no tenga conflictos de horario en el mismo día
    const teacherSchedulesOnDay = allSchedules.filter(s => s.teacherId === selectedTeacher && s.day === selectedDay);
    for (const existing of teacherSchedulesOnDay) {
      const existingStart = parseInt(existing.startTime.split(':')[0]) * 60 + parseInt(existing.startTime.split(':')[1]);
      const existingEnd = parseInt(existing.endTime.split(':')[0]) * 60 + parseInt(existing.endTime.split(':')[1]);
      if (newStartMinutes < existingEnd && existingStart < newEndMinutes) {
        setErrorMessage('Este maestro ya tiene ocupado ese bloque de tiempo en otro curso.');
        return;
      }
    }


    const newEntry: Omit<Schedule, 'id'> = {
      courseId: selectedCourse,
      teacherId: selectedTeacher,
      subjectId: selectedSubject,
      day: selectedDay,
      startTime,
      endTime,
      scheduleName: `${course.courseName} - ${subject.subjectName}`,
      teacherName: teacher.teacherName,
      subjectName: subject.subjectName,
    };

    try {
      await createSchedule(newEntry);
      const updatedSchedules = await getAllSchedules();
      setAllSchedules(updatedSchedules);
      await loadCourseSchedules(selectedCourse);
      clearForm();
    } catch (error) {
      console.error("Error creating schedule:", error);
      setErrorMessage("Error al crear el horario");
    }
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setSelectedCourse(schedule.courseId);
    setSelectedDay(schedule.day);
    setSelectedSubject(schedule.subjectId || '');
    setSelectedTeacher(schedule.teacherId || '');
    setStartTime(schedule.startTime);
    setIsEditModalOpen(true);
  };

  const handleUpdateSchedule = async () => {
    if (!editingSchedule) return;
    setErrorMessage('');
    setSuccessMessage('');
    if (!selectedCourse || !selectedDay || !selectedSubject || !selectedTeacher || !startTime) {
      setErrorMessage('Por favor complete todos los campos');
      return;
    }

    const endTime = calculateEndTime(startTime);

    // Validar que no se programe durante los descansos
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    const breakStart = 9 * 60;
    const breakEnd = 9 * 60 + 30;
    const lunchStart = 12 * 60;
    const lunchEnd = 13 * 60;

    if ((startMinutes < breakEnd && endMinutes > breakStart) ||
        (startMinutes < lunchEnd && endMinutes > lunchStart)) {
      setErrorMessage('No se puede programar clases durante los tiempos de descanso (9:00-9:30 AM) o almuerzo (12:00-1:00 PM)');
      return;
    }


    const course = courses.find(c => c.courseId === selectedCourse);
    const subject = subjects.find(s => s.subjectId === selectedSubject);
    const teacher = teachers.find(t => t.teacherId === selectedTeacher);
    if (!course || !subject || !teacher) return;

    const availabilities = await getTeacherAvailability(selectedTeacher);
    const dayAvailability = availabilities.find(a => a.day === selectedDay);
    if (!dayAvailability) {
      setErrorMessage('Este maestro no tiene disponibilidad en ese día');
      return;
    }
    const inAM = dayAvailability.amStart && dayAvailability.amEnd && startTime >= dayAvailability.amStart && endTime <= dayAvailability.amEnd;
    const inPM = dayAvailability.pmStart && dayAvailability.pmEnd && startTime >= dayAvailability.pmStart && endTime <= dayAvailability.pmEnd;
    if (!inAM && !inPM) {
      setErrorMessage('Este maestro no tiene disponibilidad en ese horario');
      return;
    }

    const courseSchedulesOnDay = allSchedules.filter(s => s.courseId === selectedCourse && s.day === selectedDay && s.id !== editingSchedule.id);
    const newStartMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const newEndMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
    for (const existing of courseSchedulesOnDay) {
      const existingStart = parseInt(existing.startTime.split(':')[0]) * 60 + parseInt(existing.startTime.split(':')[1]);
      const existingEnd = parseInt(existing.endTime.split(':')[0]) * 60 + parseInt(existing.endTime.split(':')[1]);
      if (newStartMinutes < existingEnd && existingStart < newEndMinutes) {
        setErrorMessage('Ese bloque de tiempo ya está ocupado en este curso.');
        return;
      }
    }

    const teacherSchedulesOnDay = allSchedules.filter(s => s.teacherId === selectedTeacher && s.day === selectedDay && s.id !== editingSchedule.id);
    for (const existing of teacherSchedulesOnDay) {
      const existingStart = parseInt(existing.startTime.split(':')[0]) * 60 + parseInt(existing.startTime.split(':')[1]);
      const existingEnd = parseInt(existing.endTime.split(':')[0]) * 60 + parseInt(existing.endTime.split(':')[1]);
      if (newStartMinutes < existingEnd && existingStart < newEndMinutes) {
        setErrorMessage('Este maestro ya tiene ocupado ese bloque de tiempo en otro curso.');
        return;
      }
    }

    const updatedSchedule: Schedule = {
      ...editingSchedule,
      courseId: selectedCourse,
      teacherId: selectedTeacher,
      subjectId: selectedSubject,
      day: selectedDay,
      startTime,
      endTime,
      scheduleName: `${course.courseName} - ${subject.subjectName}`,
      teacherName: teacher.teacherName,
      subjectName: subject.subjectName,
    };

    try {
      console.log("Updating schedule:", editingSchedule.id, updatedSchedule);
      await updateSchedule(editingSchedule.id, updatedSchedule);
      const updatedSchedules = await getAllSchedules();
      setAllSchedules(updatedSchedules);
      await loadCourseSchedules(selectedCourse);
      setIsEditModalOpen(false);
      setEditingSchedule(null);
      clearForm();
      setSuccessMessage('Horario actualizado correctamente');
    } catch (error: any) {
      console.error("Error updating schedule:", error);
      setErrorMessage(error.message || "Error al actualizar el horario");
      setSuccessMessage('');
    }
  };

  const handleDeleteSchedule = (schedule: Schedule) => {
    setScheduleToDelete(schedule);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (scheduleToDelete) {
      try {
        setErrorMessage('');
        setSuccessMessage('');
        await deleteSchedule(scheduleToDelete.id);
        const updatedSchedules = await getAllSchedules();
        setAllSchedules(updatedSchedules);
        await loadCourseSchedules(scheduleToDelete.courseId);
        setSuccessMessage('Horario eliminado correctamente');
      } catch (error: any) {
        console.error("Error deleting schedule:", error);
        setErrorMessage(error.message || "Error al eliminar el horario");
        setSuccessMessage('');
      }
    }
    setIsConfirmModalOpen(false);
    setScheduleToDelete(null);
  };

  const filteredTeachers = selectedSubject ? teachers.filter(t => t.subjectId === selectedSubject) : [];

  // Si es estudiante, mostrar vista simplificada
  if (isStudent) {
    return (
      <>
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">📅</span>
              Mi Horario de Clases
            </h1>
            <p className="text-gray-600 mt-2">
              Horario del curso: <span className="font-semibold text-blue-600">{studentCourseName}</span>
            </p>
          </div>

          {/* Mostrar Horario del Curso del Estudiante */}
          {studentCourseId && (
            <div className="my-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="mr-2">📋</span>
                    Horario del Curso
                  </h2>
                </div>
                <ScheduleTable
                  schedules={courseSchedules}
                  courseId={studentCourseId}
                  courses={courses}
                  onEdit={() => {}} // Deshabilitado para estudiantes
                  onDelete={() => {}} // Deshabilitado para estudiantes
                  readOnly={true}
                />
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>

      <ScheduleConfirmModal
        isOpen={isConfirmModalOpen}
        scheduleToDelete={scheduleToDelete}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 p-6"
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <HeaderSchedule />
        </motion.div>

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
          {errorMessage && (
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -30, scale: 0.95 },
                visible: { opacity: 1, x: 0, scale: 1 }
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="my-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{errorMessage}</span>
              <button
                onClick={() => setErrorMessage('')}
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                <span className="text-red-500">×</span>
              </button>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 30, scale: 0.95 },
                visible: { opacity: 1, x: 0, scale: 1 }
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="my-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{successMessage}</span>
              <button
                onClick={() => setSuccessMessage('')}
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                <span className="text-green-500">×</span>
              </button>
            </motion.div>
          )}
        </motion.div>




        {/* Reportes */}
        <div className="my-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
              <span className="mr-2">📤</span>
              Exportar Horarios
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="group flex flex-col items-center p-6 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 cursor-pointer border border-red-200 hover:border-red-300 hover:shadow-lg hover:-translate-y-1" onClick={() => exportSchedule('pdf', 'all')}>
                <div className="p-3 bg-red-500 rounded-full mb-3 group-hover:bg-red-600 transition-colors">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900 mb-1">PDF</span>
                <span className="text-xs text-gray-600">Profesores</span>
              </div>
              <div className="group flex flex-col items-center p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-300 cursor-pointer border border-green-200 hover:border-green-300 hover:shadow-lg hover:-translate-y-1" onClick={() => exportSchedule('excel', 'all')}>
                <div className="p-3 bg-green-500 rounded-full mb-3 group-hover:bg-green-600 transition-colors">
                  <FileSpreadsheet className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900 mb-1">Excel</span>
                <span className="text-xs text-gray-600">Profesores</span>
              </div>
              <div className="group flex flex-col items-center p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 cursor-pointer border border-blue-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1" onClick={() => exportSchedule('image', 'all')}>
                <div className="p-3 bg-blue-500 rounded-full mb-3 group-hover:bg-blue-600 transition-colors">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900 mb-1">Imagen</span>
                <span className="text-xs text-gray-600">Horarios</span>
              </div>
              <div className="group flex flex-col items-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300 cursor-pointer border border-purple-200 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1" onClick={() => exportSchedule('image', 'all-teachers')}>
                <div className="p-3 bg-purple-500 rounded-full mb-3 group-hover:bg-purple-600 transition-colors">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900 mb-1">Imagen</span>
                <span className="text-xs text-gray-600">Profesores</span>
              </div>
            </div>
          </div>

          {/* Asignar Horario Manual */}
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
                      setSelectedCourse(courseId);
                      if (courseId) loadCourseSchedules(courseId);
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
                    onChange={(e) => setSelectedDay(e.target.value)}
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
                      setSelectedSubject(Number(e.target.value) || '');
                      setSelectedTeacher('');
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
                    onChange={(e) => setSelectedTeacher(Number(e.target.value) || '')}
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
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm transition-all duration-200"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={clearForm}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  🗑️ Vaciar contenido
                </button>
                <button
                  onClick={addToSchedule}
                  className="px-6 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  ➕ Añadir al horario
                </button>
              </div>
            </div>


          <ScheduleEditModal
            isOpen={isEditModalOpen}
            courses={courses}
            subjects={subjects}
            teachers={teachers}
            teacherAvailabilities={teacherAvailabilities}
            selectedCourse={selectedCourse}
            selectedDay={selectedDay}
            selectedSubject={selectedSubject}
            selectedTeacher={selectedTeacher}
            startTime={startTime}
            errorMessage={errorMessage}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingSchedule(null);
              clearForm();
            }}
            onCourseChange={setSelectedCourse}
            onDayChange={setSelectedDay}
            onSubjectChange={(subjectId) => {
              setSelectedSubject(subjectId);
              setSelectedTeacher('');
            }}
            onTeacherChange={setSelectedTeacher}
            onStartTimeChange={setStartTime}
            onUpdate={handleUpdateSchedule}
          />

          <ScheduleViewSection
            courses={courses}
            selectedCourse={selectedCourse}
            onCourseChange={(courseId) => {
              setSelectedCourse(courseId);
              if (courseId) loadCourseSchedules(courseId);
            }}
          />


          {/* Mostrar Horario del Curso */}
          {selectedCourse && (
            <div className="my-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="mr-2">📋</span>
                    Horario del Curso
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push('/dashboard/schedule/scheduleCourse')}
                      className="px-6 py-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
                    >
                      💾 Guardar Horario
                    </button>
                  </div>
                </div>
                <ScheduleTable
                  schedules={courseSchedules}
                  courseId={selectedCourse ? Number(selectedCourse) : undefined}
                  courses={courses}
                  onEdit={handleEditSchedule}
                  onDelete={handleDeleteSchedule}
                />
              </div>
            </div>
          )}

           </div>
         </div>
       </motion.div>
     </>
   );
 }
