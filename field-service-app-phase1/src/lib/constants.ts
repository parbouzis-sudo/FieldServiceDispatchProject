// ─── Work Order Statuses ────────────────────────────────────────────────────

export const WORK_ORDER_STATUSES = [
  'new',
  'scheduled',
  'dispatched',
  'en_route',
  'in_progress',
  'on_hold',
  'pending_parts',
  'pending_approval',
  'completed',
  'invoiced',
  'cancelled',
] as const;

export type WorkOrderStatus = (typeof WORK_ORDER_STATUSES)[number];

export const WORK_ORDER_STATUS_CONFIG: Record<
  WorkOrderStatus,
  { label: string; color: string; bgColor: string }
> = {
  new: { label: 'New', color: 'text-slate-700', bgColor: 'bg-slate-100' },
  scheduled: { label: 'Scheduled', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  dispatched: { label: 'Dispatched', color: 'text-violet-700', bgColor: 'bg-violet-100' },
  en_route: { label: 'En Route', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  in_progress: { label: 'In Progress', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  on_hold: { label: 'On Hold', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  pending_parts: { label: 'Pending Parts', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  pending_approval: { label: 'Pending Approval', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  completed: { label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-100' },
  invoiced: { label: 'Invoiced', color: 'text-teal-700', bgColor: 'bg-teal-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bgColor: 'bg-red-100' },
};

// ─── Trade Types ────────────────────────────────────────────────────────────

export const TRADE_TYPES = [
  'hvac',
  'plumbing',
  'electrical',
  'cleaning',
  'general_contracting',
  'mechanical',
  'heating',
  'other',
] as const;

export type TradeType = (typeof TRADE_TYPES)[number];

export const TRADE_TYPE_CONFIG: Record<
  TradeType,
  { label: string; icon: string; color: string }
> = {
  hvac: { label: 'HVAC', icon: 'Wind', color: 'text-sky-600' },
  plumbing: { label: 'Plumbing', icon: 'Droplets', color: 'text-blue-600' },
  electrical: { label: 'Electrical', icon: 'Zap', color: 'text-yellow-600' },
  cleaning: { label: 'Cleaning', icon: 'Sparkles', color: 'text-emerald-600' },
  general_contracting: { label: 'General', icon: 'Hammer', color: 'text-stone-600' },
  mechanical: { label: 'Mechanical', icon: 'Wrench', color: 'text-slate-600' },
  heating: { label: 'Heating', icon: 'Flame', color: 'text-orange-600' },
  other: { label: 'Other', icon: 'MoreHorizontal', color: 'text-gray-600' },
};

// ─── Priorities ─────────────────────────────────────────────────────────────

export const PRIORITIES = ['low', 'normal', 'high', 'emergency'] as const;

export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bgColor: string }
> = {
  low: { label: 'Low', color: 'text-slate-600', bgColor: 'bg-slate-100' },
  normal: { label: 'Normal', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  high: { label: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  emergency: { label: 'Emergency', color: 'text-red-600', bgColor: 'bg-red-100' },
};

// ─── Work Types ─────────────────────────────────────────────────────────────

export const WORK_TYPES = [
  'service_call',
  'repair',
  'installation',
  'maintenance',
  'inspection',
  'emergency',
  'estimate_only',
] as const;

export type WorkType = (typeof WORK_TYPES)[number];

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  service_call: 'Service Call',
  repair: 'Repair',
  installation: 'Installation',
  maintenance: 'Maintenance',
  inspection: 'Inspection',
  emergency: 'Emergency',
  estimate_only: 'Estimate Only',
};

// ─── User Roles ─────────────────────────────────────────────────────────────

export const USER_ROLES = [
  'owner',
  'admin',
  'dispatcher',
  'technician',
  'office_staff',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  dispatcher: 'Dispatcher',
  technician: 'Technician',
  office_staff: 'Office Staff',
};

// ─── Property Types ─────────────────────────────────────────────────────────

export const PROPERTY_TYPES = [
  'single_family',
  'multi_family',
  'condo',
  'commercial_office',
  'retail',
  'industrial',
  'warehouse',
  'mixed_use',
  'other',
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  single_family: 'Single Family',
  multi_family: 'Multi-Family',
  condo: 'Condo',
  commercial_office: 'Commercial Office',
  retail: 'Retail',
  industrial: 'Industrial',
  warehouse: 'Warehouse',
  mixed_use: 'Mixed Use',
  other: 'Other',
};

// ─── Equipment Categories ───────────────────────────────────────────────────

export const EQUIPMENT_CATEGORIES = [
  'hvac',
  'boiler',
  'chiller',
  'furnace',
  'heat_pump',
  'water_heater',
  'plumbing_fixture',
  'electrical_panel',
  'generator',
  'elevator',
  'fire_system',
  'other',
] as const;

export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number];

// ─── Technician Statuses ────────────────────────────────────────────────────

export const TECHNICIAN_STATUSES = [
  'available',
  'on_job',
  'en_route',
  'on_break',
  'off_duty',
] as const;

export type TechnicianStatus = (typeof TECHNICIAN_STATUSES)[number];

export const TECHNICIAN_STATUS_CONFIG: Record<
  TechnicianStatus,
  { label: string; color: string; bgColor: string }
> = {
  available: { label: 'Available', color: 'text-green-700', bgColor: 'bg-green-100' },
  on_job: { label: 'On Job', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  en_route: { label: 'En Route', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  on_break: { label: 'On Break', color: 'text-slate-700', bgColor: 'bg-slate-100' },
  off_duty: { label: 'Off Duty', color: 'text-gray-500', bgColor: 'bg-gray-100' },
};

// ─── App Constants ──────────────────────────────────────────────────────────

export const APP_NAME = 'Field Service Dispatch';
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_FILE_SIZE_MB = 10;
