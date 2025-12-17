export interface Amenity {
  id: string;
  key: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface AmenitiesQueryParams {
  limit?: number;
  offset?: number;
  q?: string;
}