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