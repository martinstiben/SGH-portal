"use client";

import { X } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Términos y Condiciones</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm leading-relaxed">
          <div>
            <h3 className="text-lg font-medium mb-2">1. Aceptación de los Términos</h3>
            <p>
              Al acceder y utilizar el Sistema de Gestión de Horarios (SGH), usted acepta estar sujeto a estos términos y condiciones.
              Si no está de acuerdo con alguna parte de estos términos, no debe utilizar este sistema.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">2. Descripción del Servicio</h3>
            <p>
              SGH es una plataforma diseñada para facilitar la organización y control de los horarios escolares.
              Permite a coordinadores gestionar horarios de clases, docentes y salones de forma eficiente.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">3. Uso Aceptable</h3>
            <p>
              El usuario se compromete a utilizar el sistema únicamente para fines educativos y administrativos relacionados con la gestión escolar.
              Está prohibido el uso del sistema para actividades ilegales, dañinas o que violen los derechos de terceros.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">4. Responsabilidades del Usuario</h3>
            <p>
              El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que ocurran bajo su cuenta.
              Debe proporcionar información veraz y actualizada al registrarse y utilizar el sistema.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">5. Privacidad y Protección de Datos</h3>
            <p>
              Respetamos su privacidad y nos comprometemos a proteger sus datos personales de acuerdo con las leyes aplicables.
              La información proporcionada se utilizará únicamente para los fines del sistema y no será compartida con terceros sin su consentimiento,
              salvo cuando sea requerido por ley.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">6. Propiedad Intelectual</h3>
            <p>
              El sistema SGH y todo su contenido, incluyendo software, diseños y documentación, son propiedad de Bytestock y están protegidos por leyes de propiedad intelectual.
              El usuario no adquiere ningún derecho de propiedad sobre el sistema al utilizarlo.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">7. Limitación de Responsabilidad</h3>
            <p>
              El sistema se proporciona "tal cual" sin garantías de ningún tipo. No nos responsabilizamos por daños directos, indirectos o consecuentes
              que puedan surgir del uso del sistema.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">8. Modificaciones</h3>
            <p>
              Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento.
              Los cambios serán efectivos inmediatamente después de su publicación en el sistema.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">9. Terminación</h3>
            <p>
              Podemos terminar o suspender su acceso al sistema inmediatamente, sin previo aviso, por cualquier motivo,
              incluyendo el incumplimiento de estos términos.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">10. Ley Aplicable</h3>
            <p>
              Estos términos se rigen por las leyes de Colombia. Cualquier disputa será resuelta en los tribunales competentes de dicho país.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              Última actualización: {new Date().toLocaleDateString('es-CO')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}