import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import {
  CommissionPackage,
  CreateCommissionPackageInput,
  UpdateCommissionPackageInput,
} from './types';

export const getCommissionPackages = async () => {
  const response = await api.get<CommissionPackage[]>(
    API_ENDPOINTS.COMMISSION_PACKAGES.COMMISSION_PACKAGES
  );
  return response.data;
};

export const getCommissionPackageById = async (id: string) => {
  const response = await api.get<CommissionPackage>(
    `${API_ENDPOINTS.COMMISSION_PACKAGES.COMMISSION_PACKAGES}/${id}`
  );
  return response.data;
};

export const createCommissionPackage = async (
  payload: CreateCommissionPackageInput
) => {
  const response = await api.post<CommissionPackage>(
    API_ENDPOINTS.COMMISSION_PACKAGES.COMMISSION_PACKAGES,
    payload
  );
  return response.data;
};

export const updateCommissionPackage = async (
  id: string,
  payload: UpdateCommissionPackageInput
) => {
  const response = await api.patch<CommissionPackage>(
    `${API_ENDPOINTS.COMMISSION_PACKAGES.COMMISSION_PACKAGES}/${id}`,
    payload
  );
  return response.data;
};

export const deactivateCommissionPackage = async (id: string) => {
  const response = await api.patch<CommissionPackage>(
    `${API_ENDPOINTS.COMMISSION_PACKAGES.COMMISSION_PACKAGES}/${id}/deactivate`
  );
  return response.data;
};

export const setHotelCommissionPackage = async (
  hotelId: string,
  commissionPackageId: string
) => {
  const response = await api.patch<CommissionPackage>(
    `${API_ENDPOINTS.COMMISSION_PACKAGES.COMMISSION_PACKAGES}/${hotelId}/commission-package`,
    { commissionPackageId }
  );
  return response.data;
};

export interface CommissionRevenueParams {
  year?: string;
  from?: string;
  to?: string;
}

export const getCommissionRevenue = async (params?: CommissionRevenueParams) => {
  const response = await api.get<number[] | { date: string; revenue: number }[]>(
    `${API_ENDPOINTS.COMMISSION_PACKAGES.COMMISSION_PACKAGES}/revenue/chart`,
    { params }
  );
  return response.data;
};

