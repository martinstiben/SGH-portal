"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Profile from "@/components/dashboard/Profile";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar autenticación en el layout del dashboard
  useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-60 flex-1 bg-gray-50">
        {children}
      </div>
      <Profile />
    </div>
  );
}
