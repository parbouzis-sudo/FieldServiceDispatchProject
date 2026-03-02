import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { customerKeys, type CustomerFilters } from '../types';
import * as api from '../api';
import type { CustomerInput } from '@/lib/validators';

export function useCustomers(filters: CustomerFilters = {}) {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => api.getCustomers(filters),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => api.getCustomer(id),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CustomerInput) => api.createCustomer(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('Customer created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create customer: ${error.message}`);
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CustomerInput> }) =>
      api.updateCustomer(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.setQueryData(customerKeys.detail(data.id), data);
      toast.success('Customer updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update customer: ${error.message}`);
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('Customer deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete customer: ${error.message}`);
    },
  });
}
