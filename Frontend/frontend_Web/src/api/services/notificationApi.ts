import { getToken } from '../utils/authUtils';
import { API_BASE_URL } from '../constants/Endpoint';

export interface Notification {
  notificationId: number;
  title: string;
  message: string;
  notificationType: string;
  read: boolean;
  createdAt: string;
  priority?: string;
  category?: string;
  userId?: number;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  actionUrl?: string;
  actionText?: string;
  icon?: string;
  isArchived?: boolean;
  expiresAt?: string;
  metadata?: any;
  readAt?: string;
  priorityDisplayName?: string;
  priorityColor?: string;
  priorityIcon?: string;
  age?: string;
  isRecent?: boolean;
  isActive?: boolean;
  requiresImmediateAttention?: boolean;
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
 * Obtiene el conteo de notificaciones no leídas
 */
export const getUnreadCount = async (): Promise<number> => {
  try {
    const token = getToken();
    if (!token) {
      console.warn('No hay token de autenticación disponible');
      return 0;
    }

    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error en la respuesta del servidor:', response.status, response.statusText);
      throw new Error(`Error al obtener conteo de notificaciones: ${response.status}`);
    }

    const data = await response.json();
    const unreadCount = data.unreadCount || 0;
    console.log(`Conteo de notificaciones no leídas: ${unreadCount}`);
    return unreadCount;
  } catch (error) {
    console.error('Error obteniendo conteo de notificaciones no leídas:', error);
    return 0;
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



