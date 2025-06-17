
-- Phase 1: Fix RLS policy infinite recursion by creating security definer functions
-- Drop existing problematic policies first
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create security definer function to check user ownership without recursion
CREATE OR REPLACE FUNCTION public.is_profile_owner(profile_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN profile_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create security definer function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.check_admin_role()
RETURNS BOOLEAN AS $$
DECLARE
  user_admin_status BOOLEAN;
BEGIN
  -- Direct query with security definer to bypass RLS
  SELECT is_admin INTO user_admin_status 
  FROM public.profiles 
  WHERE id = auth.uid() 
  LIMIT 1;
  
  RETURN COALESCE(user_admin_status, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate profiles policies using security definer functions
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (public.is_profile_owner(id));

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (public.is_profile_owner(id));

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (public.is_profile_owner(id));

-- Phase 2: Fix poster table RLS policies to be more restrictive
DROP POLICY IF EXISTS "Allow admin insert on posters" ON public.posters;
DROP POLICY IF EXISTS "Allow admin update on posters" ON public.posters;
DROP POLICY IF EXISTS "Allow admin delete on posters" ON public.posters;
DROP POLICY IF EXISTS "Allow public select on posters" ON public.posters;

-- Create more secure poster policies
CREATE POLICY "Admin can manage posters" 
  ON public.posters 
  FOR ALL 
  USING (public.check_admin_role());

CREATE POLICY "Public can view active posters" 
  ON public.posters 
  FOR SELECT 
  USING (stock > 0);

-- Phase 3: Secure admin credentials table
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES public.admin_credentials(id) ON DELETE CASCADE,
  session_token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  last_used_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Only allow admins to manage their own sessions
CREATE POLICY "Admins can manage own sessions"
  ON public.admin_sessions
  FOR ALL
  USING (admin_id IN (
    SELECT id FROM public.admin_credentials 
    WHERE email = auth.email() AND is_active = true
  ));

-- Phase 4: Add input validation functions
CREATE OR REPLACE FUNCTION public.validate_email(email text)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.validate_phone(phone text)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN phone ~* '^\+?[1-9]\d{1,14}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Phase 5: Enhanced security logging
ALTER TABLE public.security_audit_logs 
ADD COLUMN IF NOT EXISTS session_id text,
ADD COLUMN IF NOT EXISTS risk_level text DEFAULT 'low',
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- Create function for enhanced security logging
CREATE OR REPLACE FUNCTION public.log_enhanced_security_event(
  p_action text,
  p_resource text DEFAULT NULL,
  p_details jsonb DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_session_id text DEFAULT NULL,
  p_risk_level text DEFAULT 'low'
)
RETURNS uuid AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource,
    details,
    ip_address,
    user_agent,
    session_id,
    risk_level,
    metadata
  )
  VALUES (
    auth.uid(),
    p_action,
    p_resource,
    p_details,
    p_ip_address,
    p_user_agent,
    p_session_id,
    p_risk_level,
    jsonb_build_object('timestamp', now(), 'auth_method', auth.jwt()->>'aud')
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
