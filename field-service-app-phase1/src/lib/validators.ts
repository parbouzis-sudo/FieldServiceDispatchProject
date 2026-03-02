import { z } from 'zod';
import {
  TRADE_TYPES,
  PRIORITIES,
  WORK_TYPES,
  PROPERTY_TYPES,
  EQUIPMENT_CATEGORIES,
} from './constants';

// ─── Reusable Primitives ────────────────────────────────────────────────────

export const emailSchema = z.string().email('Invalid email address');

export const phoneSchema = z
  .string()
  .regex(/^[\d\s()+-]+$/, 'Invalid phone number')
  .min(10, 'Phone number too short');

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  zip: z.string().min(1, 'ZIP/Postal code is required'),
  country: z.string().default('CA'),
});

// ─── Auth ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    organizationName: z.string().min(1, 'Organization name is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── Customers ──────────────────────────────────────────────────────────────

export const customerSchema = z
  .object({
    type: z.enum(['residential', 'commercial']),
    companyName: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: emailSchema.optional().or(z.literal('')),
    phone: z.string().optional(),
    secondaryPhone: z.string().optional(),
    billingAddress: addressSchema.optional(),
    tags: z.array(z.string()).default([]),
    notes: z.string().optional(),
    source: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'commercial') return !!data.companyName;
      return true;
    },
    { message: 'Company name is required for commercial customers', path: ['companyName'] }
  )
  .refine(
    (data) => {
      if (data.type === 'residential') return !!data.firstName;
      return true;
    },
    { message: 'First name is required for residential customers', path: ['firstName'] }
  );

// ─── Properties ─────────────────────────────────────────────────────────────

export const propertySchema = z.object({
  customerId: z.string().uuid('Select a customer'),
  name: z.string().optional(),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  zipCode: z.string().min(1, 'ZIP/Postal code is required'),
  country: z.string().default('CA'),
  propertyType: z.enum(PROPERTY_TYPES).optional(),
  accessNotes: z.string().optional(),
  squareFootage: z.number().positive().optional(),
  yearBuilt: z.number().min(1800).max(2030).optional(),
  unitCount: z.number().positive().optional(),
});

// ─── Equipment ──────────────────────────────────────────────────────────────

export const equipmentSchema = z.object({
  propertyId: z.string().uuid('Select a property'),
  name: z.string().min(1, 'Equipment name is required'),
  category: z.enum(EQUIPMENT_CATEGORIES),
  manufacturer: z.string().optional(),
  modelNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  installDate: z.string().optional(),
  warrantyExpiry: z.string().optional(),
  condition: z.enum(['excellent', 'good', 'fair', 'poor', 'critical']).optional(),
  locationDetail: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Work Orders ────────────────────────────────────────────────────────────

export const workOrderSchema = z.object({
  customerId: z.string().uuid('Select a customer'),
  propertyId: z.string().uuid('Select a property'),
  equipmentId: z.string().uuid().optional(),
  workType: z.enum(WORK_TYPES),
  tradeType: z.enum(TRADE_TYPES),
  priority: z.enum(PRIORITIES).default('normal'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  internalNotes: z.string().optional(),
  customerPo: z.string().optional(),
  estimatedDurationMin: z.number().min(15).default(60),
  requestedDate: z.string().optional(),
});

// ─── Export types ───────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type EquipmentInput = z.infer<typeof equipmentSchema>;
export type WorkOrderInput = z.infer<typeof workOrderSchema>;
