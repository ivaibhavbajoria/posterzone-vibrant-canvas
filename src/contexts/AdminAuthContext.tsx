
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AdminAuthContextType = {
  isAdminLoggedIn: boolean;
  adminUser: any | null;
  adminSignIn: (email: string, password: string) => Promise<void>;
  adminSignOut: () => Promise<void>;
  loading: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin credentials
  const ADMIN_EMAIL = 'vaibhavbajoria030@gmail.com';
  const ADMIN_PASSWORD = 'test001';

  useEffect(() => {
    // Check if admin is logged in from localStorage
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth) {
      const adminData = JSON.parse(adminAuth);
      if (adminData.email === ADMIN_EMAIL) {
        setIsAdminLoggedIn(true);
        setAdminUser(adminData);
      }
    }
    setLoading(false);
  }, []);

  const adminSignIn = async (email: string, password: string) => {
    try {
      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        toast.error("Invalid admin credentials. Only authorized personnel can access the admin panel.");
        throw new Error("Invalid admin credentials");
      }

      // Store admin auth in localStorage (separate from main auth)
      const adminData = { email, isAdmin: true, loginTime: new Date().toISOString() };
      localStorage.setItem('admin_auth', JSON.stringify(adminData));
      
      setIsAdminLoggedIn(true);
      setAdminUser(adminData);
      
      toast.success("Admin login successful!");
    } catch (error) {
      console.error('Error signing in as admin:', error);
      throw error;
    }
  };

  const adminSignOut = async () => {
    try {
      localStorage.removeItem('admin_auth');
      setIsAdminLoggedIn(false);
      setAdminUser(null);
      toast.success("Admin logged out successfully.");
    } catch (error) {
      console.error('Error signing out admin:', error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const value = {
    isAdminLoggedIn,
    adminUser,
    adminSignIn,
    adminSignOut,
    loading,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
