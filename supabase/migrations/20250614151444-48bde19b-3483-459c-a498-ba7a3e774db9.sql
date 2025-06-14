
-- First, let's check and fix any RLS policies on profiles that might cause recursion
-- Drop any existing problematic policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Also make sure our admin functions are properly set up
-- Re-create the check_admin_status function to be extra sure
CREATE OR REPLACE FUNCTION public.check_admin_status()
RETURNS BOOLEAN AS $$
BEGIN
  -- Direct email check without any table queries
  RETURN auth.email() = 'vaibhavbajoria03@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
