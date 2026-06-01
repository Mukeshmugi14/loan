import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'guest' | 'user' | 'admin' | 'lender';
type AuthProvider = 'phone' | 'google';

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

export interface ProfileCompletion {
  personalInfo: number;
  businessInfo: number;
  kycDocuments: number;
  gstDocuments: number;
  msmeRegistration: number;
  bankDetails: number;
  eligibilityAssessment: number;
  overall: number;
}

interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role: UserRole;
  onboarded?: boolean;
  authProvider?: AuthProvider;
  googleId?: string;
  profilePicture?: string;
  createdAt?: string;
  lastLogin?: string;
  // Document collection data
  businessInfo?: BusinessInfo;
  documents?: DocumentStatus;
  onboardingStep?: number;
  profileCompletion?: ProfileCompletion;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string) => void;
  loginWithGoogle: (googleData: { id: string; name: string; email: string; picture: string }) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  updateDocuments: (docs: Partial<DocumentStatus>) => void;
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;
  calculateCompletion: () => ProfileCompletion;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function calcCompletion(user: User | null): ProfileCompletion {
  if (!user) {
    return { personalInfo: 0, businessInfo: 0, kycDocuments: 0, gstDocuments: 0, msmeRegistration: 0, bankDetails: 0, eligibilityAssessment: 0, overall: 0 };
  }
  const personalInfo = user.name && user.email ? 100 : user.name || user.email ? 50 : 0;
  const bi = user.businessInfo || {};
  const biFields = ['businessName', 'businessType', 'businessLocation', 'industryCategory', 'annualRevenue', 'numberOfEmployees'];
  const biCount = biFields.filter(f => (bi as any)[f]).length;
  const businessInfo = Math.round((biCount / biFields.length) * 100);
  const docs = user.documents || {};
  const kycCount = ['aadhaar', 'pan', 'addressProof', 'bankDetails'].filter(f => (docs as any)[f]).length;
  const kycDocuments = Math.round((kycCount / 4) * 100);
  const gstDocuments = docs.gstCertificate ? 100 : 0;
  const msmeRegistration = docs.msmeRegistration || docs.udyamRegistration ? 100 : (docs.businessLicense || docs.incorporationCertificate ? 50 : 0);
  const bankDetails = docs.bankDetails ? 100 : 0;
  const eligibilityAssessment = user.onboarded ? 100 : 0;
  const overall = Math.round((personalInfo + businessInfo + kycDocuments + gstDocuments + msmeRegistration + bankDetails + eligibilityAssessment) / 7);
  return { personalInfo, businessInfo, kycDocuments, gstDocuments, msmeRegistration, bankDetails, eligibilityAssessment, overall };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('neofi_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const saveUser = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem('neofi_user', JSON.stringify(u));
    else localStorage.removeItem('neofi_user');
  };

  const login = (phone: string) => {
    const now = new Date().toISOString();
    saveUser({ id: Math.random().toString(36).substring(7), role: 'user', phone, onboarded: false, authProvider: 'phone', createdAt: now, lastLogin: now });
  };

  const loginWithGoogle = (googleData: { id: string; name: string; email: string; picture: string }) => {
    const now = new Date().toISOString();
    // Check if existing user by email (simulated - in real app would check DB)
    const existing = user && user.email === googleData.email ? user : null;
    saveUser({
      id: existing?.id || Math.random().toString(36).substring(7),
      role: existing?.role || 'user',
      name: googleData.name,
      email: googleData.email,
      profilePicture: googleData.picture,
      googleId: googleData.id,
      authProvider: 'google',
      onboarded: existing?.onboarded || false,
      businessInfo: existing?.businessInfo,
      documents: existing?.documents,
      onboardingStep: existing?.onboardingStep,
      createdAt: existing?.createdAt || now,
      lastLogin: now,
    });
  };

  const logout = () => saveUser(null);

  const updateUser = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('neofi_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updateDocuments = (docs: Partial<DocumentStatus>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, documents: { ...prev.documents, ...docs } };
      localStorage.setItem('neofi_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updateBusinessInfo = (info: Partial<BusinessInfo>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, businessInfo: { ...prev.businessInfo, ...info } };
      localStorage.setItem('neofi_user', JSON.stringify(updated));
      return updated;
    });
  };

  const calculateCompletion = () => calcCompletion(user);

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, updateUser, updateDocuments, updateBusinessInfo, calculateCompletion }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
