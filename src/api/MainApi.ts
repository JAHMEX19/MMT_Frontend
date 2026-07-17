import { isAxiosError } from "axios";
import api from "../config/axios";
import type { IUserResponse } from "../types/types.ts";

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

// Petición corregida para obtener los departamentos reales de una empresa específica
export const getCanvasDetails = async (companyId: string) => {
  // ELIMINADOS LOS DOS PUNTOS (:) DE LA RUTA
  const { data } = await api.get(`/api/v1/department/company/${companyId}`); 
  return data; // Retorna { departments: [...] }
};