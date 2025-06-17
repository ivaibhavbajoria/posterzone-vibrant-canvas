
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { securityService } from '@/services/securityService';

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
    // Check if admin is logged in from localStorage with security validation
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth) {
      try {
        const adminData = JSON.parse(adminAuth);
        
        // Enhanced security validation
        if (!adminData.loginTime || !adminData.sessionToken) {
          localStorage.removeItem('admin_auth');
          setLoading(false);
          return;
        }

        const loginTime = new Date(adminData.loginTime).getTime();
        const currentTime = new Date().getTime();
        const hoursSinceLogin = (currentTime - loginTime) / (1000 * 60 * 60);
        
        // Auto-logout after 8 hours for security
        if (hoursSinceLogin < 8) {
          setIsAdminLoggedIn(true);
          setAdminUser(adminData);
        } else {
          localStorage.removeItem('admin_auth');
          toast.info("Admin session expired. Please login again.");
        }
      } catch (error) {
        console.error('Error parsing admin auth:', error);
        localStorage.removeItem('admin_auth');
      }
    }
    setLoading(false);
  }, []);

  const validateAdminCredentials = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data: isValid, error } = await supabase
        .rpc('verify_admin_credentials', { 
          email: email.trim().toLowerCase(), 
          password: password 
        });

      if (error) {
        console.error('Error verifying admin credentials:', error);
        return false;
      }

      return isValid === true;
    } catch (error) {
      console.error('Admin credential validation error:', error);
      return false;
    }
  };

  const adminSignIn = async (email: string, password: string) => {
    try {
      console.log('Attempting admin sign in for:', email);
      
      // Input validation
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        throw new Error("Invalid email format");
      }

      if (!password || password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        throw new Error("Invalid password");
      }

      // Rate limiting check
      const rateKey = `admin_login_${email}`;
      if (!securityService.checkRateLimit(rateKey, 3, 15 * 60 * 1000)) {
        toast.error("Too many failed login attempts. Please try again in 15 minutes.");
        throw new Error("Rate limit exceeded");
      }

      const isValid = await validateAdminCredentials(email, password);

      if (!isValid) {
        await securityService.logSecurityEvent({
          action: 'ADMIN_LOGIN_FAILED',
          resource: 'admin_auth',
          details: { email, reason: 'Invalid credentials' }
        });
        
        toast.error("Invalid admin credentials. Please check your email and password.");
        throw new Error("Invalid admin credentials");
      }

      // Get additional admin info
      const { data: adminInfo } = await supabase
        .from('admin_credentials')
        .select('email, full_name, is_active')
        .eq('email', email.trim().toLowerCase())
        .eq('is_active', true)
        .single();

      // Generate secure session token
      const sessionToken = crypto.randomUUID();
      
      const adminData = { 
        email: email.trim().toLowerCase(), 
        full_name: adminInfo?.full_name || null,
        isAdmin: true, 
        loginTime: new Date().toISOString(),
        sessionToken,
        source: 'database'
      };
      
      localStorage.setItem('admin_auth', JSON.stringify(adminData));
      setIsAdminLoggedIn(true);
      setAdminUser(adminData);
      
      // Log successful admin login
      await securityService.logSecurityEvent({
        action: 'ADMIN_LOGIN_SUCCESS',
        resource: 'admin_auth',
        details: { email: adminData.email, sessionToken }
      });
      
      toast.success("Admin login successful!");
    } catch (error) {
      console.error('Error signing in as admin:', error);
      throw error;
    }
  };

  const adminSignOut = async () => {
    try {
      const currentAdmin = JSON.parse(localStorage.getItem('admin_auth') || '{}');
      
      await securityService.logSecurityEvent({
        action: 'ADMIN_LOGOUT',
        resource: 'admin_auth',
        details: { 
          email: currentAdmin.email,
          sessionToken: currentAdmin.sessionToken
        }
      });

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
