export interface Avatar {
  id: string;
  url: string;
  secureUrl: string;
  publicId: string;
}
export interface Role {
  id: string;
  name: string;
}
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
  avatar: Avatar;
  allowedActions: string[];
}
export interface UsersQueryParams {
  limit?: number;
  offset?: number;
  q?: string;
  role?: string;
}