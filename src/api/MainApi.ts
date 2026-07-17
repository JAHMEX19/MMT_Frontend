import { isAxiosError } from "axios";
import api from "../config/axios";
import type { IUserResponse } from "../types/types.ts";

/**
 * Obtiene el perfil del usuario autenticado
 */
export async function getUser(): Promise<IUserResponse> {
  try {
    // Al pasar <IUserResponse>, le decimos a Axios que 'data' cumple exactamente con esa interfaz
    const { data } = await api.get<IUserResponse>(`/api/v1/user/profile`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error al obtener perfil", { cause: error });
    }
    throw error;
  }
}

/**
 * Obtiene los departamentos reales asociados a una empresa específica
 * @param companyId ID de la compañía seleccionada
 */
export const getCanvasDetails = async (companyId: string) => {
  try {
    const { data } = await api.get(`/api/v1/department/company/${companyId}`); 
    return data; // Retorna { departments: [...] }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error al obtener los detalles del lienzo", { cause: error });
    }
    throw error;
  }
};

/**
 * Obtiene los procesos secuenciales asociados a un departamento específico
 * @param departmentId ID del departamento (nodo de área de trabajo)
 */
export const getProcessesByDepartment = async (departmentId: string) => {
  try {
    // Apunta de forma reactiva al endpoint vertical de la cadena de valor
    const { data } = await api.get(`/api/v1/process/department/${departmentId}`);
    return data; // Retorna { processes: [...] } según el controlador de MMT backend
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Error al obtener la cadena de procesos operativos",
        { cause: error }
      );
    }
    throw error;
  }
};