-- ================================================
-- OPARS Legal Audit Trail
-- ================================================
-- Immutable audit log table for compliance and legal purposes
-- No user (including admins) can UPDATE or DELETE records

-- Create audit log table
CREATE TABLE legal_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  action TEXT NOT NULL,
  ip_address TEXT,
  resource_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE legal_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Allow INSERT for authenticated users
CREATE POLICY "Users can insert audit logs" ON legal_audit_log
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow SELECT for own records (members can view their own logs)
CREATE POLICY "Users can view own audit logs" ON legal_audit_log
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Allow SELECT for all records (admins can view all logs)
CREATE POLICY "Admins can view all audit logs" ON legal_audit_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- NO UPDATE POLICY - This means NO ONE can update
-- NO DELETE POLICY - This means NO ONE can delete

-- Create index for performance
CREATE INDEX idx_legal_audit_log_user_id ON legal_audit_log(user_id);
CREATE INDEX idx_legal_audit_log_timestamp ON legal_audit_log(timestamp DESC);
CREATE INDEX idx_legal_audit_log_resource_id ON legal_audit_log(resource_id);

-- Helper function to log actions (optional, for convenience)
CREATE OR REPLACE FUNCTION log_audit(
  p_action TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO legal_audit_log (user_id, action, ip_address, resource_id, metadata)
  VALUES (auth.uid(), p_action, p_ip_address, p_resource_id, p_metadata)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
