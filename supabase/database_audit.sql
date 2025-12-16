-- =====================================================
-- OPARS DATABASE AUDIT & FIX
-- Run each section separately to identify issues
-- =====================================================

-- ============ SECTION 1: CHECK AUTH USERS ============
-- See what users exist in auth.users
SELECT id, email, created_at FROM auth.users;

-- ============ SECTION 2: CHECK PROFILES TABLE ============
-- See current profiles table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- ============ SECTION 3: ADD MISSING COLUMNS ============
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- ============ SECTION 4: CHECK CURRENT PROFILES ============
SELECT * FROM profiles;

-- ============ SECTION 5: CHECK RLS POLICIES ============
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- ============ SECTION 6: DISABLE RLS TEMPORARILY FOR SETUP ============
-- This allows inserting profiles without auth context
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- ============ SECTION 7: INSERT PROFILES (SAFE) ============
-- Only run this after confirming users exist in Section 1
-- Copy the UUIDs from Section 1 results

-- For each user, run this pattern:
-- INSERT INTO profiles (id, email, name, role, position, department, phone)
-- VALUES ('<UUID-FROM-SECTION-1>', 'email@ukm.edu.my', 'Name', 'role', 'Position', 'Department', 'Phone')
-- ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, position = EXCLUDED.position;

-- Example (replace UUID with actual):
-- INSERT INTO profiles (id, email, name, role, position, department, phone)
-- VALUES ('your-uuid-here', 'directorshape@ukm.edu.my', 'Pengarah UKMShape', 'admin', 'Pengarah', 'Pengurusan', '03-8927-2102')
-- ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, position = EXCLUDED.position, department = EXCLUDED.department, phone = EXCLUDED.phone;

-- ============ SECTION 8: RE-ENABLE RLS ============
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============ SECTION 9: VERIFY FINAL STATE ============
SELECT p.id, p.email, p.name, p.role, p.position 
FROM profiles p 
JOIN auth.users u ON p.id = u.id;
