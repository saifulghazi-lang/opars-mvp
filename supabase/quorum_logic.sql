-- ================================================
-- OPARS Quorum Logic
-- ================================================
-- This function automatically updates proposal status based on votes
-- Trigger: Runs after INSERT/UPDATE on reviews table

-- Function: check_quorum
CREATE OR REPLACE FUNCTION check_quorum()
RETURNS TRIGGER AS $$
DECLARE
    total_members INTEGER;
    approval_count INTEGER;
    reject_count INTEGER;
    total_votes INTEGER;
BEGIN
    -- Count total committee members (role='member')
    SELECT COUNT(*) INTO total_members
    FROM profiles
    WHERE role = 'member';

    -- Count approvals for this proposal
    SELECT COUNT(*) INTO approval_count
    FROM reviews
    WHERE proposal_id = NEW.proposal_id
    AND vote_status = 'Approve';

    -- Count rejects for this proposal
    SELECT COUNT(*) INTO reject_count
    FROM reviews
    WHERE proposal_id = NEW.proposal_id
    AND vote_status = 'Reject';

    -- Total votes cast
    total_votes := approval_count + reject_count;

    -- Update proposal status based on vote tallies
    -- Logic:
    -- 1. If approvals > 50% of total members → Decided + Approved (signed_off = TRUE)
    -- 2. If rejects > 50% of total members → Decided + Rejected (signed_off = FALSE)
    -- 3. If votes are coming in but no majority → Reviewing
    -- 4. Otherwise → Pending (no votes yet)

    IF approval_count::FLOAT / total_members > 0.5 THEN
        -- Majority approved
        UPDATE proposals
        SET status = 'Decided', signed_off = TRUE
        WHERE id = NEW.proposal_id;
        
    ELSIF reject_count::FLOAT / total_members > 0.5 THEN
        -- Majority rejected
        UPDATE proposals
        SET status = 'Decided', signed_off = FALSE
        WHERE id = NEW.proposal_id;
        
    ELSIF total_votes > 0 THEN
        -- Voting in progress, but no majority yet
        UPDATE proposals
        SET status = 'Reviewing'
        WHERE id = NEW.proposal_id
        AND status != 'Decided'; -- Don't override Decided status
        
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Run check_quorum after INSERT or UPDATE on reviews
DROP TRIGGER IF EXISTS trigger_check_quorum ON reviews;
CREATE TRIGGER trigger_check_quorum
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION check_quorum();
