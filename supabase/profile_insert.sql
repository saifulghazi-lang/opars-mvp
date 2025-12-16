-- =====================================================
-- OPARS PROFILE INSERT - Use the exact UUIDs
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- Step 1: Add missing columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Step 2: Disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 3: Insert all profiles with exact UUIDs
INSERT INTO profiles (id, email, name, role, position, department, phone)
VALUES 
    ('15d83955-90d2-4bd8-b463-c7575bcf9ab4', 'directorshape@ukm.edu.my', 'Pengarah UKMShape', 'admin', 'Pengarah', 'Pengurusan', '03-8927-2102'),
    ('64e42ebf-29b1-4d92-b0b2-98315193d06a', 'tp1ukmshape@ukm.edu.my', 'Dr. Kamarul Baraini binti Keliwon', 'member', 'Timbalan Pengarah I', 'Akademik', '03-8927-2101'),
    ('32cb9453-e366-44bb-81c1-32c82f174bcb', 'tp2ukmshape@ukm.edu.my', 'Prof. Madya Dr. Azahan bin Awang', 'member', 'Timbalan Pengarah II', 'Hal Ehwal Pelajar', '03-8927-2103'),
    ('dc155329-6437-4a07-b14b-1b0eec02f6da', 'tp3ukmshape@ukm.edu.my', 'Dr. Rozilawati binti Ahmad', 'member', 'Timbalan Pengarah III', 'Pemasaran', '03-8927-2104'),
    ('c5c7b634-cf6d-41ee-937b-3d301bcbced2', 'tp4ukmshape@ukm.edu.my', 'Dr. Ng Lay Shi', 'member', 'Timbalan Pengarah IV', 'Pentadbiran', '03-8927-2105'),
    ('cf05ece3-bec1-40f4-8ae0-8a81c32144f8', 'rrozita@ukm.edu.my', 'Rozita binti Rani', 'admin', 'Ketua Pentadbiran', 'Pentadbiran', '03-8927-2130')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    position = EXCLUDED.position,
    department = EXCLUDED.department,
    phone = EXCLUDED.phone;

-- Step 4: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Verify
SELECT id, email, name, role, position FROM profiles ORDER BY role DESC, position;
