import { supabase } from '@/lib/supabase';
import type { Property, PropertyFilters } from './types';
import type { PropertyInput } from '@/lib/validators';

function toProperty(row: Record<string, unknown>): Property {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    customerId: row.customer_id as string,
    name: row.name as string | null,
    addressLine1: row.address_line1 as string,
    addressLine2: row.address_line2 as string | null,
    city: row.city as string,
    state: row.state as string,
    zipCode: row.zip_code as string,
    country: row.country as string,
    fullAddress: row.full_address as string,
    latitude: row.latitude as number | null,
    longitude: row.longitude as number | null,
    propertyType: row.property_type as Property['propertyType'],
    accessNotes: row.access_notes as string | null,
    squareFootage: row.square_footage as number | null,
    yearBuilt: row.year_built as number | null,
    unitCount: row.unit_count as number | null,
    isActive: row.is_active as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    customerDisplayName: (row as Record<string, unknown>).customers
      ? ((row as Record<string, Record<string, unknown>>).customers?.display_name as string)
      : undefined,
  };
}

export async function getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
  let query = supabase
    .from('properties')
    .select('*, customers(display_name)')
    .order('city')
    .order('address_line1');

  if (filters.customerId) {
    query = query.eq('customer_id', filters.customerId);
  }
  if (filters.propertyType) {
    query = query.eq('property_type', filters.propertyType);
  }
  if (filters.search) {
    query = query.textSearch('search_vector', filters.search, { type: 'websearch' });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toProperty);
}

export async function getProperty(id: string): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .select('*, customers(display_name)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return toProperty(data);
}

export async function createProperty(input: PropertyInput): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .insert({
      customer_id: input.customerId,
      name: input.name || null,
      address_line1: input.addressLine1,
      address_line2: input.addressLine2 || null,
      city: input.city,
      state: input.state,
      zip_code: input.zipCode,
      country: input.country,
      property_type: input.propertyType || null,
      access_notes: input.accessNotes || null,
      square_footage: input.squareFootage || null,
      year_built: input.yearBuilt || null,
      unit_count: input.unitCount || null,
    })
    .select('*, customers(display_name)')
    .single();
  if (error) throw error;
  return toProperty(data);
}

export async function updateProperty(id: string, input: Partial<PropertyInput>): Promise<Property> {
  const updateData: Record<string, unknown> = {};
  if (input.name !== undefined) updateData.name = input.name || null;
  if (input.addressLine1 !== undefined) updateData.address_line1 = input.addressLine1;
  if (input.addressLine2 !== undefined) updateData.address_line2 = input.addressLine2 || null;
  if (input.city !== undefined) updateData.city = input.city;
  if (input.state !== undefined) updateData.state = input.state;
  if (input.zipCode !== undefined) updateData.zip_code = input.zipCode;
  if (input.propertyType !== undefined) updateData.property_type = input.propertyType || null;
  if (input.accessNotes !== undefined) updateData.access_notes = input.accessNotes || null;
  if (input.squareFootage !== undefined) updateData.square_footage = input.squareFootage || null;
  if (input.yearBuilt !== undefined) updateData.year_built = input.yearBuilt || null;

  const { data, error } = await supabase
    .from('properties')
    .update(updateData)
    .eq('id', id)
    .select('*, customers(display_name)')
    .single();
  if (error) throw error;
  return toProperty(data);
}
