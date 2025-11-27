-- Migration: Add signature_data column to reviews table
-- This stores the Base64-encoded signature image for approvals

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS signature_data TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN reviews.signature_data IS 'Base64-encoded signature image captured during approval';
