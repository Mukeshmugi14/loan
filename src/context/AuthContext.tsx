import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'guest' | 'user' | 'admin' | 'lender';
export type AuthProvider = 'phone' | 'google';

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

export interface User {
  user_id: string;
  google_id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  profile_picture_url?: string;
  auth_provider: AuthProvider;
  created_at: string;
  last_login_at: string;
  role: UserRole;
  onboarded: boolean;
  businessInfo?: BusinessInfo;
  documents?: DocumentStatus;
  onboardingStep?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (phone: string) => void;
  loginWithGoogle: (googleData: { id: string; name: string; email: string; picture: string }) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  updateDocuments: (docs: Partial<DocumentStatus>) => void;
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;
  calculateCompletion: () => ProfileCompletion;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JWT Encoding/Decoding Helpers
function base64UrlEncode(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    return '';
  }
}

function base64UrlDecode(str: string): string {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return decodeURIComponent(escape(atob(base64)));
  } catch (e) {
    return '';
  }
}

export function generateJWT(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const encodedSignature = base64UrlEncode(encodedHeader + '.' + encodedPayload + '.msmeraise-jwt-secret-key');
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export function parseJWT(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

function calcCompletion(user: User | null): ProfileCompletion {
  if (!user) {
    return { personalInfo: 0, businessInfo: 0, kycDocuments: 0, gstDocuments: 0, msmeRegistration: 0, bankDetails: 0, eligibilityAssessment: 0, overall: 0 };
  }
  
  // Personal Info (Name, Email / Phone)
  const hasPersonal = user.full_name && user.email;
  const personalInfo = hasPersonal ? 100 : (user.full_name || user.email || user.phone ? 50 : 0);
  
  // Business Info Completion (6 fields)
  const bi = user.businessInfo || {};
  const biFields = ['businessName', 'businessType', 'businessLocation', 'industryCategory', 'annualRevenue', 'numberOfEmployees'];
  const biCount = biFields.filter(f => (bi as any)[f]).length;
  const businessInfo = Math.round((biCount / biFields.length) * 100);
  
  // KYC Documents (4 fields: Aadhaar, PAN, Address Proof, Bank Details)
  const docs = user.documents || {};
  const kycFields = ['aadhaar', 'pan', 'addressProof', 'bankDetails'];
  const kycCount = kycFields.filter(f => (docs as any)[f]).length;
  const kycDocuments = Math.round((kycCount / kycFields.length) * 100);
  
  // GST Documents
  const gstDocuments = docs.gstCertificate ? 100 : 0;
  
  // MSME Registration (MSME Reg / Udyam Reg = 100%, License / Incorporation = 50%)
  let msmeRegistration = 0;
  if (docs.msmeRegistration || docs.udyamRegistration) {
    msmeRegistration = 100;
  } else if (docs.businessLicense || docs.incorporationCertificate) {
    msmeRegistration = 50;
  }
  
  // Bank Details
  const bankDetails = docs.bankDetails ? 100 : 0;
  
  // Eligibility Assessment (Based on onboarding profile creation)
  const eligibilityAssessment = user.onboarded ? 100 : 0;
  
  // Overall Weighted Completion
  const overall = Math.round(
    (personalInfo + businessInfo + kycDocuments + gstDocuments + msmeRegistration + bankDetails + eligibilityAssessment) / 7
  );
  
  return {
    personalInfo,
    businessInfo,
    kycDocuments,
    gstDocuments,
    msmeRegistration,
    bankDetails,
    eligibilityAssessment,
    overall
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('msmeraise_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('msmeraise_token');
  });

  const saveSession = (u: User | null, t: string | null) => {
    setUser(u);
    setToken(t);
    if (u && t) {
      localStorage.setItem('msmeraise_user', JSON.stringify(u));
      localStorage.setItem('msmeraise_token', t);
    } else {
      localStorage.removeItem('msmeraise_user');
      localStorage.removeItem('msmeraise_token');
    }
  };

  const login = (phone: string) => {
    const now = new Date().toISOString();
    const newUser: User = {
      user_id: 'usr_' + Math.random().toString(36).substring(7),
      phone,
      auth_provider: 'phone',
      created_at: now,
      last_login_at: now,
      role: 'user',
      onboarded: false,
    };
    const t = generateJWT({ user_id: newUser.user_id, phone: newUser.phone, role: newUser.role });
    saveSession(newUser, t);
  };

  const loginWithGoogle = (googleData: { id: string; name: string; email: string; picture: string }) => {
    const now = new Date().toISOString();
    
    // Check if there is an existing user session or local record for this email
    let existingUser: User | null = null;
    try {
      const saved = localStorage.getItem('msmeraise_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email === googleData.email) {
          existingUser = parsed;
        }
      }
    } catch (_) {}

    const updatedUser: User = {
      user_id: existingUser?.user_id || 'usr_' + Math.random().toString(36).substring(7),
      google_id: googleData.id,
      full_name: googleData.name,
      email: googleData.email,
      profile_picture_url: googleData.picture,
      auth_provider: 'google',
      created_at: existingUser?.created_at || now,
      last_login_at: now,
      role: existingUser?.role || 'user',
      onboarded: existingUser?.onboarded || false,
      businessInfo: existingUser?.businessInfo,
      documents: existingUser?.documents,
      onboardingStep: existingUser?.onboardingStep,
    };

    const t = generateJWT({
      user_id: updatedUser.user_id,
      google_id: updatedUser.google_id,
      email: updatedUser.email,
      full_name: updatedUser.full_name,
      role: updatedUser.role,
    });

    saveSession(updatedUser, t);
  };

  const logout = () => {
    saveSession(null, null);
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('msmeraise_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updateDocuments = (docs: Partial<DocumentStatus>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, documents: { ...prev.documents, ...docs } };
      localStorage.setItem('msmeraise_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updateBusinessInfo = (info: Partial<BusinessInfo>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, businessInfo: { ...prev.businessInfo, ...info } };
      localStorage.setItem('msmeraise_user', JSON.stringify(updated));
      return updated;
    });
  };

  const calculateCompletion = () => calcCompletion(user);

  return (
    <AuthContext.Provider value={{ user, token, login, loginWithGoogle, logout, updateUser, updateDocuments, updateBusinessInfo, calculateCompletion }}>
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
