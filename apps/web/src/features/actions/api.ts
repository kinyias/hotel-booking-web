import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios'

export const getActions = async () => {
  const response = await api.get(API_ENDPOINTS.USER.ACTIONS);
  return response.data;
}
export const assignPermissionToAction = async (actionId: string, permissionIds: string[]) => {
  const response = await api.patch(`${API_ENDPOINTS.USER.ACTIONS}/${actionId}/permissions`, {
    permissionIds
  });
  return response.data;
}