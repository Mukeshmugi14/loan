import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'guest' | 'user' | 'admin' | 'lender';

interface User {
  id: string;
  name?: string;
  role: UserRole;
  phone?: string;
  onboarded?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (phone: string) => {
    setUser({ id: Math.random().toString(36).substring(7), role: 'user', phone, onboarded: false });
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
