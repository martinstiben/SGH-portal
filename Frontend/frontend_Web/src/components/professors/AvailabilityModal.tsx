"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getTeacherAvailability, TeacherAvailability } from "@/api/services/teacherApi";

interface Teacher {
  teacherId: number;
  teacherName: string;
  subjectId: number;
  subjectName?: string;
  availabilitySummary?: string;
}

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

export default function AvailabilityModal({ isOpen, onClose, teacher }: AvailabilityModalProps) {
  const [availability, setAvailability] = useState<TeacherAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (teacher && isOpen) {
      const fetchAvailability = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getTeacherAvailability(teacher.teacherId);
          setAvailability(data);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'Error al cargar disponibilidad');
        } finally {
          setLoading(false);
        }
      };
      fetchAvailability();
    }
  }, [teacher, isOpen]);

  if (!teacher) return null;

  const allDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  const getDayAvailability = (day: string) => {
    const dayData = availability.find(a => a.day === day);
    if (!dayData) return null;

    const timeSlots: string[] = [];
    if (dayData.amStart && dayData.amEnd) {
      timeSlots.push(`${dayData.amStart} - ${dayData.amEnd}`);
    }
    if (dayData.pmStart && dayData.pmEnd) {
      timeSlots.push(`${dayData.pmStart} - ${dayData.pmEnd}`);
    }
    return timeSlots.length > 0 ? timeSlots : null;
  };

  const availableDays = allDays
    .map(day => {
      const timeSlots = getDayAvailability(day);
      return timeSlots ? { day, timeSlots } : null;
    })
    .filter((day): day is { day: string; timeSlots: string[] } => day !== null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-200" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Disponibilidad</h2>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">{teacher.teacherName}</p>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-gray-600">Cargando disponibilidad...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Error al cargar</h3>
                    <p className="text-xs text-gray-500">{error}</p>
                  </div>
                ) : availableDays.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Días disponibles:</h3>
                    {availableDays.map((dayInfo, index) => (
                      <motion.div
                        key={dayInfo.day}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-green-800">{dayInfo.day}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {dayInfo.timeSlots.map((slot, slotIndex) => (
                            <span key={slotIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {slot}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}

                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Sin disponibilidad</h3>
                    <p className="text-xs text-gray-500">No hay horarios configurados</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-600">
                    {availableDays.length} de 5 días disponibles
                  </div>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}