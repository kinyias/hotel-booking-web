export interface CommissionPackage {
  id: string;
  code: string;
  name: string;
  description?: string;
  commissionRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommissionPackageInput {
  code: string;
  name: string;
  description?: string;
  commissionRate: number;
  isActive?: boolean;
}

export interface UpdateCommissionPackageInput {
  code?: string;
  name?: string;
  description?: string;
  commissionRate?: number;
  isActive?: boolean;
}
