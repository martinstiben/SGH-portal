import { Schedule } from "@/api/services/scheduleApi";

interface ScheduleConfirmModalProps {
  isOpen: boolean;
  scheduleToDelete: Schedule | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ScheduleConfirmModal({
  isOpen,
  scheduleToDelete,
  onClose,
  onConfirm,
}: ScheduleConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-[60]">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4 border border-gray-200 transition-all duration-300 ease-out">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirmar eliminación</h2>
        <p className="text-sm text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar el horario "<span className="font-semibold text-gray-900">{scheduleToDelete?.scheduleName}</span>"? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-200 transition-all duration-200"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}