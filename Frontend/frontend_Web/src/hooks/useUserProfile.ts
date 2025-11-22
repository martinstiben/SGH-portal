import { useState, useEffect } from 'react';
import { getUserProfile } from '@/api/services/userApi';

export interface UserProfile {
  userId: number;
  name: string;
  email: string;
  role: string;
  courseId?: number;
  courseName?: string;
}

/**
 * Hook personalizado para obtener el perfil del usuario actual
 * Incluye información del curso si el usuario es estudiante
 */
export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile();
        console.log('Perfil de usuario cargado:', profile);
        setUserProfile(profile);
        setError(null);
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Error al cargar el perfil del usuario');
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const isStudent = userProfile?.role === 'ESTUDIANTE';
  const isCoordinator = userProfile?.role === 'COORDINADOR';
  const isTeacher = userProfile?.role === 'MAESTRO';

  return {
    userProfile,
    loading,
    error,
    isStudent,
    isCoordinator,
    isTeacher,
    studentCourseId: userProfile?.courseId,
    studentCourseName: userProfile?.courseName,
  };
};