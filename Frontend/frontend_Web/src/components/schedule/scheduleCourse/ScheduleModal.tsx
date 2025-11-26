import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-transparent backdrop-blur-md z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full border border-gray-200 transition-all duration-300 ease-out" onClick={(e) => e.stopPropagation()}>
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
    </motion.div>
  </>
  )}
</AnimatePresence>
);
};

export default ScheduleModal;