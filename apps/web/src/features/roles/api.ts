import { API_ENDPOINTS } from "@/constants";
import api from "@/lib/axios";
import { Role } from "./types";
import { RoleFormValues } from "./validator";
export const getRoles = async (): Promise<Role[]> => {
  const response = await api.get(API_ENDPOINTS.USER.ROLES);
  return response.data;
}
export const createRole = async (data: RoleFormValues)=>{
  const response = await api.post(API_ENDPOINTS.USER.ROLES, data);
  return response.data
}
export const updateRole = async(id: string, data: RoleFormValues) => {
  const response = await api.patch(`${API_ENDPOINTS.USER.ROLES}/${id}`, data)
  return response.data;
}