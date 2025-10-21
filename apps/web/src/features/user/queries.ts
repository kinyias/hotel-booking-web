import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./api";

export interface UsersQueryParams {
  limit?: number;
  offset?: number;
  q?: string;
  role?: string;
}

export const useUsersQuery = (params?: UsersQueryParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params), 
  });
};
