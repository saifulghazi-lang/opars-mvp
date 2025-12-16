-- =====================================================
-- OPARS Complete Fix - Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Add missing columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Step 2: Allow service role to insert profiles (for initial setup)
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;
CREATE POLICY "Service role can manage profiles" ON profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Step 3: Insert/Update profiles for existing users
DO $$
DECLARE
    v_id UUID;
BEGIN
    -- Pengarah
    SELECT id INTO v_id FROM auth.users WHERE email = 'directorshape@ukm.edu.my';
    IF v_id IS NOT NULL THEN
        INSERT INTO profiles (id, email, name, role, position, department, phone)
        VALUES (v_id, 'directorshape@ukm.edu.my', 'Pengarah UKMShape', 'admin', 'Pengarah', 'Pengurusan', '03-8927-2102')
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, position = EXCLUDED.position, department = EXCLUDED.department, phone = EXCLUDED.phone;
    END IF;

    -- TP1
    SELECT id INTO v_id FROM auth.users WHERE email = 'tp1ukmshape@ukm.edu.my';
    IF v_id IS NOT NULL THEN
        INSERT INTO profiles (id, email, name, role, position, department, phone)
        VALUES (v_id, 'tp1ukmshape@ukm.edu.my', 'Dr. Kamarul Baraini binti Keliwon', 'member', 'Timbalan Pengarah I', 'Akademik', '03-8927-2101')
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, position = EXCLUDED.position, department = EXCLUDED.department, phone = EXCLUDED.phone;
    END IF;

    -- TP2
    SELECT id INTO v_id FROM auth.users WHERE email = 'tp2ukmshape@ukm.edu.my';
    IF v_id IS NOT NULL THEN
        INSERT INTO profiles (id, email, name, role, position, department, phone)
        VALUES (v_id, 'tp2ukmshape@ukm.edu.my', 'Prof. Madya Dr. Azahan bin Awang', 'member', 'Timbalan Pengarah II', 'Hal Ehwal Pelajar', '03-8927-2103')
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, position = EXCLUDED.position, department = EXCLUDED.department, phone = EXCLUDED.phone;
    END IF;

    -- TP3
    SELECT id INTO v_id FROM auth.users WHERE email = 'tp3ukmshape@ukm.edu.my';
    IF v_id IS NOT NULL THEN
        INSERT INTO profiles (id, email, name, role, position, department, phone)
        VALUES (v_id, 'tp3ukmshape@ukm.edu.my', 'Dr. Rozilawati binti Ahmad', 'member', 'Timbalan Pengarah III', 'Pemasaran', '03-8927-2104')
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, position = EXCLUDED.position, department = EXCLUDED.department, phone = EXCLUDED.phone;
    END IF;

    -- TP4
    SELECT id INTO v_id FROM auth.users WHERE email = 'tp4ukmshape@ukm.edu.my';
    IF v_id IS NOT NULL THEN
        INSERT INTO profiles (id, email, name, role, position, department, phone)
        VALUES (v_id, 'tp4ukmshape@ukm.edu.my', 'Dr. Ng Lay Shi', 'member', 'Timbalan Pengarah IV', 'Pentadbiran', '03-8927-2105')
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, position = EXCLUDED.position, department = EXCLUDED.department, phone = EXCLUDED.phone;
    END IF;

    -- Ketua Pentadbiran
    SELECT id INTO v_id FROM auth.users WHERE email = 'rrozita@ukm.edu.my';
    IF v_id IS NOT NULL THEN
        INSERT INTO profiles (id, email, name, role, position, department, phone)
        VALUES (v_id, 'rrozita@ukm.edu.my', 'Rozita binti Rani', 'admin', 'Ketua Pentadbiran', 'Pentadbiran', '03-8927-2130')
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, position = EXCLUDED.position, department = EXCLUDED.department, phone = EXCLUDED.phone;
    END IF;
END $$;

-- Step 4: Verify
SELECT email, name, role, position FROM profiles ORDER BY role DESC, position;
