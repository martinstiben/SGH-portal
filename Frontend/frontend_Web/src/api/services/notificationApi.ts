import { getToken } from '../utils/authUtils';
import { API_BASE_URL } from '../constants/Endpoint';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  relatedEntity?: string;
}

/**
 * Obtiene todas las notificaciones del usuario actual
 */
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Retornar notificaciones de ejemplo si falla el backend
    return getMockNotifications();
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
 * Notificaciones de ejemplo para desarrollo
 */
const getMockNotifications = (): Notification[] => {
  return [
    {
      id: '1',
      title: 'Nueva asignación de horario',
      message: 'Se ha actualizado el horario de la materia Matemáticas para el curso 10A',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      relatedEntity: 'schedule',
    },
    {
      id: '2',
      title: 'Solicitud aprobada',
      message: 'Tu solicitud de cambio de horario ha sido aprobada',
      type: 'success',
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      relatedEntity: 'schedule',
    },
    {
      id: '3',
      title: 'Reunión programada',
      message: 'Tienes una reunión de coordinación mañana a las 10:00 AM',
      type: 'warning',
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '4',
      title: 'Nuevo profesor asignado',
      message: 'Se ha asignado un nuevo profesor para la materia Física',
      type: 'info',
      read: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      relatedEntity: 'professor',
    },
  ];
};