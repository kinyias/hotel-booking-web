import api from '@/lib/axios';
import { PaginatedResponse } from '@/types';
import { Contact, ContactsQueryParams, CreateContactPayload, CreateContactResponse, UpdateContactPayload } from './types';

export const createContact = async (payload: CreateContactPayload) => {
  const response = await api.post<CreateContactResponse>('/contact', payload);
  return response.data;
};

export const getContacts = async (params?: ContactsQueryParams) => {
  const response = await api.get<PaginatedResponse<Contact>>('/admin/contacts', { params });
  return response.data;
};

export const getContactById = async (id: string) => {
  const response = await api.get<Contact>(`/admin/contacts/${id}`);
  return response.data;
};

export const updateContact = async (id: string, payload: UpdateContactPayload) => {
  const response = await api.patch<Contact>(`/admin/contacts/${id}`, payload);
  return response.data;
};
