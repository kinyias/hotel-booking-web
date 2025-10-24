import { useQuery } from "@tanstack/react-query";
import { getActions } from "./api";

export const useActionsQuery = () => {
  return useQuery({
    queryKey: ['actions'],
    queryFn: getActions,
  });
}