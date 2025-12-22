import api from '@/lib/axios';
import { Policy, CreatePolicyPayload, UpdatePolicyPayload } from './types';

export const getPoliciesByHotel = async (hotelId: string) => {
  const response = await api.get<Policy[]>(`/admin/hotels/${hotelId}/policies`);
  return response.data;
};

export const getPolicyById = async (hotelId: string, policyId: string) => {
  const response = await api.get<Policy>(`/admin/hotels/${hotelId}/policies/${policyId}`);
  return response.data;
};

export const createPolicy = async (hotelId: string, payload: CreatePolicyPayload) => {
  const response = await api.post<Policy>(`/admin/hotels/${hotelId}/policies`, payload);
  return response.data;
};

export const updatePolicy = async (hotelId: string, policyId: string, payload: UpdatePolicyPayload) => {
  const response = await api.patch<Policy>(`/admin/hotels/${hotelId}/policies/${policyId}`, payload);
  return response.data;
};

export const deletePolicy = async (hotelId: string, policyId: string) => {
  const response = await api.delete(`/admin/hotels/${hotelId}/policies/${policyId}`);
  return response.data;
};
