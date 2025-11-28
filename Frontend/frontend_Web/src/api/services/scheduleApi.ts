import { SCHEDULE_CRUD_END_POINTS } from "../constants/Endpoint";
import { getAuthHeaders, getToken } from "../utils/authUtils";

export interface Schedule {
  id: number;
  courseId: number;
  teacherId?: number;
  subjectId?: number;
  day: string;
  startTime: string;
  endTime: string;
  scheduleName: string;
  teacherName?: string;
  subjectName?: string;
}

export const getAllSchedules = async (): Promise<Schedule[]> => {
  try {
    const response = await fetch(SCHEDULE_CRUD_END_POINTS, {
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
    console.error("Error al obtener horarios:", error.message);
    throw error;
  }
};

export const getSchedulesByCourse = async (courseId: number): Promise<Schedule[]> => {
  try {
    const response = await fetch(`${SCHEDULE_CRUD_END_POINTS}/by-course/${courseId}`, {
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
    console.error("Error al obtener horarios por curso:", error.message);
    throw error;
  }
};

export const createSchedule = async (schedule: Omit<Schedule, 'id'>): Promise<Schedule> => {
  try {
    const response = await fetch(SCHEDULE_CRUD_END_POINTS, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify([schedule]), // Enviar como array
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data[0]; // Retornar el primer elemento
  } catch (error: any) {
    console.error("Error al crear horario:", error.message);
    throw error;
  }
};

export const updateSchedule = async (id: number, schedule: Schedule): Promise<void> => {
  try {
    const headers = getAuthHeaders();
    console.log("Headers being sent:", headers);
    console.log("Token:", getToken());
    const response = await fetch(`${SCHEDULE_CRUD_END_POINTS}/${id}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error al actualizar horario:", error.message);
    throw error;
  }
};

export const deleteSchedule = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${SCHEDULE_CRUD_END_POINTS}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error al eliminar horario:", error.message);
    throw error;
  }
};
