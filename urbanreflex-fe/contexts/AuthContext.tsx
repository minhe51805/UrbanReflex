/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 14-11-2025
 * Update at: 01-12-2025
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
        } catch (error: any) {
          // Silently handle connection errors - server might not be available
          if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
            // Server not available, just clear token silently
            localStorage.removeItem('auth_token');
            setUser(null);
          } else {
            console.error('Auth check error:', error);
            localStorage.removeItem('auth_token');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      // Try different request formats - API might accept username, email, or identifier
      // Based on user data: email: "admin@gmail.com", username: "admin123"
      // Try username first (most common for admin accounts)
      let response: Response | null = null;
      let data: any = null;

      // Strategy: Try different formats based on backend API requirements
      // Backend might expect: username/password OR email/password OR OAuth2 form data
      let lastError: any = null;
      let success = false;

      // Try JSON formats first (backend seems to require JSON, not form-urlencoded)
      // Based on error logs, backend REQUIRES 'identifier' field (not email/username)
      const jsonAttempts = [
        { identifier: identifier, password },     // Backend requires 'identifier' field
        { email: identifier, password },         // Fallback: try email
        { username: identifier, password },       // Fallback: try username
        { login: identifier, password },          // Fallback: try login
        { user: identifier, password },           // Fallback: try user
        { email_or_username: identifier, password }, // Fallback: try email_or_username
      ];

      // Try OAuth2 form-urlencoded as fallback (if JSON doesn't work)
      let triedOAuth2 = false;

      for (const attempt of jsonAttempts) {
        try {
          console.log(`Trying login with format:`, Object.keys(attempt)[0]);

          response = await fetch('http://163.61.183.90:8001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attempt)
          });

          data = await response.json();

          // Log response for debugging
          if (!response.ok) {
            console.log('Login attempt failed:', {
              format: Object.keys(attempt)[0],
              status: response.status,
              data,
              detail: data?.detail
            });

            // Log validation errors in detail
            if (response.status === 422 && data.detail) {
              console.error('Validation error:', data.detail);
              if (Array.isArray(data.detail)) {
                data.detail.forEach((err: any, idx: number) => {
                  const fieldPath = err.loc?.join('.') || 'unknown';
                  const fieldName = err.loc?.[err.loc.length - 1] || 'unknown';
                  console.error(`  Error ${idx + 1}:`, {
                    field: fieldName,
                    path: fieldPath,
                    msg: err.msg,
                    type: err.type,
                    ctx: err.ctx,
                    fullError: JSON.stringify(err, null, 2)
                  });
                  console.error(`    Missing field: ${fieldName} at path: ${fieldPath}`);
                });
              } else {
                console.error('  Full detail:', JSON.stringify(data.detail, null, 2));
              }
            }
          }
        } catch (fetchError: any) {
          // Handle network errors
          if (fetchError.message?.includes('Failed to fetch') || fetchError.message?.includes('ERR_CONNECTION_REFUSED')) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối hoặc liên hệ quản trị viên.');
          }
          throw fetchError;
        }

        if (response.ok) {
          // Success! Break out of loop
          success = true;
          console.log('✅ Login successful with format:', Object.keys(attempt)[0]);
          break;
        }

        // If 422, try next format
        if (response.status === 422) {
          lastError = data;
          continue;
        }

        // For other errors, throw immediately
        throw new Error(parseApiError(data, 'Login failed'));
      }

      // If JSON formats didn't work, try OAuth2 form-urlencoded as last resort
      if (!success && !triedOAuth2) {
        triedOAuth2 = true;
        try {
          const formData = new URLSearchParams();
          formData.append('username', identifier);
          formData.append('password', password);
          formData.append('grant_type', 'password');

          response = await fetch('http://163.61.183.90:8001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
          });

          data = await response.json();

          if (response.ok) {
            success = true;
          } else {
            lastError = data;
          }
        } catch (formError: any) {
          console.log('OAuth2 form-urlencoded attempt failed:', formError);
        }
      }

      // If we tried all formats and still failed
      if (!success || !response || !response.ok) {
        console.error('Login error after all attempts:', {
          status: response?.status,
          data: lastError || data,
          attempts: jsonAttempts
        });

        // Provide more helpful error message
        const errorMsg = parseApiError(lastError || data, 'Login failed');
        if (response?.status === 422) {
          // 422 usually means validation error - show details
          const detail = lastError?.detail || data?.detail;

          // Log full error for debugging
          console.error('Full 422 error details:', {
            detail,
            lastError,
            data,
            responseStatus: response?.status
          });

          if (Array.isArray(detail) && detail.length > 0) {
            // Format validation errors nicely
            const errors = detail.map((err: any) => {
              const field = err.loc?.join('.') || err.field || err.ctx?.field || 'field';
              const msg = err.msg || err.message || err.type || JSON.stringify(err);
              return `${field}: ${msg}`;
            }).join('; ');
            throw new Error(`Lỗi xác thực: ${errors}`);
          } else if (typeof detail === 'string') {
            throw new Error(detail);
          } else if (detail) {
            // Try to extract meaningful error from detail object
            const detailStr = typeof detail === 'object'
              ? Object.entries(detail).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('; ')
              : JSON.stringify(detail);
            throw new Error(`Lỗi xác thực: ${detailStr}`);
          }
        }
        throw new Error(errorMsg || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
      }

      // Handle successful response
      const token = data.token || data.access_token || data.jwt || '';
      let rawUser = data.user || data.data?.user || data.user_info || data.profile || data;

      // If we have a token, always call /auth/me to get the canonical user (includes role/is_admin)
      if (token) {
        try {
          // Tạm thời lưu token để /auth/me có thể dùng được nếu server yêu cầu
          localStorage.setItem('auth_token', token);

          const meResponse = await fetch('http://163.61.183.90:8001/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });

          if (meResponse.ok) {
            const meData = await meResponse.json();
            console.log('ℹ️ /auth/me user info:', meData);
            rawUser = meData || rawUser;
          } else {
            console.warn('⚠️ /auth/me failed, using login response user data. Status:', meResponse.status);
          }
        } catch (meError) {
          console.warn('⚠️ Error calling /auth/me:', meError);
        }
      }

      // Check admin status from multiple possible fields (after /auth/me)
      const isAdminUser = Boolean(
        rawUser?.is_admin ||
        rawUser?.isAdmin ||
        rawUser?.role === 'admin' ||
        rawUser?.role === 'Admin' ||
        rawUser?.user_type === 'admin' ||
        rawUser?.is_superuser ||
        rawUser?.superuser
      );

      const userData: User = {
        id: rawUser?.id ?? rawUser?._id ?? '',
        email: rawUser?.email ?? '',
        username: rawUser?.username ?? '',
        full_name: rawUser?.full_name ?? rawUser?.name ?? '',
        phone: rawUser?.phone ?? '',
        is_admin: isAdminUser,
      };

      console.log('Login successful:', {
        username: userData.username,
        email: userData.email,
        is_admin: userData.is_admin,
        rawUser: rawUser,
        isAdminUser: isAdminUser,
        adminFields: {
          is_admin: rawUser.is_admin,
          isAdmin: rawUser.isAdmin,
          role: rawUser.role,
          user_type: rawUser.user_type,
          is_superuser: rawUser.is_superuser,
        }
      });

      setUser(userData);
      if (token) localStorage.setItem('auth_token', token);

      // Admin always goes to admin dashboard - redirect immediately, skip home page
      if (userData.is_admin || isAdminUser) {
        console.log('✅ Admin detected - Redirecting to /admin dashboard immediately...');
        // Use window.location.href for immediate, reliable redirect (no setTimeout needed)
        window.location.href = '/admin';
        return; // Exit early to prevent any further execution
      } else {
        console.log('✅ Regular user - Redirecting to home...');
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
      let response: Response;
      try {
        response = await fetch('http://163.61.183.90:8001/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...registerData, is_admin: false })
        });
      } catch (fetchError: any) {
        // Handle network errors
        if (fetchError.message?.includes('Failed to fetch') || fetchError.message?.includes('ERR_CONNECTION_REFUSED')) {
          throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối hoặc liên hệ quản trị viên.');
        }
        throw fetchError;
      }

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

