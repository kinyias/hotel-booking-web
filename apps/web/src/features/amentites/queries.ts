import { useQuery } from "@tanstack/react-query";
import { getAmenities, getAmentityById } from "./api";
import { AmenitiesQueryParams } from "./types";

export const useGetAmenitiesQuery = (params?: AmenitiesQueryParams) => {
  return useQuery({
    queryKey: ['amenities', params],
    queryFn: () => getAmenities(params),
  });
};

export const useGetAmenityByIdQuery = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['amenity', id],
    queryFn: () => getAmentityById(id),
    enabled,
  });
};
