import type { UserRole } from '@/lib/constants';

export interface UserProfile {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
