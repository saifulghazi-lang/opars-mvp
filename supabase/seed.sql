-- IMPORTANT: You must create users in Supabase Auth first!
-- 1. Go to Authentication > Users in your Supabase Dashboard.
-- 2. Create a user 'admin@opars.com' and 'member@opars.com'.
-- 3. Copy their UUIDs and replace the placeholders below.

-- Seed Profiles
INSERT INTO profiles (id, email, role, department)
VALUES
  ('f68972d7-2479-4e7f-9c61-c270899a1599', 'admin@opars.com', 'admin', 'Secretariat'),
  ('4699e602-245a-445d-9afb-9614ffe056af', 'member@opars.com', 'member', 'Finance')
ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email, role = EXCLUDED.role, department = EXCLUDED.department;

-- Seed Proposals
INSERT INTO proposals (id, title, pdf_url, status, department, created_by, signed_off)
VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Q4 Budget Approval', 'https://example.com/q4-budget.pdf', 'Pending', 'Finance', 'f68972d7-2479-4e7f-9c61-c270899a1599', FALSE),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'New Office Lease', 'https://example.com/lease.pdf', 'Reviewing', 'Operations', 'f68972d7-2479-4e7f-9c61-c270899a1599', FALSE)
ON CONFLICT (id) DO NOTHING;
