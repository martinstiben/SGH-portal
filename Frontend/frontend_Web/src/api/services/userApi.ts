import { API_BASE_URL } from "../constants/Endpoint";
import { getAuthHeaders } from "../utils/authUtils";
import { log } from "../../utils/logger";
import Cookies from 'js-cookie';

const API_URL = `${API_BASE_URL}/auth`;

export const initiateLogin = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    log.error("Error en login", error, { email });
    throw error;
  }
};

export const verifyCode = async (email: string, code: string) => {
  try {
    const response = await fetch(`${API_URL}/verify-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    log.error("Error en verificación de código", error, { email });
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    log.error("Error obteniendo perfil de usuario", error);
    throw error;
  }
};

export const getUserPhoto = async (userId: number) => {
  try {
    console.log("Obteniendo foto para usuario:", userId);

    const response = await fetch(`${API_BASE_URL}/users/${userId}/photo`, {
      method: "GET",
    });

    console.log("Respuesta del servidor para foto:", response.status, response.statusText);

    if (!response.ok) {
      if (response.status === 404) {
        console.log("No hay foto de perfil para el usuario", userId);
        return null; // No hay foto
      }
      console.error("Error obteniendo foto:", response.status, response.statusText);
      return null;
    }

    const blob = await response.blob();
    console.log("Foto obtenida correctamente, tamaño:", blob.size, "tipo:", blob.type);
    const url = URL.createObjectURL(blob);
    console.log("URL de foto creada:", url);
    return url;
  } catch (error: any) {
    console.error("Error obteniendo foto de usuario:", error);
    log.error("Error obteniendo foto de usuario", error);
    return null;
  }
};

export const updateUserProfile = async (name?: string, email?: string, photo?: File) => {
  try {
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (email) formData.append("email", email);
    if (photo) formData.append("photo", photo);

    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        // No incluir Content-Type para que el navegador lo configure automáticamente con boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    log.error("Error actualizando perfil de usuario", error);
    throw error;
  }
};

export const register = async (name: string, email: string, password: string, role: string, subjectId?: number) => {
  try {
    const requestBody: any = {
      name,
      email,
      password,
      role,
    };

    if (role === "MAESTRO" && subjectId) {
      requestBody.subjectId = subjectId;
    }

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    log.error("Error en registro", error, { name, email, role, subjectId });
    throw error;
  }
};

export const updateUserName = async (name: string) => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    log.error("Error actualizando nombre de usuario", error, { name });
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const response = await fetch(`${API_URL}/roles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    log.error("Error obteniendo roles", error);
    throw error;
  }
};

export interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  photoData?: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    log.error("Error obteniendo usuarios", error);
    throw error;
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    log.error("Error eliminando usuario", error, { userId });
    throw error;
  }
};
