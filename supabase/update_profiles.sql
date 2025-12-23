-- =====================================================
-- OPARS Profile Schema Update
-- Run this in Supabase SQL Editor to add missing columns
-- =====================================================

-- Add missing columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update profiles for the newly created users
UPDATE profiles p
SET 
    name = CASE 
        WHEN p.email = 'directorshape@ukm.edu.my' THEN 'Pengarah UKMShape'
        WHEN p.email = 'tp1ukmshape@ukm.edu.my' THEN 'Dr. Kamarul Baraini binti Keliwon'
        WHEN p.email = 'tp2ukmshape@ukm.edu.my' THEN 'Prof. Madya Dr. Azahan bin Awang'
        WHEN p.email = 'tp3ukmshape@ukm.edu.my' THEN 'Dr. Rozilawati binti Ahmad'
        WHEN p.email = 'tp4ukmshape@ukm.edu.my' THEN 'Dr. Ng Lay Shi'
        WHEN p.email = 'rrozita@ukm.edu.my' THEN 'Rozita binti Rani'
        ELSE p.name
    END,
    position = CASE 
        WHEN p.email = 'directorshape@ukm.edu.my' THEN 'Pengarah'
        WHEN p.email = 'tp1ukmshape@ukm.edu.my' THEN 'Timbalan Pengarah I'
        WHEN p.email = 'tp2ukmshape@ukm.edu.my' THEN 'Timbalan Pengarah II'
        WHEN p.email = 'tp3ukmshape@ukm.edu.my' THEN 'Timbalan Pengarah III'
        WHEN p.email = 'tp4ukmshape@ukm.edu.my' THEN 'Timbalan Pengarah IV'
        WHEN p.email = 'rrozita@ukm.edu.my' THEN 'Ketua Pentadbiran'
        ELSE p.position
    END,
    department = CASE 
        WHEN p.email = 'directorshape@ukm.edu.my' THEN 'Pengurusan'
        WHEN p.email = 'tp1ukmshape@ukm.edu.my' THEN 'Akademik'
        WHEN p.email = 'tp2ukmshape@ukm.edu.my' THEN 'Hal Ehwal Pelajar'
        WHEN p.email = 'tp3ukmshape@ukm.edu.my' THEN 'Pemasaran'
        WHEN p.email = 'tp4ukmshape@ukm.edu.my' THEN 'Pentadbiran'
        WHEN p.email = 'rrozita@ukm.edu.my' THEN 'Pentadbiran'
        ELSE p.department
    END,
    role = CASE 
        WHEN p.email IN ('directorshape@ukm.edu.my', 'rrozita@ukm.edu.my') THEN 'admin'
        ELSE 'member'
    END,
    phone = CASE 
        WHEN p.email = 'directorshape@ukm.edu.my' THEN '03-8927-2102'
        WHEN p.email = 'tp1ukmshape@ukm.edu.my' THEN '03-8927-2101'
        WHEN p.email = 'tp2ukmshape@ukm.edu.my' THEN '03-8927-2103'
        WHEN p.email = 'tp3ukmshape@ukm.edu.my' THEN '03-8927-2104'
        WHEN p.email = 'tp4ukmshape@ukm.edu.my' THEN '03-8927-2105'
        WHEN p.email = 'rrozita@ukm.edu.my' THEN '03-8927-2130'
        ELSE p.phone
    END
WHERE p.email IN (
    'directorshape@ukm.edu.my',
    'tp1ukmshape@ukm.edu.my', 
    'tp2ukmshape@ukm.edu.my',
    'tp3ukmshape@ukm.edu.my',
    'tp4ukmshape@ukm.edu.my',
    'rrozita@ukm.edu.my'
);

-- Verify
SELECT email, name, role, position, department FROM profiles ORDER BY role DESC, position;
