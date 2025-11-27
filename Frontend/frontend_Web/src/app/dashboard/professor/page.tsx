"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderProfessor from "@/components/professors/HeaderProfessor";
import ProfessorTable from "@/components/professors/ProfessorTable";
import ProfessorModal from "@/components/professors/ProfessorModal";
import AvailabilityModal from "@/components/professors/AvailabilityModal";
import SearchBar from "@/components/dashboard/SearchBar";
import { getAllTeachers, createTeacher, updateTeacher, deleteTeacher, Teacher } from "@/api/services/teacherApi";
import { getAllSubjects, Subject } from "@/api/services/subjectApi";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

interface TeacherWithSubject extends Teacher {
  subjectName?: string;
  availabilitySummary?: string;
}

export default function ProfessorPage() {
  const [teachers, setTeachers] = useState<TeacherWithSubject[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherWithSubject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherWithSubject | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<number | null>(null);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [selectedTeacherForAvailability, setSelectedTeacherForAvailability] = useState<TeacherWithSubject | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    // Si no hay token, redirigir al login
    if (!token) {
      router.push("/login");
      return;
    }

    fetchData();
  }, []);

  useEffect(() => {
    handleSearch(''); // Initialize with all professors when data loads
  }, [teachers]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teachersData, subjectsData] = await Promise.all([
        getAllTeachers(),
        getAllSubjects()
      ]);

      // Add subject names to teachers
      const teachersWithSubject = teachersData.map((teacher) => {
        const subject = subjectsData.find(s => s.subjectId === teacher.subjectId);
        return {
          ...teacher,
          subjectName: subject?.subjectName,
          availabilitySummary: teacher.availabilitySummary
        };
      });

      setTeachers(teachersWithSubject);
      setFilteredTeachers(teachersWithSubject);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfessor = () => {
    setEditingTeacher(null);
    setIsModalOpen(true);
  };

  const handleSaveTeacher = async (teacherData: Omit<Teacher, 'teacherId'>) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      if (editingTeacher) {
        // Editar profesor existente
        await updateTeacher(editingTeacher.teacherId, {
          teacherName: teacherData.teacherName,
          subjectId: teacherData.subjectId
        });
        setSuccessMessage('Profesor actualizado correctamente');
      } else {
        // Agregar nuevo profesor
        await createTeacher({
          teacherName: teacherData.teacherName,
          subjectId: teacherData.subjectId
        });
        setSuccessMessage('Profesor creado correctamente');
      }
      await fetchData(); // Refetch data including availability
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving teacher:", error);
      setErrorMessage(error.message || 'Error al guardar el profesor');
      setSuccessMessage('');
      throw error; // Re-throw to let modal handle it
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
  };

  const handleViewAvailability = (teacher: TeacherWithSubject) => {
    setSelectedTeacherForAvailability(teacher);
    setIsAvailabilityModalOpen(true);
  };

  const handleCloseAvailabilityModal = () => {
    setIsAvailabilityModalOpen(false);
    setSelectedTeacherForAvailability(null);
  };

  const handleEditTeacher = (teacher: TeacherWithSubject) => {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDeleteTeacher = (id: number) => {
    setTeacherToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (teacherToDelete) {
      try {
        setErrorMessage('');
        setSuccessMessage('');
        await deleteTeacher(teacherToDelete);
        setSuccessMessage('Profesor eliminado correctamente');
        await fetchData(); // Refetch data including availability
      } catch (error: any) {
        console.error("Error deleting teacher:", error);
        setErrorMessage(error.message || 'Error al eliminar el profesor');
        setSuccessMessage('');
      }
    }
    setIsConfirmModalOpen(false);
    setTeacherToDelete(null);
  };

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setFilteredTeachers(teachers);
    } else {
      const filteredTeachers = teachers.filter(teacher =>
        teacher.teacherName.toLowerCase().includes(query.toLowerCase()) ||
        (teacher.subjectName && teacher.subjectName.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredTeachers(filteredTeachers);
    }
  };

  return (
    <>
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
          <HeaderProfessor onAddProfessor={handleAddProfessor} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="my-6"
        >
          <SearchBar placeholder="Buscar profesores por nombre, materia o especialidad..." onSearch={handleSearch} />
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
                delayChildren: 0.6
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
              className="my-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
            >
              {errorMessage}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 30, scale: 0.95 },
                visible: { opacity: 1, x: 0, scale: 1 }
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="my-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded"
            >
              {successMessage}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
          className="my-6"
        >
          <ProfessorTable
            teachers={filteredTeachers}
            onEdit={handleEditTeacher}
            onDelete={handleDeleteTeacher}
            onViewAvailability={handleViewAvailability}
          />
        </motion.div>
      </motion.div>

      {/* Modals */}
      <ProfessorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTeacher}
        teacher={editingTeacher}
      />

      <AvailabilityModal
        isOpen={isAvailabilityModalOpen}
        onClose={handleCloseAvailabilityModal}
        teacher={selectedTeacherForAvailability}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsConfirmModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-200" onClick={(e) => e.stopPropagation()}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Eliminar Profesor</h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    ¿Estás seguro de que deseas eliminar al profesor <span className="font-semibold text-gray-900">"{teachers.find(t => t.teacherId === teacherToDelete)?.teacherName}"</span>?
                    Esta acción no se puede deshacer.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setIsConfirmModalOpen(false)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}