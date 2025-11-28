import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Eye } from 'lucide-react';
import { getTeacherAvailability, TeacherAvailability } from '../../api/services/teacherApi';

interface ViewAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: number;
  teacherName: string;
}

const DAYS_OF_WEEK = [
  { value: 'Lunes', label: 'Lunes' },
  { value: 'Martes', label: 'Martes' },
  { value: 'Miércoles', label: 'Miércoles' },
  { value: 'Jueves', label: 'Jueves' },
  { value: 'Viernes', label: 'Viernes' },
];

const ViewAvailabilityModal: React.FC<ViewAvailabilityModalProps> = ({ isOpen, onClose, teacherId, teacherName }) => {
  const [availabilities, setAvailabilities] = useState<TeacherAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && teacherId) {
      loadAvailability();
    }
  }, [isOpen, teacherId]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const data = await getTeacherAvailability(teacherId);
      setAvailabilities(data);
    } catch (error: any) {
      console.error('Error loading availability:', error);
      setError('Error al cargar la disponibilidad');
      setAvailabilities([]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDayAvailability = (day: string) => {
    return availabilities.find(a => a.day === day);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Disponibilidad de {teacherName}
              </h2>
              <p className="text-sm text-gray-600">
                Vista de horarios disponibles por día
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Cargando disponibilidad...</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => {
                const dayAvailability = getCurrentDayAvailability(day.value);
                return (
                  <div key={day.value} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                      {day.label}
                    </h3>
                    {dayAvailability ? (
                      <div className="space-y-3">
                        {dayAvailability.amStart && dayAvailability.amEnd && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Horario de Mañana (AM)
                            </h4>
                            <p className="text-sm text-blue-800">
                              {dayAvailability.amStart} - {dayAvailability.amEnd}
                            </p>
                          </div>
                        )}
                        {dayAvailability.pmStart && dayAvailability.pmEnd && (
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Horario de Tarde (PM)
                            </h4>
                            <p className="text-sm text-green-800">
                              {dayAvailability.pmStart} - {dayAvailability.pmEnd}
                            </p>
                          </div>
                        )}
                        {!dayAvailability.amStart && !dayAvailability.amEnd && !dayAvailability.pmStart && !dayAvailability.pmEnd && (
                          <p className="text-sm text-gray-500 italic">No configurada</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No configurada</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Summary */}
          {!loading && !error && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Resumen de Disponibilidad</h4>
              <p className="text-sm text-blue-800">
                Días configurados: {availabilities.length > 0 ? availabilities.map(a => a.day).join(', ') : 'Ninguno'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
    </div>
  );
};

export default ViewAvailabilityModal;