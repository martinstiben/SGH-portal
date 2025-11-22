"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import RegisterForm from "@/components/login/RegisterForm";
import { register } from "@/api/services/userApi";

export default function RegisterPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
    role: string;
    subjectId?: number | null;
    courseId?: number | null;
    acceptTerms: boolean;
  }

  const handleRegister = async ({ name, email, password, role, subjectId, courseId }: RegisterFormValues) => {
    if (!name || !email || !password || !role) {
      setAuthError("Por favor completa todos los campos.");
      return;
    }

    if (role === "MAESTRO" && !subjectId) {
      setAuthError("Debes seleccionar una materia para el rol de maestro.");
      return;
    }

    if (role === "ESTUDIANTE" && !courseId) {
      setAuthError("Debes seleccionar un curso para el rol de estudiante.");
      return;
    }

    try {
      setAuthError("");
      setSuccessMessage("");
      const data = await register(name, email, password, role, subjectId || undefined, courseId || undefined);

      if (data.message) {
         setSuccessMessage("¡Registro exitoso! Tu cuenta está pendiente de aprobación por el coordinador. Recibirás una notificación por correo cuando sea revisada.");
         // No redirigir automáticamente, dejar que el usuario decida cuándo irse
       } else {
         setAuthError("Error en el registro. Inténtalo de nuevo.");
       }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setAuthError("El usuario ya existe o los datos son inválidos.");
      } else if (err.response?.data?.message) {
        setAuthError(err.response.data.message);
      } else {
        setAuthError("Error en el registro. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/scuela.jpg')" }}
    >
      <button
        className="absolute top-6 left-6 bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition-all duration-200 shadow-sm"
        onClick={() => router.push("/")}
      >
        ← Regresar
      </button>

      <RegisterForm onSubmit={handleRegister} authError={authError} successMessage={successMessage} />

      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <p className="text-sm font-medium">Registro completado</p>
          <p className="text-xs mt-1">Puedes cerrar esta página o continuar explorando</p>
        </div>
      )}
    </div>
  );
}