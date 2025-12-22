export type PolicyType = 'CHECKIN' | 'CANCELLATION' | 'PAYMENT' | 'CHILDREN' | 'PET' | 'SMOKING' | 'GENERAL';

export interface Policy {
  id: string;
  hotelId: string;
  type: PolicyType;
  title: string;
  content: string;
  enabled: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePolicyPayload {
  type: PolicyType;
  title: string;
  content: string;
  enabled?: boolean;
  order?: number;
}

export interface UpdatePolicyPayload {
  type?: PolicyType;
  title?: string;
  content?: string;
  enabled?: boolean;
  order?: number;
}
