"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "@/api/services/userApi";
import NotificationButton from "./NotificationButton";
import NotificationModal from "./NotificationModal";

export default function Header() {
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

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

  return (
    <>
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
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
          <NotificationButton onClick={() => setIsNotificationModalOpen(true)} />
        </div>
      </div>

      {/* Modal de notificaciones */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </>
  );
}
