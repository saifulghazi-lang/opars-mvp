-- =====================================================
-- Insert profiles for UKMShape committee users
-- Run this in Supabase SQL Editor
-- =====================================================

-- Insert profiles for all auth users that don't have profiles yet
INSERT INTO profiles (id, email, name, role, position, department, phone)
SELECT 
    au.id,
    au.email,
    CASE 
        WHEN au.email = 'directorshape@ukm.edu.my' THEN 'Pengarah UKMShape'
        WHEN au.email = 'tp1ukmshape@ukm.edu.my' THEN 'Dr. Kamarul Baraini binti Keliwon'
        WHEN au.email = 'tp2ukmshape@ukm.edu.my' THEN 'Prof. Madya Dr. Azahan bin Awang'
        WHEN au.email = 'tp3ukmshape@ukm.edu.my' THEN 'Dr. Rozilawati binti Ahmad'
        WHEN au.email = 'tp4ukmshape@ukm.edu.my' THEN 'Dr. Ng Lay Shi'
        WHEN au.email = 'rrozita@ukm.edu.my' THEN 'Rozita binti Rani'
        ELSE NULL
    END as name,
    CASE 
        WHEN au.email IN ('directorshape@ukm.edu.my', 'rrozita@ukm.edu.my') THEN 'admin'
        ELSE 'member'
    END as role,
    CASE 
        WHEN au.email = 'directorshape@ukm.edu.my' THEN 'Pengarah'
        WHEN au.email = 'tp1ukmshape@ukm.edu.my' THEN 'Timbalan Pengarah I'
        WHEN au.email = 'tp2ukmshape@ukm.edu.my' THEN 'Timbalan Pengarah II'
        WHEN au.email = 'tp3ukmshape@ukm.edu.my' THEN 'Timbalan Pengarah III'
        WHEN au.email = 'tp4ukmshape@ukm.edu.my' THEN 'Timbalan Pengarah IV'
        WHEN au.email = 'rrozita@ukm.edu.my' THEN 'Ketua Pentadbiran'
        ELSE NULL
    END as position,
    CASE 
        WHEN au.email = 'directorshape@ukm.edu.my' THEN 'Pengurusan'
        WHEN au.email = 'tp1ukmshape@ukm.edu.my' THEN 'Akademik'
        WHEN au.email = 'tp2ukmshape@ukm.edu.my' THEN 'Hal Ehwal Pelajar'
        WHEN au.email = 'tp3ukmshape@ukm.edu.my' THEN 'Pemasaran'
        WHEN au.email = 'tp4ukmshape@ukm.edu.my' THEN 'Pentadbiran'
        WHEN au.email = 'rrozita@ukm.edu.my' THEN 'Pentadbiran'
        ELSE NULL
    END as department,
    CASE 
        WHEN au.email = 'directorshape@ukm.edu.my' THEN '03-8927-2102'
        WHEN au.email = 'tp1ukmshape@ukm.edu.my' THEN '03-8927-2101'
        WHEN au.email = 'tp2ukmshape@ukm.edu.my' THEN '03-8927-2103'
        WHEN au.email = 'tp3ukmshape@ukm.edu.my' THEN '03-8927-2104'
        WHEN au.email = 'tp4ukmshape@ukm.edu.my' THEN '03-8927-2105'
        WHEN au.email = 'rrozita@ukm.edu.my' THEN '03-8927-2130'
        ELSE NULL
    END as phone
FROM auth.users au
WHERE au.email IN (
    'directorshape@ukm.edu.my',
    'tp1ukmshape@ukm.edu.my', 
    'tp2ukmshape@ukm.edu.my',
    'tp3ukmshape@ukm.edu.my',
    'tp4ukmshape@ukm.edu.my',
    'rrozita@ukm.edu.my'
)
AND NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    position = EXCLUDED.position,
    department = EXCLUDED.department,
    phone = EXCLUDED.phone;

-- Verify all profiles
SELECT email, name, role, position, department FROM profiles ORDER BY role DESC, position;
