
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

  useEffect(() => {
    // Check if admin is logged in from localStorage
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth) {
      try {
        const adminData = JSON.parse(adminAuth);
        // Verify the stored auth is still valid (not expired)
        const loginTime = new Date(adminData.loginTime).getTime();
        const currentTime = new Date().getTime();
        const hoursSinceLogin = (currentTime - loginTime) / (1000 * 60 * 60);
        
        // Auto-logout after 24 hours
        if (hoursSinceLogin < 24) {
          setIsAdminLoggedIn(true);
          setAdminUser(adminData);
        } else {
          localStorage.removeItem('admin_auth');
        }
      } catch (error) {
        console.error('Error parsing admin auth:', error);
        localStorage.removeItem('admin_auth');
      }
    }
    setLoading(false);
  }, []);

  const adminSignIn = async (email: string, password: string) => {
    try {
      console.log('Attempting admin sign in for:', email);
      
      // First, try the hardcoded admin credentials as fallback
      const FALLBACK_ADMIN_EMAIL = 'vaibhavbajoria030@gmail.com';
      const FALLBACK_ADMIN_PASSWORD = 'test001';
      
      if (email === FALLBACK_ADMIN_EMAIL && password === FALLBACK_ADMIN_PASSWORD) {
        const adminData = { 
          email, 
          isAdmin: true, 
          loginTime: new Date().toISOString(),
          source: 'fallback'
        };
        localStorage.setItem('admin_auth', JSON.stringify(adminData));
        setIsAdminLoggedIn(true);
        setAdminUser(adminData);
        toast.success("Admin login successful!");
        return;
      }

      // Try to verify credentials using the database function
      const { data: isValid, error } = await supabase
        .rpc('verify_admin_credentials', { 
          email: email, 
          password: password 
        });

      if (error) {
        console.error('Error verifying admin credentials:', error);
        // If database check fails, fall back to hardcoded check
        if (email === FALLBACK_ADMIN_EMAIL && password === FALLBACK_ADMIN_PASSWORD) {
          const adminData = { 
            email, 
            isAdmin: true, 
            loginTime: new Date().toISOString(),
            source: 'fallback'
          };
          localStorage.setItem('admin_auth', JSON.stringify(adminData));
          setIsAdminLoggedIn(true);
          setAdminUser(adminData);
          toast.success("Admin login successful!");
          return;
        } else {
          toast.error("Invalid admin credentials. Please check your email and password.");
          throw new Error("Invalid admin credentials");
        }
      }

      if (!isValid) {
        toast.error("Invalid admin credentials. Please check your email and password.");
        throw new Error("Invalid admin credentials");
      }

      // Get additional admin info
      const { data: adminInfo } = await supabase
        .from('admin_credentials')
        .select('email, full_name, is_active')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      const adminData = { 
        email, 
        full_name: adminInfo?.full_name || null,
        isAdmin: true, 
        loginTime: new Date().toISOString(),
        source: 'database'
      };
      
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
