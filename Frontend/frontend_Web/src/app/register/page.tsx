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
    acceptTerms: boolean;
  }

  const handleRegister = async ({ name, email, password, role, subjectId }: RegisterFormValues) => {
    if (!name || !email || !password || !role) {
      setAuthError("Por favor completa todos los campos.");
      return;
    }

    if (role === "MAESTRO" && !subjectId) {
      setAuthError("Debes seleccionar una materia para el rol de maestro.");
      return;
    }

    try {
      setAuthError("");
      setSuccessMessage("");
      const data = await register(name, email, password, role, subjectId || undefined);

      if (data.message) {
        setSuccessMessage("¡Registro exitoso! Redirigiendo al login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
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
    </div>
  );
}