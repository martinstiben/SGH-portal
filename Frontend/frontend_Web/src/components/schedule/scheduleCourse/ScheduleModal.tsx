import React from 'react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: () => void;
  courseName: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onRegenerate,
  courseName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Horario de {courseName}</h2>
        <p className="text-sm text-gray-600 mb-6">Aquí se mostraría el horario detallado del curso.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
          >
            Cerrar
          </button>
          <button
            onClick={onRegenerate}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            Regenerar Horario
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;