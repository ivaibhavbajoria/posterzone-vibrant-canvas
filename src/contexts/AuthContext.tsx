
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { securityService } from '@/services/securityService';

interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state change:', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Defer Supabase calls with setTimeout to prevent infinite loops
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        if (error.code === 'PGRST116') {
          console.log('Profile not found, will be created by trigger on next login');
        }
        return;
      }

      console.log('Profile fetched:', data);
      setProfile(data);
      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Error in profile fetch:', error);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // Minimum 8 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Input validation
      if (!validateEmail(email)) {
        toast.error("Please enter a valid email address");
        throw new Error("Invalid email format");
      }

      if (!password || password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        throw new Error("Invalid password");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        // Enhanced error handling
        let errorMessage = "Login failed";
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please verify your email before signing in";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Too many login attempts. Please try again later";
        }
        
        toast.error(errorMessage);
        
        // Log security event for failed login
        await securityService.logLoginAttempt(email, false, { 
          error: error.message,
          riskLevel: 'medium'
        });
        
        throw error;
      }

      // Log successful login
      await securityService.logLoginAttempt(email, true);
      toast.success("Login successful! Welcome back!");
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Input validation
      if (!validateEmail(email)) {
        toast.error("Please enter a valid email address");
        throw new Error("Invalid email format");
      }

      if (!validatePassword(password)) {
        toast.error("Password must be at least 8 characters with letters and numbers");
        throw new Error("Invalid password format");
      }

      if (!fullName || fullName.trim().length < 2) {
        toast.error("Please enter a valid full name");
        throw new Error("Invalid full name");
      }

      // Sanitize inputs
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedFullName = fullName.trim().replace(/[<>]/g, '');

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: sanitizedFullName,
          },
        },
      });

      if (error) {
        let errorMessage = "Signup failed";
        if (error.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists";
        } else if (error.message.includes("Password should be")) {
          errorMessage = "Password doesn't meet security requirements";
        }
        
        toast.error(errorMessage);
        throw error;
      }

      // Log security event
      await securityService.logSecurityEvent({
        action: 'USER_REGISTRATION',
        resource: 'auth',
        details: { email: sanitizedEmail, fullName: sanitizedFullName }
      });

      toast.success("Signup successful! Please check your email to verify your account.");
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!validateEmail(email)) {
        toast.error("Please enter a valid email address");
        throw new Error("Invalid email format");
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(`Password reset failed: ${error.message}`);
        throw error;
      }

      // Log password reset attempt
      await securityService.logSecurityEvent({
        action: 'PASSWORD_RESET_REQUESTED',
        resource: 'auth',
        details: { email: email.trim().toLowerCase() }
      });

      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await securityService.logSecurityEvent({
        action: 'USER_LOGOUT',
        resource: 'auth',
        details: { userId: user?.id }
      });

      await supabase.auth.signOut();
      toast.success("You have been successfully logged out.");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const value = {
    session,
    user,
    profile,
    signIn,
    signUp,
    signOut,
    resetPassword,
    loading,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
