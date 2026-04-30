-- 1. Force Insert Sample Data (To make sure table is NOT empty)
INSERT INTO clients (name, email, company_name) 
VALUES 
('John Doe (Sample)', 'john@doe.com', 'Doe Enterprises'),
('Jane Smith (Sample)', 'jane@smith.com', 'Smith Creative')
ON CONFLICT (email) DO NOTHING;

-- 2. Ensure RLS is permissive for testing (DEBUG MODE)
-- Run these if the data still doesn't show up.
DROP POLICY IF EXISTS "Temporary Public View" ON clients;
CREATE POLICY "Temporary Public View" ON clients FOR SELECT USING (true);

DROP POLICY IF EXISTS "Temporary Public View Projects" ON projects;
CREATE POLICY "Temporary Public View Projects" ON projects FOR SELECT USING (true);

-- 3. Check if your profile has the 'admin' role
-- Replace 'nug' with your actual username or email if needed, 
-- but this SQL will show you what's in your profiles table:
-- SELECT id, full_name, role FROM profiles;

-- 4. If you want to MANUALLY set yourself as admin:
-- UPDATE profiles SET role = 'admin' WHERE full_name ILIKE '%nug%';
