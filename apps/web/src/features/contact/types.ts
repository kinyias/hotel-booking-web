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
