import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getGuestToken, tokens } from '../utils/api';
import type { User } from '../types/api';

export interface RegisterInput {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isStaff: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
  setUser: (u: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokens.access) {
      setLoading(false);
      return;
    }
    api<User>('/api/auth/profile/').
    then(setUser).
    catch(() => tokens.clear()).
    finally(() => setLoading(false));
  }, []);

  const finishAuth = useCallback(async (t: AuthTokens) => {
    tokens.set(t.access, t.refresh);
    setUser(t.user);
    try {
      await api('/api/cart/merge/', { method: 'POST', body: { guest_token: getGuestToken() } });
    } catch {

      /* merge is best-effort */}
    window.dispatchEvent(new Event('av:auth-changed'));
    return t.user;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api<{data?: AuthTokens;} & Partial<AuthTokens>>('/api/auth/login/', {
        method: 'POST',
        body: { email, password }
      });
      const t = res.data ?? res as AuthTokens;
      return finishAuth(t);
    },
    [finishAuth]
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const res = await api<{data?: AuthTokens;} & Partial<AuthTokens>>('/api/auth/register/', {
        method: 'POST',
        body: input
      });
      const t = res.data ?? res as AuthTokens;
      return finishAuth(t);
    },
    [finishAuth]
  );

  const logout = useCallback(() => {
    tokens.clear();
    setUser(null);
    window.dispatchEvent(new Event('av:auth-changed'));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isStaff: user?.role === 'ADMIN' || user?.role === 'STAFF',
      login,
      register,
      logout,
      setUser
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}