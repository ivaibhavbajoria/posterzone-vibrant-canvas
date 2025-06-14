
-- Create a table for admin credentials
CREATE TABLE public.admin_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Only admins can view admin credentials" 
  ON public.admin_credentials 
  FOR SELECT 
  USING (public.check_admin_status());

CREATE POLICY "Only admins can create admin credentials" 
  ON public.admin_credentials 
  FOR INSERT 
  WITH CHECK (public.check_admin_status());

CREATE POLICY "Only admins can update admin credentials" 
  ON public.admin_credentials 
  FOR UPDATE 
  USING (public.check_admin_status());

CREATE POLICY "Only admins can delete admin credentials" 
  ON public.admin_credentials 
  FOR DELETE 
  USING (public.check_admin_status());

-- Create a table for store settings
CREATE TABLE public.store_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT NOT NULL DEFAULT 'PosterZone',
  store_email TEXT NOT NULL DEFAULT 'contact@posterzone.com',
  store_phone TEXT,
  store_address TEXT,
  currency TEXT NOT NULL DEFAULT 'INR',
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 8.00,
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 50.00,
  free_shipping_threshold DECIMAL(10,2) NOT NULL DEFAULT 1000.00,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  sms_notifications BOOLEAN NOT NULL DEFAULT false,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS to store settings
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for store settings
CREATE POLICY "Only admins can view store settings" 
  ON public.store_settings 
  FOR SELECT 
  USING (public.check_admin_status());

CREATE POLICY "Only admins can update store settings" 
  ON public.store_settings 
  FOR UPDATE 
  USING (public.check_admin_status());

CREATE POLICY "Only admins can insert store settings" 
  ON public.store_settings 
  FOR INSERT 
  WITH CHECK (public.check_admin_status());

-- Insert default store settings
INSERT INTO public.store_settings (store_name, store_email, currency, tax_rate) 
VALUES ('PosterZone', 'contact@posterzone.com', 'INR', 8.00);

-- Add RLS policies for posters table to allow admin management
ALTER TABLE public.posters ENABLE ROW LEVEL SECURITY;

-- Create policies for poster management
CREATE POLICY "Admins can manage all posters" 
  ON public.posters 
  FOR ALL 
  USING (public.check_admin_status());

-- Allow public read access to posters for the storefront
CREATE POLICY "Public can view active posters" 
  ON public.posters 
  FOR SELECT 
  USING (true);

-- Create function to hash passwords (simple version for demo)
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- In production, use proper bcrypt or similar
  -- This is a simple hash for demo purposes
  RETURN encode(digest(password || 'poster_salt_2024', 'sha256'), 'hex');
END;
$$;

-- Create function to verify admin credentials
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(email TEXT, password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT password_hash INTO stored_hash
  FROM public.admin_credentials
  WHERE admin_credentials.email = verify_admin_credentials.email AND is_active = true;
  
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN stored_hash = public.hash_password(password);
END;
$$;

-- Create storage bucket for posters if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('posters', 'posters', true, 10485760, '{image/jpeg,image/png,image/webp}')
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for poster uploads
CREATE POLICY "Admins can upload poster images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'posters' AND public.check_admin_status());

CREATE POLICY "Admins can update poster images" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'posters' AND public.check_admin_status());

CREATE POLICY "Admins can delete poster images" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'posters' AND public.check_admin_status());

CREATE POLICY "Public can view poster images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'posters');
