
-- First drop all existing policies that depend on the function
DROP POLICY IF EXISTS "Admins can view all coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can insert coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can update coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can delete coupons" ON public.coupons;

DROP POLICY IF EXISTS "Admins can view all bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can insert bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can update bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can delete bundles" ON public.bundles;

-- Now drop the function
DROP FUNCTION IF EXISTS public.is_admin_user();

-- Create a simpler security definer function that avoids recursion
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
DECLARE
  user_is_admin BOOLEAN;
BEGIN
  -- Use a direct query with security definer to bypass RLS
  SELECT is_admin INTO user_is_admin 
  FROM public.profiles 
  WHERE id = auth.uid() 
  LIMIT 1;
  
  RETURN COALESCE(user_is_admin, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate policies for coupons with the fixed function
CREATE POLICY "Admins can view all coupons" 
  ON public.coupons 
  FOR SELECT 
  USING (public.is_admin_user());

CREATE POLICY "Admins can insert coupons" 
  ON public.coupons 
  FOR INSERT 
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update coupons" 
  ON public.coupons 
  FOR UPDATE 
  USING (public.is_admin_user());

CREATE POLICY "Admins can delete coupons" 
  ON public.coupons 
  FOR DELETE 
  USING (public.is_admin_user());

-- Recreate policies for bundles with the fixed function
CREATE POLICY "Admins can view all bundles" 
  ON public.bundles 
  FOR SELECT 
  USING (public.is_admin_user());

CREATE POLICY "Admins can insert bundles" 
  ON public.bundles 
  FOR INSERT 
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update bundles" 
  ON public.bundles 
  FOR UPDATE 
  USING (public.is_admin_user());

CREATE POLICY "Admins can delete bundles" 
  ON public.bundles 
  FOR DELETE 
  USING (public.is_admin_user());
