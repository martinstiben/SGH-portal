"use client";
import { useState } from "react";
import { ArrowLeft, Key } from "lucide-react";

interface CodeVerificationFormProps {
  onBack?: () => void;
  onSubmit?: (data: { code: string }) => void;
  authError?: string;
  successMessage?: string;
}

export default function CodeVerificationForm({ onBack, onSubmit, authError, successMessage }: CodeVerificationFormProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [codeError, setCodeError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Limpiar errores previos
    setCodeError("");

    let hasError = false;

    if (!code.trim()) {
      setCodeError('El código de verificación es obligatorio');
      hasError = true;
    } else if (!/^\d{6}$/.test(code)) {
      setCodeError('El código debe ser de 6 dígitos');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit({ code });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1)), url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grain" patternUnits="userSpaceOnUse" width="100" height="100"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grain)"/%3E%3C/svg%3E")',
      }}
    >

      {/* Contenedor del formulario */}
      <div className="bg-gray-900/85 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 md:p-12 text-white">
        {/* Botón regresar */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Regresar
          </button>
        )}

        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <img
            src="/logo.png"
            alt="Logo"
            className="mx-auto mb-4 w-20 h-20 sm:w-24 sm:h-24 object-contain"
          />
          <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2">
            Verificación de código
          </h1>
          <p className="text-gray-300 text-sm">
            Ingresa el código de 6 dígitos enviado a tu email
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Código */}
          <div className="relative">
            <Key
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Código de verificación"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCode(value);
                if (codeError) setCodeError(""); // Limpiar error al escribir
              }}
              className={`w-full pl-12 pr-4 py-2.5 sm:py-3 rounded-lg bg-gray-800/70 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-center text-lg font-mono tracking-widest ${
                (codeError || authError) ? 'border-red-500 focus:ring-red-500' : 'border-gray-600/50 focus:ring-blue-500'
              }`}
              maxLength={6}
            />
          </div>
          {(codeError || authError) && (
            <p className="text-red-400 text-sm mt-1">{codeError || authError}</p>
          )}

          {/* Botón Verificar */}
          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.01] disabled:scale-100 shadow-lg text-sm sm:text-base"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Verificando...
              </div>
            ) : (
              "Verificar código"
            )}
          </button>
        </form>

        {successMessage && (
          <p className="text-green-400 text-sm mt-4 text-center">{successMessage}</p>
        )}

        {/* Footer */}
        <div className="absolute bottom-3 sm:bottom-4 left-2 text-gray-400 text-xs sm:text-sm text-center w-full">
          Derechos reservados ©Bytestock
        </div>
      </div>
    </div>
  );
}