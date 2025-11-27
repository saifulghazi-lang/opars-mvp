-- Drop existing constraints
ALTER TABLE proposals DROP CONSTRAINT proposals_created_by_fkey;
ALTER TABLE reviews DROP CONSTRAINT reviews_reviewer_id_fkey;

-- Re-add constraints with ON DELETE CASCADE
ALTER TABLE proposals
ADD CONSTRAINT proposals_created_by_fkey
FOREIGN KEY (created_by)
REFERENCES profiles(id)
ON DELETE CASCADE;

ALTER TABLE reviews
ADD CONSTRAINT reviews_reviewer_id_fkey
FOREIGN KEY (reviewer_id)
REFERENCES profiles(id)
ON DELETE CASCADE;
