import { getToken } from '../utils/authUtils';
import { API_BASE_URL } from '../constants/Endpoint';

export interface Notification {
  notificationId: number;
  title: string;
  message: string;
  notificationType: string;
  isRead: boolean;
  createdAt: string;
  priority?: string;
  category?: string;
  // Campos calculados para compatibilidad
  id?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  read?: boolean;
}

/**
 * Obtiene todas las notificaciones del usuario actual
 */
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const token = getToken();
    if (!token) {
      console.warn('No hay token de autenticación disponible');
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error en la respuesta del servidor:', response.status, response.statusText);
      throw new Error(`Error al obtener notificaciones: ${response.status}`);
    }

    const data = await response.json();
    // El backend devuelve un objeto con la propiedad 'notifications'
    const notifications = data.notifications || [];
    console.log(`Obtenidas ${notifications.length} notificaciones del backend`);
    return notifications;
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    // En caso de error, devolver array vacío para que el frontend muestre "No tienes notificaciones"
    return [];
  }
};

/**
 * Marca una notificación como leída
 */
export const markAsRead = async (notificationId: string): Promise<void> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al marcar notificación como leída');
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

/**
 * Marca todas las notificaciones como leídas
 */
export const markAllAsRead = async (): Promise<void> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al marcar todas las notificaciones como leídas');
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
};

/**
 * Elimina una notificación
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar notificación');
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};

/**
 * Crea una notificación de prueba (solo para desarrollo)
 */
export const createTestNotification = async (): Promise<void> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/notifications/test-create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al crear notificación de prueba');
    }

    console.log('Notificación de prueba creada exitosamente');
  } catch (error) {
    console.error('Error creando notificación de prueba:', error);
  }
};

/**
 * Notificaciones de ejemplo para desarrollo
 */
const getMockNotifications = (): Notification[] => {
  return [
    {
      notificationId: 1,
      title: 'Nuevo usuario pendiente de aprobación',
      message: 'El usuario Juan Pérez solicita registro como Maestro',
      notificationType: 'COORDINATOR_USER_REGISTRATION_PENDING',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      priority: 'HIGH',
      category: 'user_registration',
      // Campos de compatibilidad
      id: '1',
      type: 'info',
      read: false,
    },
    {
      notificationId: 2,
      title: '¡Registro aprobado!',
      message: 'Su solicitud de registro ha sido aprobada. Ya puede iniciar sesión en el sistema.',
      notificationType: 'USER_REGISTRATION_APPROVED',
      isRead: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      priority: 'HIGH',
      category: 'user_registration',
      // Campos de compatibilidad
      id: '2',
      type: 'success',
      read: false,
    },
    {
      notificationId: 3,
      title: 'Reunión programada',
      message: 'Tienes una reunión de coordinación mañana a las 10:00 AM',
      notificationType: 'SYSTEM_NOTIFICATION',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      priority: 'MEDIUM',
      category: 'system',
      // Campos de compatibilidad
      id: '3',
      type: 'warning',
      read: true,
    },
    {
      notificationId: 4,
      title: 'Nuevo profesor asignado',
      message: 'Se ha asignado un nuevo profesor para la materia Física',
      notificationType: 'TEACHER_SCHEDULE_ASSIGNED',
      isRead: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      priority: 'MEDIUM',
      category: 'schedule',
      // Campos de compatibilidad
      id: '4',
      type: 'info',
      read: true,
    },
  ];
};