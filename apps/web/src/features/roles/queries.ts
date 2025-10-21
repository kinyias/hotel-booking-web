import { useQuery } from "@tanstack/react-query";
import { getRoles } from "./api";

export const useRolesQuery = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });
}