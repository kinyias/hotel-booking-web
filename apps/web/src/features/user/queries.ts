import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./api";
import { UsersQueryParams } from "./types";

export const useUsersQuery = (params?: UsersQueryParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params), 
  });
};
