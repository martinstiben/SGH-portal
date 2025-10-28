"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "@/api/services/userApi";

export default function Header() {
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);

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
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
      <div>
        <h1 className="text-lg font-semibold">Hola {user?.name || "Usuario"} 👋</h1>
        <p className="text-sm text-gray-600">Hagamos algo nuevo hoy!</p>
      </div>
    </div>
  );
}
