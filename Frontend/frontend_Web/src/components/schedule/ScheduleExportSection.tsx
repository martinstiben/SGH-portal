import { FileText, FileSpreadsheet, Image } from "lucide-react";

interface ScheduleExportSectionProps {
  onExport: (format: 'pdf' | 'excel' | 'image', type: 'course' | 'teacher' | 'all', id?: number) => void;
}

export default function ScheduleExportSection({ onExport }: ScheduleExportSectionProps) {
  return (
    <div className="my-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
          <span className="mr-2">📤</span>
          Exportar Horarios
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="group flex flex-col items-center p-6 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 cursor-pointer border border-red-200 hover:border-red-300 hover:shadow-lg hover:-translate-y-1" onClick={() => onExport('pdf', 'all')}>
            <div className="p-3 bg-red-500 rounded-full mb-3 group-hover:bg-red-600 transition-colors">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 mb-1">PDF</span>
            <span className="text-xs text-gray-600">Profesores</span>
          </div>
          <div className="group flex flex-col items-center p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-300 cursor-pointer border border-green-200 hover:border-green-300 hover:shadow-lg hover:-translate-y-1" onClick={() => onExport('excel', 'all')}>
            <div className="p-3 bg-green-500 rounded-full mb-3 group-hover:bg-green-600 transition-colors">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 mb-1">Excel</span>
            <span className="text-xs text-gray-600">Profesores</span>
          </div>
          <div className="group flex flex-col items-center p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 cursor-pointer border border-blue-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1" onClick={() => onExport('image', 'all')}>
            <div className="p-3 bg-blue-500 rounded-full mb-3 group-hover:bg-blue-600 transition-colors">
              <Image className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 mb-1">Imagen</span>
            <span className="text-xs text-gray-600">Horarios</span>
          </div>
          <div className="group flex flex-col items-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300 cursor-pointer border border-purple-200 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1" onClick={() => onExport('image', 'all', 0)}>
            <div className="p-3 bg-purple-500 rounded-full mb-3 group-hover:bg-purple-600 transition-colors">
              <Image className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 mb-1">Imagen</span>
            <span className="text-xs text-gray-600">Profesores</span>
          </div>
        </div>
      </div>
    </div>
  );
}