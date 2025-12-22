export interface CreateContactPayload {
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface CreateContactResponse {
  id: string;
  ok: boolean;
}

export type ContactStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'SPAM';

export interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  status: ContactStatus;
  handledById: string | null;
  handledBy?: {
    id: string;
    email: string;
  };
  note: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactsQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: ContactStatus;
}

export interface UpdateContactPayload {
  status?: ContactStatus;
  handledById?: string | null;
  note?: string | null;
}

