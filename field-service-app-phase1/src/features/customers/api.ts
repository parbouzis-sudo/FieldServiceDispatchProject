import { supabase } from '@/lib/supabase';
import type { Customer, CustomerFilters } from './types';
import type { CustomerInput } from '@/lib/validators';

// ─── Transform DB rows ↔ Frontend types ─────────────────────────────────────

function toCustomer(row: Record<string, unknown>): Customer {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    type: row.type as Customer['type'],
    companyName: row.company_name as string | null,
    firstName: row.first_name as string | null,
    lastName: row.last_name as string | null,
    displayName: row.display_name as string,
    email: row.email as string | null,
    phone: row.phone as string | null,
    secondaryPhone: row.secondary_phone as string | null,
    billingAddress: row.billing_address as Customer['billingAddress'],
    tags: (row.tags as string[]) ?? [],
    notes: row.notes as string | null,
    source: row.source as string | null,
    isActive: row.is_active as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ─── Queries ────────────────────────────────────────────────────────────────

export async function getCustomers(filters: CustomerFilters = {}): Promise<Customer[]> {
  let query = supabase
    .from('customers')
    .select('*')
    .order('display_name');

  if (filters.type && filters.type !== 'all') {
    query = query.eq('type', filters.type);
  }

  if (filters.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive);
  }

  if (filters.search) {
    query = query.textSearch('search_vector', filters.search, {
      type: 'websearch',
    });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toCustomer);
}

export async function getCustomer(id: string): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return toCustomer(data);
}

export async function createCustomer(input: CustomerInput): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .insert({
      type: input.type,
      company_name: input.companyName || null,
      first_name: input.firstName || null,
      last_name: input.lastName || null,
      email: input.email || null,
      phone: input.phone || null,
      secondary_phone: input.secondaryPhone || null,
      billing_address: input.billingAddress || null,
      tags: input.tags,
      notes: input.notes || null,
      source: input.source || null,
    })
    .select()
    .single();

  if (error) throw error;
  return toCustomer(data);
}

export async function updateCustomer(
  id: string,
  input: Partial<CustomerInput>
): Promise<Customer> {
  const updateData: Record<string, unknown> = {};

  if (input.type !== undefined) updateData.type = input.type;
  if (input.companyName !== undefined) updateData.company_name = input.companyName || null;
  if (input.firstName !== undefined) updateData.first_name = input.firstName || null;
  if (input.lastName !== undefined) updateData.last_name = input.lastName || null;
  if (input.email !== undefined) updateData.email = input.email || null;
  if (input.phone !== undefined) updateData.phone = input.phone || null;
  if (input.secondaryPhone !== undefined) updateData.secondary_phone = input.secondaryPhone || null;
  if (input.billingAddress !== undefined) updateData.billing_address = input.billingAddress || null;
  if (input.tags !== undefined) updateData.tags = input.tags;
  if (input.notes !== undefined) updateData.notes = input.notes || null;
  if (input.source !== undefined) updateData.source = input.source || null;

  const { data, error } = await supabase
    .from('customers')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return toCustomer(data);
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) throw error;
}
