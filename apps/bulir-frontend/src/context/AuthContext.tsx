import Cookies from 'js-cookie';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/auth.service';
import { Role, User } from '../types/api';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  role: Role | null;
  balance: number;
  login: (identifier: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const userCookie = Cookies.get('user');
        return userCookie ? JSON.parse(userCookie) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleAuthSuccess = (resUser: User, accessToken: string) => {
    setUser(resUser);
    Cookies.set('accessToken', accessToken, { expires: 7 });
    Cookies.set('user', JSON.stringify(resUser), { expires: 7 });
  };

  const login = async (identifier: string, password: string) => {
    const res = await apiLogin(identifier, password);
    handleAuthSuccess(res.user, res.accessToken);
  };

  const register = async (payload: any) => {
    const res = await apiRegister(payload);
    handleAuthSuccess(res.user, res.accessToken);
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('accessToken');
    Cookies.remove('user');
  };

  const updateBalance = useCallback((newBalance: number) => {
    setUser(prev => {
      if (prev) {
        const updatedUser = { ...prev, balance: newBalance };
        if (typeof window !== 'undefined') {
            Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 });
        }
        return updatedUser;
      }
      return null;
    });
  }, []);

  const value = {
      user,
      isAuthenticated: !!user,
      role: user?.role || null,
      balance: user?.balance || 0,
      login, register, logout,
      updateBalance
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
