
-- Drop existing policies and recreate them properly
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items for their orders" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;
DROP POLICY IF EXISTS "Anyone can view active bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can manage bundles" ON public.bundles;

-- Add missing columns to profiles table if they don't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS zip_code text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

-- Create profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Insert default categories if they don't exist
INSERT INTO public.categories (name, description) VALUES 
  ('Movies', 'Movie posters and film-related artwork'),
  ('Music', 'Music artists, bands, and album covers'),
  ('Sports', 'Sports teams, athletes, and sporting events'),
  ('Nature', 'Landscapes, animals, and natural scenes'),
  ('Abstract', 'Abstract art and modern designs'),
  ('Vintage', 'Retro and vintage-style posters')
ON CONFLICT (name) DO NOTHING;

-- Create categories policies
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create orders policies
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update all orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create order_items policies
CREATE POLICY "Users can view their order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can create order items for their orders" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create coupons and bundles policies
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Anyone can view active bundles" ON public.bundles FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can manage bundles" ON public.bundles FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Fix coupons table structure to match the existing schema
ALTER TABLE public.coupons DROP COLUMN IF EXISTS discount_percentage;
ALTER TABLE public.coupons DROP COLUMN IF EXISTS discount_amount;
ALTER TABLE public.coupons DROP COLUMN IF EXISTS minimum_order_amount;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'percentage';
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS value numeric NOT NULL DEFAULT 0;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS min_order_amount numeric DEFAULT 0;

-- Fix bundles table structure
ALTER TABLE public.bundles DROP COLUMN IF EXISTS poster_ids;
ALTER TABLE public.bundles ADD COLUMN IF NOT EXISTS min_quantity integer NOT NULL DEFAULT 2;

-- Enable realtime for tables that don't have it
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_items REPLICA IDENTITY FULL;
ALTER TABLE public.coupons REPLICA IDENTITY FULL;
ALTER TABLE public.bundles REPLICA IDENTITY FULL;
ALTER TABLE public.posters REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
