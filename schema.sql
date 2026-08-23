-- D1 schema for lead capture (see functions/api/lead.ts).
--
-- Create the database once:
--   npx wrangler d1 create menhati-leads
-- Then apply this schema:
--   npx wrangler d1 execute menhati-leads --remote --file=./schema.sql
--
-- Finally bind it in the Cloudflare Pages project settings as: LEADS_DB

CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  message     TEXT,
  context     TEXT,          -- which scholarship / page the lead came from
  page        TEXT,
  country     TEXT,          -- approximate, from Cloudflare's CF-IPCountry header
  received_at TEXT NOT NULL, -- ISO 8601 UTC
  status      TEXT DEFAULT 'new'  -- new | contacted | client | closed
);

CREATE INDEX IF NOT EXISTS idx_leads_received_at ON leads (received_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
