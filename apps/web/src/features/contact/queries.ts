import { useQuery } from '@tanstack/react-query';
import { getContacts, getContactById } from './api';
import { ContactsQueryParams } from './types';

export const useContactsQuery = (params?: ContactsQueryParams) => {
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => getContacts(params),
  });
};

export const useContactQuery = (id: string) => {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => getContactById(id),
    enabled: !!id,
  });
};
