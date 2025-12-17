import api from "@/lib/axios";
import { PaginatedResponse } from "@/types";
import { AmenitiesQueryParams, Amenity } from "./types";
import { API_ENDPOINTS } from "@/constants";
import { AmenityFormSchema } from "./validator";

export const getAmenities = async (params?: AmenitiesQueryParams) => {
  const response = await api.get<PaginatedResponse<Amenity>>(
    API_ENDPOINTS.AMENITIES.AMENITIES,
    { params }
  );
  return response.data;
};

export const getAmentityById = async (id: string) => {
  const response = await api.get<Amenity>(
    `${API_ENDPOINTS.AMENITIES.AMENITIES}/${id}`
  );
  return response.data;
};

export const createAmentity = async (amenity: AmenityFormSchema) => {
  const response = await api.post<Amenity>(
    API_ENDPOINTS.AMENITIES.AMENITIES,
    amenity
  );
  return response.data;
};

export const updateAmentity = async (id: string, amenity: AmenityFormSchema) => {
    const response = await api.patch<Amenity>(
        `${API_ENDPOINTS.AMENITIES.AMENITIES}/${id}`,
        amenity
    );
    return response.data;
};