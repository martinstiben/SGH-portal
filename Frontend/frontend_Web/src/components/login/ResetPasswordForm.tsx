"use client";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { requestPasswordReset, verifyResetCode } from "@/api/services/userApi";

interface ResetPasswordFormProps {
  step: "email" | "code";
  onStepChange?: (step: "email" | "code") => void;
  onSuccess?: () => void;
}

export default function ResetPasswordForm({
  step,
  onStepChange,
  onSuccess
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Limpiar errores previos
    setEmailError("");
    setSuccessMessage("");

    let hasError = false;

    if (!emailInput.trim()) {
      setEmailError('El correo electrónico es obligatorio');
      hasError = true;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput)) {
      setEmailError('El correo electrónico debe tener un formato válido');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const response = await requestPasswordReset(emailInput);
      setSuccessMessage("Código enviado a tu email. Revisa tu bandeja de entrada.");
      if (onStepChange) {
        onStepChange("code");
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setEmailError(err.message || "Error al solicitar el reset de contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Limpiar errores previos
    setCodeError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setSuccessMessage("");

    let hasError = false;

    if (!code.trim()) {
      setCodeError('El código de verificación es obligatorio');
      hasError = true;
    }

    if (!newPassword) {
      setPasswordError('La nueva contraseña es obligatoria');
      hasError = true;
    } else if (newPassword.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      hasError = true;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setPasswordError('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número');
      hasError = true;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const response = await verifyResetCode(emailInput, code, newPassword);
      setSuccessMessage("Contraseña restablecida exitosamente. Redirigiendo al login...");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setCodeError(err.message || "Error al verificar el código");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/85 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 md:p-12 text-white">
      {/* Logo */}
      <div className="text-center mb-6 sm:mb-8">
        <img
          src="/byteWhite.png"
          alt="Bytestock Logo"
          className="mx-auto mb-4 w-full max-w-48 h-auto sm:max-w-56 object-contain"
        />
        <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          {step === "email" ? "Restablecer Contraseña" : "Verificar Código"}
        </h1>
        <p className="text-gray-300 text-sm">
          {step === "email"
            ? "Ingresa tu email para recibir un código de verificación"
            : `Código enviado a ${emailInput}`
          }
        </p>
      </div>

      {step === "email" ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                if (emailError) setEmailError("");
              }}
              className={`w-full pl-12 pr-4 py-2.5 sm:py-3 rounded-lg bg-gray-800/70 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all bg-gray-800 ${
                emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-600/50 focus:ring-blue-500'
              }`}
            />
          </div>
          {emailError && (
            <p className="text-red-400 text-sm mt-1">{emailError}</p>
          )}

          {/* Botón Enviar Código */}
          <button
            type="submit"
            disabled={isLoading || !emailInput}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.01] disabled:scale-100 shadow-lg text-sm sm:text-base"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Enviando...
              </div>
            ) : (
              "Enviar Código de Verificación"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          {/* Código */}
          <div className="relative">
            <input
              type="text"
              placeholder="Código de verificación (6 dígitos)"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); // Solo números, máximo 6
                if (codeError) setCodeError("");
              }}
              className={`w-full pl-4 pr-4 py-2.5 sm:py-3 rounded-lg bg-gray-800/70 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all bg-gray-800 text-center text-lg font-mono ${
                codeError ? 'border-red-500 focus:ring-red-500' : 'border-gray-600/50 focus:ring-blue-500'
              }`}
            />
          </div>
          {codeError && (
            <p className="text-red-400 text-sm mt-1">{codeError}</p>
          )}

          {/* Nueva Contraseña */}
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              className={`w-full pl-12 pr-12 py-2.5 sm:py-3 rounded-lg bg-gray-800/70 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all bg-gray-800 ${
                passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-600/50 focus:ring-blue-500'
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

          {/* Confirmar Contraseña */}
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) setConfirmPasswordError("");
              }}
              className={`w-full pl-12 pr-12 py-2.5 sm:py-3 rounded-lg bg-gray-800/70 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all bg-gray-800 ${
                confirmPasswordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-600/50 focus:ring-blue-500'
              }`}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {confirmPasswordError && (
            <p className="text-red-400 text-sm mt-1">{confirmPasswordError}</p>
          )}

          {/* Botones */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading || !code || !newPassword || !confirmPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.01] disabled:scale-100 shadow-lg text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Restableciendo...
                </div>
              ) : (
                "Restablecer Contraseña"
              )}
            </button>

            <button
              type="button"
              onClick={() => onStepChange && onStepChange("email")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.01] shadow-lg text-sm sm:text-base flex items-center justify-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Cambiar Email
            </button>
          </div>
        </form>
      )}

      {successMessage && (
        <p className="text-green-400 text-sm mt-4 text-center">{successMessage}</p>
      )}

      {/* Enlace a login */}
      <div className="text-center mt-4">
        <p className="text-gray-300 text-sm">
          ¿Recordaste tu contraseña?{" "}
          <a
            href="/login"
            className="text-blue-400 hover:text-blue-300 underline font-medium"
          >
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}