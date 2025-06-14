
-- Update the admin check function to use the new email
CREATE OR REPLACE FUNCTION public.check_admin_status()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check for the new admin email
  RETURN auth.email() = 'vaibhavbajoria030@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
