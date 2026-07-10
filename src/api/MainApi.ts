import { isAxiosError } from "axios";
import api from "../config/axios";
import type { User } from "../../src/types/types.ts";

export async function getUser() {
  
  try {
    const { data } = await api.get<{ user: User }>(`/api/v1/user/profile`)
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}
