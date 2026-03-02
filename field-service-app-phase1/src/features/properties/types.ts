import type { PropertyType } from '@/lib/constants';

export interface Property {
  id: string;
  organizationId: string;
  customerId: string;
  name: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  fullAddress: string;
  latitude: number | null;
  longitude: number | null;
  propertyType: PropertyType | null;
  accessNotes: string | null;
  squareFootage: number | null;
  yearBuilt: number | null;
  unitCount: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  customerDisplayName?: string;
}

export interface PropertyFilters {
  search?: string;
  customerId?: string;
  propertyType?: string;
}

export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: PropertyFilters) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
};
