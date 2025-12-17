-- Allow public read access to consultations so clients can view their reports via link
DROP POLICY IF EXISTS "Allow public read access to consultations" ON consultations;
CREATE POLICY "Allow public read access to consultations" ON consultations
  FOR SELECT USING (true);
