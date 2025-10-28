import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated, removeToken, getToken } from '@/api/utils/authUtils';

/**
 * Hook personalizado para manejar autenticación
 * Redirige al login si no está autenticado
 */
export const useAuth = () => {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);

      if (!authenticated) {
        router.push('/login');
      }
    };

    checkAuth();

    // Verificar autenticación cada 5 minutos
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [router]);

  const logout = async () => {
    try {
      // Llamar al endpoint de logout del backend
      const response = await fetch('http://localhost:8085/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Logout exitoso en el backend');
      } else {
        console.log('Error en logout del backend, pero continuando con logout local');
      }
    } catch (error) {
      console.log('Error llamando logout del backend:', error);
    }

    // Limpiar token local y redirigir
    removeToken();
    setIsAuth(false);
    router.push('/login');
  };

  return {
    isAuthenticated: isAuth,
    logout,
  };
};