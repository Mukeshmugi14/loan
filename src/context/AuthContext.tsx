import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../api/auth';

export type UserRole = 'guest' | 'user' | 'admin' | 'lender';
export type AuthProvider = 'email' | 'google';

export interface DocumentStatus {
  aadhaar?: string;
  pan?: string;
  addressProof?: string;
  bankDetails?: string;
  gstCertificate?: string;
  udyamRegistration?: string;
  msmeRegistration?: string;
  businessLicense?: string;
  incorporationCertificate?: string;
}

export interface BusinessInfo {
  businessName?: string;
  businessType?: string;
  businessLocation?: string;
  industryCategory?: string;
  annualRevenue?: string;
  numberOfEmployees?: string;
}

export interface User {
  id: string; // Changed from user_id to match backend
  full_name?: string; // from backend fullName
  fullName?: string;
  email?: string;
  phone?: string;
  auth_provider: AuthProvider;
  role: UserRole;
  onboarded: boolean;
  onboardingStep?: number;
  businessInfo?: BusinessInfo;
  documents?: DocumentStatus;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  loginWithGoogle: (credential: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  updateDocuments: (docs: Partial<DocumentStatus>) => void;
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;
  calculateCompletion: () => any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.data.user) {
        // Map backend user to frontend expectations
        const fetchedUser = {
          ...res.data.user,
          full_name: res.data.user.fullName,
          onboarded: res.data.user.profileCompleted || false
        };
        setUser(fetchedUser);
      }
    } catch (err) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const saveAuthData = (data: any) => {
    const { accessToken, refreshToken, user: authUser } = data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setToken(accessToken);
    setUser({
      ...authUser,
      full_name: authUser.fullName,
      onboarded: authUser.profileCompleted || false
    });
  };

  const login = async (data: any) => {
    const res = await authAPI.login(data);
    saveAuthData(res.data);
  };

  const signup = async (data: any) => {
    const res = await authAPI.signup(data);
    saveAuthData(res.data);
  };

  const loginWithGoogle = async (credential: any) => {
    const res = await authAPI.googleAuth(credential);
    saveAuthData(res.data);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await authAPI.logout(refreshToken);
      } catch (e) {}
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const updateDocuments = (docs: Partial<DocumentStatus>) => {
    setUser(prev => prev ? { ...prev, documents: { ...prev.documents, ...docs } } : null);
  };

  const updateBusinessInfo = (info: Partial<BusinessInfo>) => {
    setUser(prev => prev ? { ...prev, businessInfo: { ...prev.businessInfo, ...info } } : null);
  };

  const calculateCompletion = () => {
    // Dummy completion for compatibility
    return { personalInfo: 100, businessInfo: 100, kycDocuments: 100, gstDocuments: 100, msmeRegistration: 100, bankDetails: 100, eligibilityAssessment: 100, overall: 100 };
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        signup, 
        loginWithGoogle, 
        logout, 
        updateUser,
        updateDocuments,
        updateBusinessInfo,
        calculateCompletion
      }}
    >
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
