
-- Drop the problematic function and policies
DROP POLICY IF EXISTS "Admins can view all coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can insert coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can update coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can delete coupons" ON public.coupons;

DROP POLICY IF EXISTS "Admins can view all bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can insert bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can update bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can delete bundles" ON public.bundles;

DROP FUNCTION IF EXISTS public.is_admin_user();

-- Create a function that directly queries auth.users metadata to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.check_admin_status()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user has admin email (bypasses profiles table completely)
  RETURN auth.email() = 'vaibhavbajoria03@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Alternative: Create a simple function that uses a direct query with no RLS dependency
CREATE OR REPLACE FUNCTION public.is_admin_user_direct()
RETURNS BOOLEAN AS $$
DECLARE
  admin_status BOOLEAN := false;
BEGIN
  -- Use a raw SQL query that bypasses RLS entirely
  EXECUTE 'SELECT is_admin FROM public.profiles WHERE id = $1 LIMIT 1' 
  INTO admin_status 
  USING auth.uid();
  
  RETURN COALESCE(admin_status, false);
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Use the email-based check for coupons policies (most reliable)
CREATE POLICY "Admins can view all coupons" 
  ON public.coupons 
  FOR SELECT 
  USING (public.check_admin_status());

CREATE POLICY "Admins can insert coupons" 
  ON public.coupons 
  FOR INSERT 
  WITH CHECK (public.check_admin_status());

CREATE POLICY "Admins can update coupons" 
  ON public.coupons 
  FOR UPDATE 
  USING (public.check_admin_status());

CREATE POLICY "Admins can delete coupons" 
  ON public.coupons 
  FOR DELETE 
  USING (public.check_admin_status());

-- Use the email-based check for bundles policies
CREATE POLICY "Admins can view all bundles" 
  ON public.bundles 
  FOR SELECT 
  USING (public.check_admin_status());

CREATE POLICY "Admins can insert bundles" 
  ON public.bundles 
  FOR INSERT 
  WITH CHECK (public.check_admin_status());

CREATE POLICY "Admins can update bundles" 
  ON public.bundles 
  FOR UPDATE 
  USING (public.check_admin_status());

CREATE POLICY "Admins can delete bundles" 
  ON public.bundles 
  FOR DELETE 
  USING (public.check_admin_status());
