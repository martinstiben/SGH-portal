"use client";

import { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import TeacherCard from "@/components/dashboard/TeacherCard";
import AvailabilityModal from "@/components/professors/AvailabilityModal";
import { getAllTeachers, Teacher } from "@/api/services/teacherApi";
import { getUserProfile } from "@/api/services/userApi";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const [teachers, setTeachers] = useState<{ name: string; stats: { materias: number; cursos: number; horas: number } }[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [currentTeacherId, setCurrentTeacherId] = useState<number | null>(null);
  const [currentTeacherName, setCurrentTeacherName] = useState<string>("");
  const { isAuthenticated } = useAuth();

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

  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-50">
        <Header />

        {/* Role-based content */}
        {userRole === "MAESTRO" && (
          <>
            {/* Mandatory Availability Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
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
            </div>

            {/* Cards Profesores */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
              {teachers.map((t, i) => (
                <TeacherCard
                  key={i}
                  name={t.name}
                  onConfigureAvailability={() => handleOpenAvailabilityModal(
                    t.name === userProfile?.name ? -1 : i + 1,
                    t.name
                  )}
                />
              ))}
            </div>
          </>
        )}

        {userRole === "ESTUDIANTE" && (
          <div className="bg-white p-6 rounded-xl shadow my-6">
            <h2 className="text-xl font-semibold mb-4">Mis Horarios</h2>
            <p className="text-gray-600">Aquí podrás ver tus horarios de clases asignados.</p>
            {/* TODO: Implement schedule viewing component */}
          </div>
        )}

        {(userRole === "COORDINADOR" || userRole === "DIRECTOR_DE_AREA") && (
          <>
            {/* Cards Profesores */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
              {teachers.map((t, i) => (
                <TeacherCard key={i} name={t.name} />
              ))}
            </div>

            {/* Reportes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-4">Estadísticas Generales</h3>
                <p className="text-gray-600">Panel de estadísticas del sistema.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-4">Reportes</h3>
                <p className="text-gray-600">Generación de reportes del sistema.</p>
              </div>
            </div>
          </>
        )}

        {/* Reportes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        </div>
      </div>

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
