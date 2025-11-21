/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 14-11-2025
 * Update at: 19-11-2025
 * Description: React context and provider for managing user authentication state, including login, logout, registration, and role-based access control.
 */


'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';


function parseApiError(data: any, fallback: string) {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (data.detail) {
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) {
      try {
        return data.detail.map((d: any) => (d.msg || d.message || JSON.stringify(d))).join('; ');
      } catch {
        return JSON.stringify(data.detail);
      }
    }
    if (typeof data.detail === 'object') {
      try { return Object.values(data.detail).join('; '); } catch { /* noop */ }
    }
  }
  if (data.message) return data.message;
  return fallback;
}

interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  phone: string;
  is_admin: boolean;
}

interface RegisterData {
  email: string;
  username: string;
  full_name: string;
  phone: string;
  latitude: number;
  longitude: number;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true for initial auth check
  const router = useRouter();


  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await fetch('http://163.61.183.90:8001/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('auth_token');
            setUser(null);
          }
        } catch (error) {
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://163.61.183.90:8001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(parseApiError(data, 'Login failed'));
      }

      const token = data.token || data.access_token || data.jwt || '';
      const rawUser = data.user || data.data?.user || data.user_info || data.profile || data;
      const userData: User = {
        id: rawUser.id ?? '',
        email: rawUser.email ?? '',
        username: rawUser.username ?? '',
        full_name: rawUser.full_name ?? rawUser.name ?? '',
        phone: rawUser.phone ?? '',
        is_admin: Boolean(rawUser.is_admin ?? (rawUser.role === 'admin')),
      };

      setUser(userData);
      if (token) localStorage.setItem('auth_token', token);

      if (userData.is_admin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData: RegisterData) => {
    setLoading(true);
    try {
      const response = await fetch('http://163.61.183.90:8001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...registerData, is_admin: false })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(parseApiError(data, 'Registration failed'));
      }

      // After successful registration, log the user in
      await login(registerData.email, registerData.password);

    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: !!user?.is_admin,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
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

