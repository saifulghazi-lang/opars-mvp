-- ================================================
-- OPARS Security Fixes
-- ================================================
-- Run this SQL in Supabase SQL Editor to fix linter warnings

-- Fix 1: check_quorum - Set immutable search_path
CREATE OR REPLACE FUNCTION public.check_quorum()
RETURNS TRIGGER AS $$
DECLARE
    total_members INTEGER;
    approval_count INTEGER;
    reject_count INTEGER;
    total_votes INTEGER;
BEGIN
    -- Count total committee members (role='member')
    SELECT COUNT(*) INTO total_members
    FROM public.profiles
    WHERE role = 'member';

    -- Count approvals for this proposal
    SELECT COUNT(*) INTO approval_count
    FROM public.reviews
    WHERE proposal_id = NEW.proposal_id
    AND vote_status = 'Approve';

    -- Count rejects for this proposal
    SELECT COUNT(*) INTO reject_count
    FROM public.reviews
    WHERE proposal_id = NEW.proposal_id
    AND vote_status = 'Reject';

    -- Total votes cast
    total_votes := approval_count + reject_count;

    -- Update proposal status based on vote tallies
    IF approval_count::FLOAT / NULLIF(total_members, 0) > 0.5 THEN
        -- Majority approved
        UPDATE public.proposals
        SET status = 'Decided', signed_off = TRUE
        WHERE id = NEW.proposal_id;
        
    ELSIF reject_count::FLOAT / NULLIF(total_members, 0) > 0.5 THEN
        -- Majority rejected
        UPDATE public.proposals
        SET status = 'Decided', signed_off = FALSE
        WHERE id = NEW.proposal_id;
        
    ELSIF total_votes > 0 THEN
        -- Voting in progress, but no majority yet
        UPDATE public.proposals
        SET status = 'Reviewing'
        WHERE id = NEW.proposal_id
        AND status != 'Decided';
        
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix 2: log_audit - Set immutable search_path
CREATE OR REPLACE FUNCTION public.log_audit(
  p_action TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.legal_audit_log (user_id, action, ip_address, resource_id, metadata)
  VALUES (auth.uid(), p_action, p_ip_address, p_resource_id, p_metadata)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
