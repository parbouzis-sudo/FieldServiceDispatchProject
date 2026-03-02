import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { propertyKeys, type PropertyFilters } from '../types';
import * as api from '../api';
import type { PropertyInput } from '@/lib/validators';

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: () => api.getProperties(filters),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => api.getProperty(id),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PropertyInput) => api.createProperty(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      toast.success('Property created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create property: ${error.message}`);
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<PropertyInput> }) =>
      api.updateProperty(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.setQueryData(propertyKeys.detail(data.id), data);
      toast.success('Property updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update property: ${error.message}`);
    },
  });
}
