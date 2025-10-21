import { API_ENDPOINTS } from "@/constants";
import api from "@/lib/axios";
import { Role } from "./types";
export const getRoles = async (): Promise<Role[]> => {
  const response = await api.get(API_ENDPOINTS.USER.ROLES);
  return response.data;
}