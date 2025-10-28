"use client";

import { useState, useEffect } from "react";
import ProfileModal from "@/components/dashboard/ProfileModal"; // Importa el modal
import { getUserProfile, getUserPhoto } from "@/api/services/userApi";

export default function ProfileCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("Cargando...");
  const [userRole, setUserRole] = useState("Cargando...");
  const [userId, setUserId] = useState<number | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();
        setUserName(data.name);
        setUserRole(data.role || "Usuario");
        setUserId(data.userId);

        // Cargar foto de perfil solo si tenemos userId
        if (data.userId) {
          console.log("Cargando foto para usuario:", data.userId);
          // No esperamos la foto, la cargamos de forma asíncrona
          getUserPhoto(data.userId).then(photoUrl => {
            console.log("Foto cargada:", photoUrl);
            setUserPhoto(photoUrl);
          }).catch(photoError => {
            console.log("Error cargando foto, usando imagen por defecto:", photoError);
            setUserPhoto(null);
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setUserName("Error");
        setUserRole("Error");
        setUserPhoto(null);
      }
    };
    loadProfile();
  }, []);

  // Función para refrescar el perfil después de actualizar
  const refreshProfile = async () => {
    try {
      console.log('Refrescando perfil en componente padre...');
      const data = await getUserProfile();
      console.log('Datos del perfil obtenidos:', data);
      setUserName(data.name);
      setUserRole(data.role || "Usuario");
      setUserId(data.userId);

      // Forzar recarga de foto limpiando primero el estado
      setUserPhoto(null);

      // Recargar foto de perfil con un pequeño delay para asegurar limpieza
      if (data.userId) {
        setTimeout(async () => {
          try {
            console.log('Recargando foto de perfil para userId:', data.userId);
            const photoUrl = await getUserPhoto(data.userId);
            console.log('Foto de perfil recargada:', photoUrl);
            setUserPhoto(photoUrl);
          } catch (photoError) {
            console.log('Error recargando foto, usando null:', photoError);
            setUserPhoto(null);
          }
        }, 100);
      }
      console.log('Perfil refrescado exitosamente');
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  return (
    <>
      <div
        className="relative w-48 h-50 bg-white mt-5 rounded-xl shadow p-3 text-center cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsModalOpen(true)} // Abre el modal al hacer clic en toda la tarjeta
      >
        {/* Encabezado */}
        <div className="flex justify-between items-start">
          <h2 className="text-sm font-medium text-gray-700">Perfil</h2>
        </div>

        {/* Imagen de perfil con borde circular */}
        <div className="mt-2 flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-full border-4 border-cyan-400 flex items-center justify-center overflow-hidden">
            <img
              src={userPhoto || "/byte.png"}
              alt="Perfil"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                console.error("Error cargando imagen en Profile:", e);
                const target = e.target as HTMLImageElement;
                target.src = "/byte.png";
              }}
            />
          </div>

          {/* Nombre y rol */}
          <h3 className="mt-3 font-semibold text-gray-800 flex items-center gap-1">
            {userName}
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </h3>
          <p className="text-xs text-gray-500">{userRole}</p>
        </div>
      </div>

      {/* Modal */}
      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProfileUpdate={refreshProfile}
      />
    </>
  );
}