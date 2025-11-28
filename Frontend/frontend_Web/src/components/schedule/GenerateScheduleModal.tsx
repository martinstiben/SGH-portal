"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GenerateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (request: {
    periodStart: string;
    periodEnd: string;
    dryRun: boolean;
    force: boolean;
    params?: string;
  }) => void;
  loading: boolean;
  generationType?: 'custom' | 'auto' | 'regenerate';
}

export default function GenerateScheduleModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  generationType = 'custom',
}: GenerateScheduleModalProps) {
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const [force, setForce] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (generationType === 'custom' && (!periodStart || !periodEnd)) return;

    onConfirm({
      periodStart: generationType === 'custom' ? periodStart : '',
      periodEnd: generationType === 'custom' ? periodEnd : '',
      dryRun: generationType === 'custom' ? dryRun : false,
      force: generationType === 'custom' ? force : false,
    });
  };

  const handleClose = () => {
    setPeriodStart("");
    setPeriodEnd("");
    setDryRun(false);
    setForce(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
        <h2 className="text-xl font-bold mb-4">
          {generationType === 'auto' && 'Generación Automática Rápida'}
          {generationType === 'regenerate' && 'Regenerar Todo el Horario'}
          {generationType === 'custom' && 'Generación Personalizada'}
        </h2>

        {generationType === 'auto' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Generación automática:</strong> Se generarán horarios para la semana actual (Lunes a Viernes)
              asignando cursos sin horario a profesores disponibles.
            </p>
          </div>
        )}

        {generationType === 'regenerate' && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-sm text-orange-800">
              <strong>Regeneración completa:</strong> Se eliminarán todos los horarios existentes y se generarán
              nuevos automáticamente para todos los cursos.
            </p>
            <p className="text-sm text-orange-800 mt-2 font-semibold">
              ⚠️ Esta acción no se puede deshacer.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {generationType === 'custom' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          {generationType === 'custom' && (
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Simulación (no guardar cambios)</span>
              </label>
            </div>
          )}

          {generationType === 'custom' && (
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={force}
                  onChange={(e) => setForce(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Forzar generación (ignorar conflictos)</span>
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Generando..." : "Generar Horarios"}
            </button>
          </div>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}