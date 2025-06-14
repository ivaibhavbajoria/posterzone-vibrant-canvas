
-- Drop all existing policies on coupons and bundles tables
DROP POLICY IF EXISTS "Admins can view all coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can insert coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can update coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can delete coupons" ON public.coupons;
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;

DROP POLICY IF EXISTS "Admins can view all bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can insert bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can update bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can delete bundles" ON public.bundles;
DROP POLICY IF EXISTS "Anyone can view active bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can manage bundles" ON public.bundles;

-- Drop any potentially problematic functions
DROP FUNCTION IF EXISTS public.is_admin_user();
DROP FUNCTION IF EXISTS public.is_admin_user_direct();

-- Ensure we have a clean email-only admin check function
CREATE OR REPLACE FUNCTION public.check_admin_status()
RETURNS BOOLEAN AS $$
BEGIN
  -- Only check email, no database queries at all
  RETURN auth.email() = 'vaibhavbajoria03@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create clean policies for coupons using only the email check
CREATE POLICY "Admin email can view all coupons" 
  ON public.coupons 
  FOR SELECT 
  USING (public.check_admin_status());

CREATE POLICY "Admin email can insert coupons" 
  ON public.coupons 
  FOR INSERT 
  WITH CHECK (public.check_admin_status());

CREATE POLICY "Admin email can update coupons" 
  ON public.coupons 
  FOR UPDATE 
  USING (public.check_admin_status());

CREATE POLICY "Admin email can delete coupons" 
  ON public.coupons 
  FOR DELETE 
  USING (public.check_admin_status());

-- Create clean policies for bundles using only the email check
CREATE POLICY "Admin email can view all bundles" 
  ON public.bundles 
  FOR SELECT 
  USING (public.check_admin_status());

CREATE POLICY "Admin email can insert bundles" 
  ON public.bundles 
  FOR INSERT 
  WITH CHECK (public.check_admin_status());

CREATE POLICY "Admin email can update bundles" 
  ON public.bundles 
  FOR UPDATE 
  USING (public.check_admin_status());

CREATE POLICY "Admin email can delete bundles" 
  ON public.bundles 
  FOR DELETE 
  USING (public.check_admin_status());

-- Ensure RLS is enabled on both tables
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
