import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Props para el componente LogoutModal
 */
interface LogoutModalProps {
  /** Indica si el modal está abierto */
  isOpen: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
  /** Función para confirmar el logout */
  onConfirm: () => void;
  /** Indica si está en proceso de logout */
  isLoggingOut: boolean;
}

/**
 * Modal de confirmación para cerrar sesión
 *
 * Muestra un diálogo de confirmación antes de cerrar la sesión del usuario.
 * Incluye estados de carga durante el proceso de logout.
 *
 * @param props - Las propiedades del componente
 * @returns {JSX.Element | null} El modal o null si no está abierto
 *
 * @example
 * ```tsx
 * <LogoutModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onConfirm={handleLogout}
 *   isLoggingOut={isLoggingOut}
 * />
 * ```
 */
const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoggingOut
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
            <div className="bg-white rounded-xl shadow-xl p-6 w-96 mx-4 border border-gray-200 transition-all duration-300 ease-out">
              {!isLoggingOut ? (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Cerrar Sesión
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    ¿Estás seguro de que quieres cerrar la sesión?
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-all duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={onConfirm}
                      className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all duration-200"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center py-6">
                  <Loader2 className="animate-spin text-red-600 mb-3" size={32} />
                  <p className="text-gray-900 font-medium text-sm">Cerrando sesión...</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;