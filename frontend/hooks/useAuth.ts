// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Mock user for development when backend is not running
const MOCK_USER: User = {
  id: '1',
  name: 'Admin',
  email: 'admin@example.com',
  role: 'admin',
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setIsBackendAvailable(true);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (fetchError: any) {
        console.warn('Backend not available, using mock user data:', fetchError.message);
        setIsBackendAvailable(false);
        if (localStorage.getItem('token')) {
          setUser(MOCK_USER);
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Empty dependency array - fetchUser is stable

  useEffect(() => {
    fetchUser();
  }, [fetchUser]); // ✅ Only depends on fetchUser

  const login = useCallback(async (email: string, password: string) => {
    try {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('token', data.token);
          setUser(data.user);
          setIsBackendAvailable(true);
          router.push('/dashboard');
          return { success: true };
        } else {
          return {
            success: false,
            message: data.message || 'Login failed',
          };
        }
      } catch (fetchError: any) {
        if (email === 'admin@example.com' && password === 'Admin123!') {
          localStorage.setItem('token', 'mock-token');
          setUser(MOCK_USER);
          setIsBackendAvailable(false);
          router.push('/dashboard');
          return { success: true, message: 'Logged in with mock data (backend not available)' };
        }
        throw new Error('Invalid credentials or backend not available');
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An error occurred',
      };
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  }, [router]);

  const isAdmin = useCallback(() => user?.role === 'admin', [user]);
  const isEditor = useCallback(() => user?.role === 'editor', [user]);
  const hasPermission = useCallback((requiredRoles: ('admin' | 'editor')[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  }, [user]);

  return { 
    user, 
    loading, 
    login, 
    logout, 
    fetchUser,
    isAdmin,
    isEditor,
    hasPermission,
    isBackendAvailable,
  };
};