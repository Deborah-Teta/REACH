import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole, ApproverAccessStatus } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  loading: boolean;
  isApprover: boolean;
  refreshProfile: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  uid: 'user-123',
  email: 'amina.johnson@example.com',
  role: UserRole.APPLICANT,
  fullName: 'Amina Johnson',
  businessName: "Amina's Bakery",
  tinNumber: 'TIN-7734-5',
  approverAccessStatus: ApproverAccessStatus.NONE,
  theme: 'light',
  createdAt: new Date(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(defaultProfile);
  const [profile, setProfile] = useState<UserProfile | null>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(timeout);
  }, []);

  const refreshProfile = async () => {
    return Promise.resolve();
  };

  const isApprover = profile?.role === UserRole.APPROVER && profile?.approverAccessStatus === ApproverAccessStatus.GRANTED;

  return (
    <AuthContext.Provider value={{ user, profile, loading, isApprover, refreshProfile }}>
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
