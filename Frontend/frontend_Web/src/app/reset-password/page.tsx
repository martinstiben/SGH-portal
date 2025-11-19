"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ResetPasswordForm from "../../components/login/ResetPasswordForm";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");

  const handleStepChange = (newStep: "email" | "code") => {
    setStep(newStep);
  };

  const handleSuccess = () => {
    setTimeout(() => {
      router.push("/login");
    }, 2000);
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

      <ResetPasswordForm
        step={step}
        onStepChange={handleStepChange}
        onSuccess={handleSuccess}
      />
    </div>
  );
}