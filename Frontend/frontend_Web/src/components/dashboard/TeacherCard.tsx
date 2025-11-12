type TeacherCardProps = {
  name: string;
  onConfigureAvailability?: () => void;
};

export default function TeacherCard({ name, onConfigureAvailability }: TeacherCardProps) {
  return (
    <div className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 overflow-hidden">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-40 group-hover:opacity-60 transition-opacity duration-200" />
      
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-8 translate-x-8 opacity-30 group-hover:opacity-50 transition-opacity" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Avatar placeholder */}
        <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
          <span className="text-white text-xl font-bold">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* Name */}
        <h2 className="text-base font-semibold text-gray-900 text-center mb-1 group-hover:text-blue-700 transition-colors duration-200">
          {name}
        </h2>
        
        {/* Subtitle */}
        <p className="text-sm text-gray-600 text-center font-medium">
          Profesor
        </p>

        {/* Configure Availability Button for Teachers */}
        {onConfigureAvailability && (
          <button
            onClick={onConfigureAvailability}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Configurar Disponibilidad
          </button>
        )}

        {/* Bottom accent line */}
        <div className="mt-4 h-0.5 w-10 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-50 group-hover:w-16 group-hover:opacity-100 transition-all duration-200" />
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-blue-500/5 to-blue-600/5" />
    </div>
  );
}