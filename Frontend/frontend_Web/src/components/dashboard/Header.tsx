"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getUserProfile } from "@/api/services/userApi";
import { getUnreadCount } from "@/api/services/notificationApi";
import NotificationButton from "./NotificationButton";
import NotificationModal from "./NotificationModal";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // Función para obtener el conteo de notificaciones no leídas
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadNotificationCount(count);
    } catch (error: any) {
      console.error("Error fetching unread notification count:", error);
      // Si es error de autenticación, redirigir al login
      if (error.message?.includes('401') || error.message?.includes('Error 401')) {
        console.log("Token expirado, redirigiendo al login...");
        router.push('/login');
        return;
      }
      setUnreadNotificationCount(0);
    }
  }, [router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Obtener conteo inicial de notificaciones no leídas
  useEffect(() => {
    fetchUnreadCount();

    // Actualizar el conteo cada 30 segundos
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm"
      >
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Hola {user?.name || "Usuario"} 👋
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Hagamos algo nuevo hoy!
          </p>
        </div>
        
        {/* Botón de notificaciones */}
        <div className="flex items-center gap-3">
          <NotificationButton
            onClick={() => {
              fetchUnreadCount(); // Actualizar conteo antes de abrir
              setIsNotificationModalOpen(true);
            }}
            unreadCount={unreadNotificationCount}
          />
        </div>
      </motion.div>

      {/* Modal de notificaciones */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => {
          setIsNotificationModalOpen(false);
          fetchUnreadCount(); // Actualizar conteo después de cerrar
        }}
        onUnreadCountChange={setUnreadNotificationCount}
      />
    </>
  );
}
