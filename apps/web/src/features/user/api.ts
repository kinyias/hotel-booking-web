import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import { PaginatedResponse } from '@/types';
import { User } from './types';
import { UsersQueryParams } from './queries';

export const getUsers = async (params?: UsersQueryParams) => {
  const response = await api.get<PaginatedResponse<User>>(API_ENDPOINTS.USER.USERS, {params});
  return response.data;
}

export const deleteUser = async (id: string) => {
  const response = await api.delete(`${API_ENDPOINTS.USER.USERS}/${id}`);
  return response.data;
}

export const updateUser = async (id: string, userData: Partial<User>) => {
  const response = await api.put(`${API_ENDPOINTS.USER.USERS}/${id}`, userData);
  return response.data;
}