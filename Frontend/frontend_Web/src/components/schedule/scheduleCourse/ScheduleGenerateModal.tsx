import React, { useState } from 'react';

interface ScheduleGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: {
    periodStart: string;
    periodEnd: string;
    dryRun: boolean;
    force: boolean;
    params?: string;
  }) => void;
  isGenerating?: boolean;
}

const ScheduleGenerateModal: React.FC<ScheduleGenerateModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating = false,
}) => {
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [dryRun, setDryRun] = useState(false);
  const [force, setForce] = useState(false);
  const [params, setParams] = useState('');

  const handleSubmit = () => {
    if (!periodStart || !periodEnd) {
      alert('Por favor complete las fechas de inicio y fin del período.');
      return;
    }

    onGenerate({
      periodStart,
      periodEnd,
      dryRun,
      force,
      params: params || undefined,
    });

    // Reset form
    setPeriodStart('');
    setPeriodEnd('');
    setDryRun(false);
    setForce(false);
    setParams('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Generar Horario</h2>
        <p className="text-sm text-gray-600 mb-6">Configure los parámetros para generar el horario automáticamente.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha de inicio del período *
            </label>
            <input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha de fin del período *
            </label>
            <input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="dryRun"
              checked={dryRun}
              onChange={(e) => setDryRun(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="dryRun" className="ml-2 text-sm text-gray-700">
              Modo simulación (solo contar, no generar)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="force"
              checked={force}
              onChange={(e) => setForce(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="force" className="ml-2 text-sm text-gray-700">
              Forzar generación (ignorar algunas validaciones)
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Parámetros adicionales (opcional)
            </label>
            <input
              type="text"
              value={params}
              onChange={(e) => setParams(e.target.value)}
              placeholder="Descripción o parámetros adicionales"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generando...' : 'Generar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGenerateModal;