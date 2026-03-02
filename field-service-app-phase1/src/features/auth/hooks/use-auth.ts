import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '../types';
import type { Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, email: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Failed to fetch user profile:', error);
      setUser(null);
      return;
    }

    setUser({
      id: data.id,
      organizationId: data.organization_id,
      firstName: data.first_name,
      lastName: data.last_name,
      fullName: data.full_name,
      email,
      phone: data.phone,
      avatarUrl: data.avatar_url,
      role: data.role,
      isActive: data.is_active,
      lastLoginAt: data.last_login_at,
      createdAt: data.created_at,
    });
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id, currentSession.user.email ?? '');
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        fetchProfile(newSession.user.id, newSession.user.email ?? '');
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (
    email: string,
    password: string,
    metadata: { firstName: string; lastName: string; organizationName: string }
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: metadata.firstName,
          last_name: metadata.lastName,
          organization_name: metadata.organizationName,
        },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    signIn,
    signUp,
    signOut,
  };
}
