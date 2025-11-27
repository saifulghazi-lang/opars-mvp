-- IMPORTANT: You must create users in Supabase Auth first!
-- 1. Go to Authentication > Users in your Supabase Dashboard.
-- 2. Create a user 'admin@opars.com' and 'member@opars.com'.
-- 3. Copy their UUIDs and replace the placeholders below.

-- Seed Profiles
INSERT INTO profiles (id, email, role, department)
VALUES
  ('c8875cc9-2b61-4053-a7cd-16d486898673', 'admin@opars.com', 'admin', 'Secretariat'),
  ('4699e602-245a-445d-9afb-9614ffe056af', 'member@opars.com', 'member', 'Finance');

-- Seed Proposals
INSERT INTO proposals (id, title, pdf_url, status, department, created_by, signed_off)
VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Q4 Budget Approval', 'https://example.com/q4-budget.pdf', 'Pending', 'Finance', 'c8875cc9-2b61-4053-a7cd-16d486898673', FALSE),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'New Office Lease', 'https://example.com/lease.pdf', 'Reviewing', 'Operations', 'c8875cc9-2b61-4053-a7cd-16d486898673', FALSE);
