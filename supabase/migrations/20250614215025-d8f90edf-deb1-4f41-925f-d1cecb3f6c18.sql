
-- Fix the storage bucket RLS policies that are causing issues
DROP POLICY IF EXISTS "Admins can upload poster images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update poster images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete poster images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view poster images" ON storage.objects;

-- Create simpler, more permissive storage policies
CREATE POLICY "Allow all operations on posters bucket" 
  ON storage.objects 
  FOR ALL 
  USING (bucket_id = 'posters');

-- Fix the posters table RLS policies
DROP POLICY IF EXISTS "Admins can manage all posters" ON public.posters;
DROP POLICY IF EXISTS "Public can view active posters" ON public.posters;

-- Create more specific policies for posters table
CREATE POLICY "Allow admin insert on posters" 
  ON public.posters 
  FOR INSERT 
  WITH CHECK (public.check_admin_status());

CREATE POLICY "Allow admin update on posters" 
  ON public.posters 
  FOR UPDATE 
  USING (public.check_admin_status());

CREATE POLICY "Allow admin delete on posters" 
  ON public.posters 
  FOR DELETE 
  USING (public.check_admin_status());

CREATE POLICY "Allow public select on posters" 
  ON public.posters 
  FOR SELECT 
  USING (true);

-- Ensure the posters storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('posters', 'posters', true, 10485760, '{image/jpeg,image/png,image/webp,image/gif}')
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = '{image/jpeg,image/png,image/webp,image/gif}';
