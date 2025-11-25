"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllNotifications, markAsRead, Notification } from '@/api/services/notificationApi';
import { CheckCircle, XCircle, Clock, AlertCircle, Info } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (unreadCount: number) => void;
}

export default function NotificationModal({ isOpen, onClose, onUnreadCountChange }: NotificationModalProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Notificar al componente padre sobre el conteo de notificaciones no leídas
  useEffect(() => {
    const unreadCount = notifications.filter(notif => !notif.read).length;
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [notifications, onUnreadCountChange]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllNotifications();
      console.log('Notificaciones recibidas del backend:', data);
      console.log('Primera notificación read:', data[0]?.read);
      setNotifications(data);
    } catch (err: any) {
      console.error('Error cargando notificaciones:', err);
      // Si es error de autenticación, redirigir al login
      if (err.message?.includes('401') || err.message?.includes('Error 401')) {
        console.log("Token expirado, redirigiendo al login...");
        router.push('/login');
        return;
      }
      setError(err.message || "Error al cargar notificaciones");
      setNotifications([]); // Array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      console.log('Marcando notificación como leída:', notificationId);
      await markAsRead(notificationId);
      console.log('Notificación marcada en el backend, actualizando estado local');

      const updatedNotifications = notifications.map(notif => {
        const match = notif.notificationId?.toString() === notificationId;
        console.log(`Comparando ${notif.notificationId} (${typeof notif.notificationId}) con ${notificationId} (${typeof notificationId}) - Match: ${match}`);
        return match ? { ...notif, read: true } : notif;
      });

      console.log('Notificaciones actualizadas:', updatedNotifications);
      setNotifications(updatedNotifications);

      // Actualizar inmediatamente el conteo en el componente padre
      const unreadCount = updatedNotifications.filter(notif => !notif.read).length;
      console.log('Nuevo conteo de no leídas:', unreadCount);
      if (onUnreadCountChange) {
        onUnreadCountChange(unreadCount);
      }
    } catch (err) {
      console.error("Error marcando notificación como leída:", err);
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    // Usar el tipo de notificación del backend
    const type = notification.notificationType?.toLowerCase() || 'info';

    if (type.includes('approved') || type.includes('success')) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (type.includes('rejected') || type.includes('error')) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else if (type.includes('alert') || type.includes('warning')) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    } else {
      return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="modal-backdrop fixed inset-0 bg-transparent backdrop-blur-md z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="modal-content fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50"
          >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-800">Notificaciones</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filtros y acciones */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                No leídas
              </button>
            </div>

          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="notification-scroll overflow-y-auto h-[calc(100vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <XCircle className="w-16 h-16 mb-4 text-red-400" />
              <p className="text-lg font-medium">Error al cargar notificaciones</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <p className="text-lg font-medium">No hay notificaciones</p>
              <p className="text-sm">Todas tus notificaciones aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    notification.read
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(String(notification.notificationId))}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm mt-1 text-gray-700">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}