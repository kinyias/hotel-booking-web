import { useQuery } from "@tanstack/react-query";
import { getPermissions } from "./api";

export const usePermissionsQuery = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  });
}