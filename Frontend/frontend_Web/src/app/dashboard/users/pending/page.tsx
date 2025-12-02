"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, User, Mail, Shield } from "lucide-react";
import { getToken } from "@/api/utils/authUtils";
import { USER_END_POINTS, API_BASE_URL } from "@/api/constants/Endpoint";

interface PendingUser {
  userId: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function PendingUsersPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingUser, setProcessingUser] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`${USER_END_POINTS}/pending-users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios pendientes');
      }

      const data = await response.json();
      setPendingUsers(data.pendingUsers || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios pendientes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    try {
      setProcessingUser(userId);
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/auth/approve-user/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al aprobar usuario');
      }

      // Remover usuario de la lista
      setPendingUsers(prev => prev.filter(user => user.userId !== userId));
    } catch (err: any) {
      setError(err.message || 'Error al aprobar usuario');
    } finally {
      setProcessingUser(null);
    }
  };

  const handleReject = async (userId: number) => {
    const reason = prompt('Motivo del rechazo (opcional):');
    if (reason === null) return; // Usuario canceló

    try {
      setProcessingUser(userId);
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/auth/reject-user/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Error al rechazar usuario');
      }

      // Remover usuario de la lista
      setPendingUsers(prev => prev.filter(user => user.userId !== userId));
    } catch (err: any) {
      setError(err.message || 'Error al rechazar usuario');
    } finally {
      setProcessingUser(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            Usuarios Pendientes de Aprobación
          </h1>
          <p className="mt-2 text-gray-600">
            Gestiona las solicitudes de registro de nuevos usuarios en el sistema
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Users List */}
        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios pendientes</h3>
            <p className="mt-1 text-sm text-gray-500">
              Todos los usuarios han sido revisados.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Solicitudes Pendientes ({pendingUsers.length})
              </h2>
            </div>

            <ul className="divide-y divide-gray-200">
              {pendingUsers.map((user) => (
                <li key={user.userId} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Pendiente
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Mail className="h-4 w-4 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Rol solicitado: <span className="font-medium">{user.role}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Solicitado el {new Date(user.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApprove(user.userId)}
                        disabled={processingUser === user.userId}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingUser === user.userId ? (
                          <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleReject(user.userId)}
                        disabled={processingUser === user.userId}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingUser === user.userId ? (
                          <div className="w-4 h-4 border border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        Rechazar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}