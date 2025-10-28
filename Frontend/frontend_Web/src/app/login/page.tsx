"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginForm from "@/components/login/LoginForm";
import CodeVerificationForm from "@/components/login/CodeVerificationForm";
import { initiateLogin, verifyCode } from "@/api/services/userApi";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [step, setStep] = useState<"credentials" | "code">("credentials");
  const [email, setEmail] = useState("");

  interface LoginFormValues {
    email: string;
    password: string;
    acceptTerms: boolean;
  }

  interface CodeFormValues {
    code: string;
  }

  const handleLogin = async ({ email, password }: LoginFormValues) => {
    if (!email || !password) {
      setAuthError("Por favor ingresa email y contraseña.");
      return;
    }

    try {
      setAuthError("");
      setSuccessMessage("");
      setEmail(email);
      const data = await initiateLogin(email, password);

      if (data.message) {
        setSuccessMessage("Código enviado a tu email. Revisa tu bandeja de entrada.");
        setStep("code");
      } else {
        setAuthError("Error al iniciar sesión.");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setAuthError("Email o contraseña incorrectos.");
      } else if (err.response?.data?.message) {
        setAuthError(err.response.data.message);
      } else {
        setAuthError("Email o contraseña incorrectos.");
      }
    }
  };

  const handleVerifyCode = async ({ code }: CodeFormValues) => {
    if (!code) {
      setAuthError("Por favor ingresa el código de verificación.");
      return;
    }

    try {
      setAuthError("");
      setSuccessMessage("");
      const data = await verifyCode(email, code);

      if (data.token) {
        Cookies.set("token", data.token, { expires: 1 }); // Expira en 1 día
        setSuccessMessage("¡Bienvenido! Iniciando sesión...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setAuthError("No se recibió token. Verifica el código.");
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setAuthError("Código inválido o expirado.");
      } else if (err.response?.data?.message) {
        setAuthError(err.response.data.message);
      } else {
        setAuthError("Error al verificar el código.");
      }
    }
  };

  const handleBackToCredentials = () => {
    setStep("credentials");
    setAuthError("");
    setSuccessMessage("");
  };


  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/scuela.jpg')" }}
    >
      <button
        className="absolute top-5 left-5 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        onClick={() => router.push("/")}
      >
        Regresar
      </button>


      {step === "credentials" ? (
        <LoginForm
          onSubmit={handleLogin}
          authError={authError}
          successMessage={successMessage}
        />
      ) : (
        <CodeVerificationForm
          onSubmit={handleVerifyCode}
          onBack={handleBackToCredentials}
          authError={authError}
          successMessage={successMessage}
        />
      )}
    </div>
  );
}
