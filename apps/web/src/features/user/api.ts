import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import { PaginatedResponse } from '@/types';
import { User } from './types';
import { UsersQueryParams } from './types';
import { ChangePasswordFormValues, UserFormValues } from './validator';

export const getUsers = async (params?: UsersQueryParams) => {
  const response = await api.get<PaginatedResponse<User>>(
    API_ENDPOINTS.USER.USERS,
    { params }
  );
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`${API_ENDPOINTS.USER.USERS}/${id}`);
  return response.data;
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  const response = await api.put(`${API_ENDPOINTS.USER.USERS}/${id}`, userData);
  return response.data;
};
export const getProfile = async () => {
  const response = await api.get<User>(API_ENDPOINTS.USER.PROFILE);
  return response.data;
};
export const updateProfile = async (data: UserFormValues) => {
  const response = await api.patch(API_ENDPOINTS.USER.PROFILE, data);
  return response.data;
};
export const changePassword = async (data: ChangePasswordFormValues) => {
  const response = await api.post(
    `${API_ENDPOINTS.USER.PROFILE}/change-password`,
    data
  );
  return response.data;
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(
    `${API_ENDPOINTS.USER.PROFILE}/avatar`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};
