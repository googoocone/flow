-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN is_approved BOOLEAN DEFAULT FALSE,
ADD COLUMN role TEXT DEFAULT 'user';

-- Update RLS policies to allow admins to view all profiles and update approval status
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can update profiles" 
ON profiles FOR UPDATE 
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
