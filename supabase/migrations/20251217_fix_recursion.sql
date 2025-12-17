-- Create a secure function to check admin status without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.check_if_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- This runs with security definer privileges, bypassing RLS
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;

-- Re-create the update policy using the secure function
CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
USING (
  check_if_admin()
);

-- We don't need "Admins can view all profiles" because "Public profiles are viewable by everyone" (created in previous migration) already allows SELECT using (true).
