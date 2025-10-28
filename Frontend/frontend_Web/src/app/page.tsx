"use client";

import Link from "next/link";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      {/* Botones de navegación */}
      <div className="absolute top-5 right-6 flex space-x-4">
        <Link
          href="/register"
          className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-600 transition"
        >
          Registrarse
        </Link>
        <Link
          href="/login"
          className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-600 transition"
        >
          Ingresar
        </Link>
      </div>

      {/* Componente Hero */}
      <Hero />

      {/* Componente Footer */}
      <Footer />
    </div>
  );
}
