import { useQuery } from "@tanstack/react-query";
import { getProfile, getUsers } from "./api";
import { UsersQueryParams } from "./types";

export const useUsersQuery = (params?: UsersQueryParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params), 
  });
};

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(), 
  });
};