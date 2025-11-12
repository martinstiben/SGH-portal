import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Información del proyecto */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-slate-200">SGH - Sistema de Gestión de Horarios</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Solución tecnológica avanzada para la optimización de horarios académicos
              en instituciones educativas. Desarrollado con tecnologías modernas y
              enfoque en la eficiencia operativa.
            </p>
          </div>

          {/* Equipo de desarrollo */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-slate-200">Equipo de Desarrollo</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p>Martin Stiben Narvaez</p>
              <p>Racinger Prada Olaya</p>
              <p>Juan Pablo Saavedra</p>
            </div>
          </div>

          {/* Descarga de aplicación */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-slate-200">Aplicación Móvil</h4>
            <p className="text-slate-400 text-sm mb-4">
              Accede al sistema desde cualquier dispositivo con nuestra aplicación nativa.
            </p>
            <a
              href="/apk/SGH.apk"
              download
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Descargar APK
            </a>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">
              © 2024 SGH. Todos los derechos reservados.
            </p>
            <p className="text-slate-500 text-sm mt-2 md:mt-0">
              Desarrollado con tecnologías de vanguardia para la educación del futuro.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;