
-- Enable RLS on coupons table if not already enabled
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Enable RLS on bundles table if not already enabled  
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create RLS policies for coupons table
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

-- Create RLS policies for bundles table
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

-- Enable realtime for coupons and bundles tables
ALTER publication supabase_realtime ADD TABLE public.coupons;
ALTER publication supabase_realtime ADD TABLE public.bundles;
