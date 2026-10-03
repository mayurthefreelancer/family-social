CREATE TABLE IF NOT EXISTS admin_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_code VARCHAR(32) NOT NULL UNIQUE,
  family_id UUID REFERENCES families(id) ON DELETE SET NULL,
  requester_email VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  priority VARCHAR(32) NOT NULL DEFAULT 'medium',
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  target_entity_type VARCHAR(64),
  target_entity_id VARCHAR(255),
  resolution_note TEXT,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
