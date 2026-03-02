export interface Customer {
  id: string;
  organizationId: string;
  type: 'residential' | 'commercial';
  companyName: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  email: string | null;
  phone: string | null;
  secondaryPhone: string | null;
  billingAddress: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  } | null;
  tags: string[];
  notes: string | null;
  source: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilters {
  search?: string;
  type?: 'residential' | 'commercial' | 'all';
  isActive?: boolean;
  tags?: string[];
}

/** Query key factory for consistent caching */
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: CustomerFilters) => [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};
