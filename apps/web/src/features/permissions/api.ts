import { API_ENDPOINTS } from "@/constants";
import api from "@/lib/axios";
import { Permission } from "./types";
import { PermissionFormValues } from "./validator";
import { PaginatedResponse } from "@/types";
export const getPermissions = async (): Promise<PaginatedResponse<Permission>> => {
  const response = await api.get<PaginatedResponse<Permission>>(API_ENDPOINTS.USER.PERMISSIONS);
  return response.data;
}
export const createPermission = async (data: PermissionFormValues)=>{
  const response = await api.post(API_ENDPOINTS.USER.PERMISSIONS, data);
  return response.data
}
export const updatePermission = async(id: string, data: PermissionFormValues) => {
  const response = await api.patch(`${API_ENDPOINTS.USER.PERMISSIONS}/${id}`, data)
  return response.data;
}

export const deletePermission = async(id: string) =>{
    const response = await api.delete(`${API_ENDPOINTS.USER.PERMISSIONS}/${id}`)
    return response.data
}