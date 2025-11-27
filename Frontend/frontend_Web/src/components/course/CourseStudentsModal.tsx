"use client";

import React, { useState, useEffect } from 'react';
import { X, Users, Mail, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCourseStudents, CourseStudent } from '@/api/services/courseApi';

interface CourseStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  courseName: string;
}

const CourseStudentsModal: React.FC<CourseStudentsModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseName
}) => {
  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && courseId) {
      fetchStudents();
    }
  }, [isOpen, courseId]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCourseStudents(courseId);
      setStudents(data);
    } catch (err: unknown) {
      console.error('Error fetching students:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar estudiantes';
      setError(errorMessage);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
return (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-transparent backdrop-blur-md z-40"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transition-all duration-300 ease-out" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Estudiantes del Curso</h2>
                <p className="text-sm text-gray-600 mt-1">{courseName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Cargando estudiantes...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-3 bg-red-100 rounded-full mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar estudiantes</h3>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            ) : students.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-3 bg-gray-100 rounded-full mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay estudiantes inscritos</h3>
                <p className="text-sm text-gray-600">Este curso aún no tiene estudiantes asignados.</p>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">
                      Total de estudiantes: {students.length}
                    </span>
                  </div>
                </div>

                {/* Students Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student, index) => (
                    <div
                      key={`student-${student.userId}-${index}`}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {student.fullName}
                          </h4>

                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{student.email}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium">Rol:</span>
                              <span>{student.roleName}</span>
                            </div>

                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-100">
                            {student.isVerified && (
                              <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                Verificado
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>


        </div>
    </motion.div>
  </>
  )}
</AnimatePresence>
);
};
export default CourseStudentsModal;