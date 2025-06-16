
-- Add size-based pricing to posters table
ALTER TABLE posters ADD COLUMN IF NOT EXISTS size_a6_price numeric;
ALTER TABLE posters ADD COLUMN IF NOT EXISTS size_a4_price numeric;
ALTER TABLE posters ADD COLUMN IF NOT EXISTS size_a3_price numeric;

-- Update existing posters to use A6 pricing as base
UPDATE posters SET 
  size_a6_price = price,
  size_a4_price = price + 15,
  size_a3_price = price + 25
WHERE size_a6_price IS NULL;

-- Add trigger to automatically calculate A4 and A3 prices when A6 price is updated
CREATE OR REPLACE FUNCTION update_poster_sizes_pricing()
RETURNS TRIGGER AS $$
BEGIN
  -- If size_a6_price is updated, automatically update A4 and A3 prices
  IF NEW.size_a6_price IS DISTINCT FROM OLD.size_a6_price THEN
    NEW.size_a4_price = NEW.size_a6_price + 15;
    NEW.size_a3_price = NEW.size_a6_price + 25;
  END IF;
  
  -- If base price is updated, update A6 and calculate others
  IF NEW.price IS DISTINCT FROM OLD.price THEN
    NEW.size_a6_price = NEW.price;
    NEW.size_a4_price = NEW.price + 15;
    NEW.size_a3_price = NEW.price + 25;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic price calculation
DROP TRIGGER IF EXISTS trigger_update_poster_sizes_pricing ON posters;
CREATE TRIGGER trigger_update_poster_sizes_pricing
  BEFORE UPDATE ON posters
  FOR EACH ROW
  EXECUTE FUNCTION update_poster_sizes_pricing();

-- Add bulk import log table for tracking imports
CREATE TABLE IF NOT EXISTS bulk_import_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  imported_by uuid REFERENCES auth.users(id),
  total_rows integer NOT NULL,
  successful_imports integer NOT NULL,
  failed_imports integer NOT NULL,
  error_details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on bulk import logs
ALTER TABLE bulk_import_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access to import logs
CREATE POLICY "Admin can manage import logs" ON bulk_import_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Add security audit log table
CREATE TABLE IF NOT EXISTS security_audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource text,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security audit logs
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin-only access to audit logs
CREATE POLICY "Admin can view audit logs" ON security_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Create function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
  p_action text,
  p_resource text DEFAULT NULL,
  p_details jsonb DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO security_audit_logs (
    user_id,
    action,
    resource,
    details,
    ip_address,
    user_agent
  )
  VALUES (
    auth.uid(),
    p_action,
    p_resource,
    p_details,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;
