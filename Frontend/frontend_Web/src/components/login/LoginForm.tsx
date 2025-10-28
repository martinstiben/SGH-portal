"use client";
import { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";

interface LoginFormProps {
  onBack?: () => void;
  onSubmit?: (data: { email: string; password: string; acceptTerms: boolean }) => void;
  authError?: string;
  successMessage?: string;
}

export default function LoginForm({ onBack, onSubmit, authError, successMessage }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Limpiar errores previos
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email.trim()) {
      setEmailError('El correo electrónico es obligatorio');
      hasError = true;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setEmailError('El correo electrónico debe tener un formato válido');
      hasError = true;
    }

    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      hasError = true;
    } else if (password.length > 100) {
      setPasswordError('La contraseña no puede exceder los 100 caracteres');
      hasError = true;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit({ email, password, acceptTerms: true });
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
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <img
            src="/byte.png"
            alt="Bytestock Logo"
            className="mx-auto mb-4 w-full max-w-48 h-auto sm:max-w-56 object-contain"
          />
          <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2">
            Inicio de sesión
          </h1>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(""); // Limpiar error al escribir
              }}
              className={`w-full pl-12 pr-4 py-2.5 sm:py-3 rounded-lg bg-gray-800/70 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                (emailError || authError) ? 'border-red-500 focus:ring-red-500' : 'border-gray-600/50 focus:ring-blue-500'
              }`}
            />
          </div>
          {(emailError || authError) && (
            <p className="text-red-400 text-sm mt-1">{emailError || authError}</p>
          )}

          {/* Contraseña */}
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(""); // Limpiar error al escribir
              }}
              className={`w-full pl-12 pr-12 py-2.5 sm:py-3 rounded-lg bg-gray-800/70 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                (passwordError || authError) ? 'border-red-500 focus:ring-red-500' : 'border-gray-600/50 focus:ring-blue-500'
              }`}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-400 text-sm mt-1">{passwordError}</p>
          )}

          {/* Botón Ingresar */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.01] disabled:scale-100 shadow-lg text-sm sm:text-base"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Ingresando...
              </div>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        {successMessage && (
          <p className="text-green-400 text-sm mt-4 text-center">{successMessage}</p>
        )}

        {/* Enlace a registro */}
        <div className="text-center mt-4">
          <p className="text-gray-300 text-sm">
            ¿No tienes cuenta?{" "}
            <a
              href="/register"
              className="text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-3 sm:bottom-4 text-gray-400 text-xs sm:text-sm text-center w-full">
        Derechos reservados ©Bytestock
      </div>
    </div>
  );
}
