-- =====================================================
-- OPARS COMPLETE DATABASE RESET & FIX
-- Run this ENTIRE script in Supabase SQL Editor
-- This will fix the "Database error querying schema" issue
-- =====================================================

-- ============ STEP 1: DROP AND RECREATE PROFILES TABLE ============
-- Drop dependent tables first
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS proposals CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============ STEP 2: CREATE PROFILES TABLE WITH NEW COLUMNS ============
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  position TEXT,
  department TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============ STEP 3: CREATE PROPOSALS TABLE ============
CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  status TEXT CHECK (status IN ('Pending', 'Reviewing', 'Decided')) DEFAULT 'Pending',
  department TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  signed_off BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============ STEP 4: CREATE REVIEWS TABLE ============
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) NOT NULL,
  vote_status TEXT CHECK (vote_status IN ('Approve', 'Reject', 'Pending')) DEFAULT 'Pending',
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(proposal_id, reviewer_id)
);

-- ============ STEP 5: ENABLE RLS ============
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ============ STEP 6: CREATE RLS POLICIES FOR PROFILES ============
-- Allow everyone to read profiles (needed for displaying names)
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles
  FOR SELECT TO authenticated USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ============ STEP 7: CREATE RLS POLICIES FOR PROPOSALS ============
CREATE POLICY "Proposals are viewable by authenticated users" ON proposals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert proposals" ON proposals
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update proposals" ON proposals
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============ STEP 8: CREATE RLS POLICIES FOR REVIEWS ============
CREATE POLICY "Reviews are viewable by authenticated users" ON reviews
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own reviews" ON reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE TO authenticated USING (auth.uid() = reviewer_id);

-- ============ STEP 9: INSERT USER PROFILES ============
INSERT INTO profiles (id, email, name, role, position, department, phone)
VALUES 
    ('15d83955-90d2-4bd8-b463-c7575bcf9ab4', 'directorshape@ukm.edu.my', 'Pengarah UKMShape', 'admin', 'Pengarah', 'Pengurusan', '03-8927-2102'),
    ('64e42ebf-29b1-4d92-b0b2-98315193d06a', 'tp1ukmshape@ukm.edu.my', 'Dr. Kamarul Baraini binti Keliwon', 'member', 'Timbalan Pengarah I', 'Akademik', '03-8927-2101'),
    ('32cb9453-e366-44bb-81c1-32c82f174bcb', 'tp2ukmshape@ukm.edu.my', 'Prof. Madya Dr. Azahan bin Awang', 'member', 'Timbalan Pengarah II', 'Hal Ehwal Pelajar', '03-8927-2103'),
    ('dc155329-6437-4a07-b14b-1b0eec02f6da', 'tp3ukmshape@ukm.edu.my', 'Dr. Rozilawati binti Ahmad', 'member', 'Timbalan Pengarah III', 'Pemasaran', '03-8927-2104'),
    ('c5c7b634-cf6d-41ee-937b-3d301bcbced2', 'tp4ukmshape@ukm.edu.my', 'Dr. Ng Lay Shi', 'member', 'Timbalan Pengarah IV', 'Pentadbiran', '03-8927-2105'),
    ('cf05ece3-bec1-40f4-8ae0-8a81c32144f8', 'rrozita@ukm.edu.my', 'Rozita binti Rani', 'admin', 'Ketua Pentadbiran', 'Pentadbiran', '03-8927-2130');

-- ============ STEP 10: VERIFY ============
SELECT id, email, name, role, position FROM profiles ORDER BY role DESC, position;

-- =====================================================
-- DONE! Now try logging in with password: UKMShape2024!
-- =====================================================
