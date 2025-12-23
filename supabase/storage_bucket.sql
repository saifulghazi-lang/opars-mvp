-- =====================================================
-- Fix Storage RLS Policies for Proposals Bucket
-- Run this in Supabase SQL Editor
-- =====================================================

-- First, drop any existing policies that might conflict
DROP POLICY IF EXISTS "Authenticated users can upload proposals" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for proposals" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own proposals" ON storage.objects;
DROP POLICY IF EXISTS "allow_uploads" ON storage.objects;
DROP POLICY IF EXISTS "allow_public_read" ON storage.objects;

-- Allow ANY authenticated user to upload to proposals bucket
CREATE POLICY "Allow authenticated uploads to proposals"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'proposals');

-- Allow ANY authenticated user to update files in proposals bucket
CREATE POLICY "Allow authenticated updates to proposals"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'proposals');

-- Allow public read access (so PDFs can be viewed)
CREATE POLICY "Allow public read from proposals"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'proposals');

-- Allow authenticated users to delete files from proposals bucket
CREATE POLICY "Allow authenticated deletes from proposals"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'proposals');
