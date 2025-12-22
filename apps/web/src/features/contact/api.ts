import api from '@/lib/axios';
import { CreateContactPayload, CreateContactResponse } from './types';

export const createContact = async (payload: CreateContactPayload) => {
  const response = await api.post<CreateContactResponse>('/contact', payload);
  return response.data;
};
