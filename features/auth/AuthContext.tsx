'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types/auth';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isSupabaseActive: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isSupabaseActive = isSupabaseConfigured();

  useEffect(() => {
    const configured = isSupabaseConfigured();

    if (configured) {
      const supabase = getSupabase();
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              role: (session.user.user_metadata?.role as UserRole) || 'student',
              avatar_url: session.user.user_metadata?.avatar_url,
              created_at: session.user.created_at,
            });
          }
          setIsLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              role: (session.user.user_metadata?.role as UserRole) || 'student',
              avatar_url: session.user.user_metadata?.avatar_url,
              created_at: session.user.created_at,
            });
          } else {
            setUser(null);
          }
          setIsLoading(false);
        });

        return () => {
          authListener.subscription.unsubscribe();
        };
      }
    } else {
      // Demo fallback - load from localStorage safely on client after mount
      const timer = setTimeout(() => {
        try {
          const savedUser = localStorage.getItem('deeni_tutor_demo_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } catch {
          // ignore parse error
        }
        setIsLoading(false);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      }
    }

    // Demo fallback authentication
    const role: UserRole = email.includes('teacher') ? 'teacher' : email.includes('admin') ? 'admin' : 'student';
    const demoUser: UserProfile = {
      id: 'demo-' + Math.random().toString(36).substring(2, 9),
      email,
      full_name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
      role,
      country: 'United Kingdom',
      created_at: new Date().toISOString(),
    };
    setUser(demoUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('deeni_tutor_demo_user', JSON.stringify(demoUser));
    }
    return { success: true };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
            },
          },
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      }
    }

    const newUser: UserProfile = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      email,
      full_name: fullName,
      role,
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('deeni_tutor_demo_user', JSON.stringify(newUser));
    }
    return { success: true };
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('deeni_tutor_demo_user');
    }
  };

  const resetPasswordForEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      }
    }
    return { success: true };
  };

  const loginAsDemo = (role: UserRole) => {
    const demoUsers: Record<UserRole, UserProfile> = {
      student: {
        id: 'std-101',
        email: 'tariq.student@example.com',
        full_name: 'Tariq Rahman',
        role: 'student',
        country: 'United Kingdom (London)',
        timezone: 'Europe/London',
        created_at: '2026-01-15',
      },
      teacher: {
        id: 'tch-201',
        email: 'maulana.abdullah@deenitutor.com',
        full_name: 'Mawlana Abdullah Al-Mahmud',
        role: 'teacher',
        country: 'Bangladesh (Dhaka)',
        timezone: 'Asia/Dhaka',
        created_at: '2025-11-20',
      },
      admin: {
        id: 'adm-301',
        email: 'admin@deenitutor.com',
        full_name: 'Deeni Tutor Admin',
        role: 'admin',
        country: 'Bangladesh',
        timezone: 'Asia/Dhaka',
        created_at: '2025-01-01',
      },
      parent: {
        id: 'par-401',
        email: 'farhan.parent@example.com',
        full_name: 'Farhan & Ayesha Chowdhury',
        role: 'parent',
        country: 'United States (Texas)',
        timezone: 'America/Chicago',
        created_at: '2026-02-01',
      }
    };

    const targetUser = demoUsers[role];
    setUser(targetUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('deeni_tutor_demo_user', JSON.stringify(targetUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSupabaseActive,
        signIn,
        signUp,
        signOut,
        resetPasswordForEmail,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
