-- ============================================================
-- SentinelGo Endpoint Protector — Supabase PostgreSQL Schema
-- Version: 2.0  |  Compatible: Supabase + PostgreSQL 15+
-- BRD Reference: v1.0  |  Generated: 2025
-- ============================================================
-- HOW TO USE:
--   1. Open your Supabase project → SQL Editor
--   2. Paste this entire file and click "Run"
--   3. Uncomment SEED DATA section at bottom if needed
-- ============================================================


-- ============================================================
-- SECTION 0 — EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";        -- gen_random_uuid(), crypt()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";         -- trigram search on text fields


-- ============================================================
-- SECTION 1 — ENUM TYPES
-- ============================================================

DO $$ BEGIN
  CREATE TYPE device_action_type   AS ENUM ('ALLOW', 'BLOCK', 'READ_ONLY', 'ENCRYPT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE policy_status        AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT', 'DEPRECATED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_type            AS ENUM ('LOCAL', 'AD', 'AZURE_AD', 'LDAP');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE computer_status      AS ENUM ('ONLINE', 'OFFLINE', 'MAINTENANCE', 'DECOMMISSIONED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE alert_severity       AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE log_level            AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE content_action       AS ENUM ('BLOCK', 'ALLOW', 'ENCRYPT', 'QUARANTINE', 'NOTIFY');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE scan_status          AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE backup_status        AS ENUM ('RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE encryption_algorithm AS ENUM ('AES-256', 'AES-128', 'RSA-2048', 'RSA-4096');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ============================================================
-- SECTION 2 — HELPER FUNCTION: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- SECTION 3 — CORE ENTITIES
-- ============================================================

-- ── 3.1 Departments ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  department_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  VARCHAR(100)  NOT NULL UNIQUE,
  description           TEXT,
  parent_department_id  UUID          REFERENCES departments(department_id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE  departments IS 'Organisational departments for grouping users and computers';
COMMENT ON COLUMN departments.parent_department_id IS 'Supports nested/hierarchical department structure';


-- ── 3.2 Admin Profiles (extends Supabase auth.users) ────────
-- Supabase creates auth.users automatically.
-- We store app-level profile data in a separate table linked by UUID.
CREATE TABLE IF NOT EXISTS profiles (
  profile_id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username              VARCHAR(255)  NOT NULL UNIQUE,
  display_name          VARCHAR(255),
  user_type             user_type     NOT NULL DEFAULT 'LOCAL',
  department_id         UUID          REFERENCES departments(department_id) ON DELETE SET NULL,
  is_active             BOOLEAN       NOT NULL DEFAULT TRUE,
  is_admin              BOOLEAN       NOT NULL DEFAULT FALSE,
  ad_dn                 TEXT,                          -- Active Directory Distinguished Name
  azure_ad_object_id    UUID,
  ldap_dn               TEXT,
  last_login            TIMESTAMPTZ,
  password_changed_at   TIMESTAMPTZ,
  avatar_url            TEXT,
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE  profiles IS 'App profile data linked to Supabase auth.users';
COMMENT ON COLUMN profiles.ad_dn IS 'Active Directory Distinguished Name for AD-synced accounts';


-- ── 3.3 Managed Users (endpoint users, not admin portal users)
CREATE TABLE IF NOT EXISTS managed_users (
  user_id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username              VARCHAR(255)  NOT NULL UNIQUE,
  email                 VARCHAR(255),
  display_name          VARCHAR(255),
  user_type             user_type     NOT NULL DEFAULT 'LOCAL',
  department_id         UUID          REFERENCES departments(department_id) ON DELETE SET NULL,
  is_active             BOOLEAN       NOT NULL DEFAULT TRUE,
  ad_dn                 TEXT,
  azure_ad_object_id    UUID,
  ldap_dn               TEXT,
  last_login            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_managed_users_updated_at
  BEFORE UPDATE ON managed_users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE managed_users IS 'Endpoint users monitored by the DLP system (not admin portal accounts)';


-- ── 3.4 User Groups ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_groups (
  group_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name   VARCHAR(100)  NOT NULL UNIQUE,
  description  TEXT,
  is_ad_group  BOOLEAN       NOT NULL DEFAULT FALSE,
  ad_group_dn  TEXT,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_user_groups_updated_at
  BEFORE UPDATE ON user_groups
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ── 3.5 User Group Memberships ───────────────────────────────
CREATE TABLE IF NOT EXISTS user_group_memberships (
  membership_id  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES managed_users(user_id) ON DELETE CASCADE,
  group_id       UUID        NOT NULL REFERENCES user_groups(group_id)  ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, group_id)
);


-- ── 3.6 Computers / Endpoints ────────────────────────────────
CREATE TABLE IF NOT EXISTS computers (
  computer_id     UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  computer_name   VARCHAR(255)   NOT NULL,
  domain_name     VARCHAR(255),
  ip_address      INET,
  mac_address     MACADDR,
  os_type         VARCHAR(50),                         -- Windows, macOS, Linux
  os_version      VARCHAR(50),
  client_version  VARCHAR(50),
  status          computer_status NOT NULL DEFAULT 'OFFLINE',
  last_seen       TIMESTAMPTZ,
  department_id   UUID           REFERENCES departments(department_id) ON DELETE SET NULL,
  tags            TEXT[]         DEFAULT '{}',         -- free-form tags for grouping
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  UNIQUE (computer_name, domain_name)
);

CREATE OR REPLACE TRIGGER trg_computers_updated_at
  BEFORE UPDATE ON computers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON COLUMN computers.tags IS 'Free-form labels for flexible grouping without a formal group';


-- ── 3.7 Computer Groups ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS computer_groups (
  group_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name   VARCHAR(100)  NOT NULL UNIQUE,
  description  TEXT,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_computer_groups_updated_at
  BEFORE UPDATE ON computer_groups
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ── 3.8 Computer Group Memberships ───────────────────────────
CREATE TABLE IF NOT EXISTS computer_group_memberships (
  membership_id  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  computer_id    UUID        NOT NULL REFERENCES computers(computer_id)      ON DELETE CASCADE,
  group_id       UUID        NOT NULL REFERENCES computer_groups(group_id)   ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (computer_id, group_id)
);


-- ============================================================
-- SECTION 4 — POLICIES MODULE
-- ============================================================

-- ── 4.1 Policies ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS policies (
  policy_id    UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name  VARCHAR(255)  NOT NULL,
  description  TEXT,
  policy_type  VARCHAR(50)   NOT NULL CHECK (policy_type IN (
                  'DEVICE_CONTROL','CONTENT_AWARE','ENCRYPTION','EDISCOVERY','NETWORK')),
  status       policy_status NOT NULL DEFAULT 'DRAFT',
  priority     INTEGER       NOT NULL DEFAULT 100 CHECK (priority > 0),
  version      INTEGER       NOT NULL DEFAULT 1,
  created_by   UUID          REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_policies_updated_at
  BEFORE UPDATE ON policies
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON COLUMN policies.priority IS 'Lower number = higher priority. Evaluated in ascending order.';


-- ── 4.2 Policy Rules ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS policy_rules (
  rule_id         UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id       UUID              NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
  rule_name       VARCHAR(255)      NOT NULL,
  condition_type  VARCHAR(50)       NOT NULL CHECK (condition_type IN (
                    'DEVICE_CLASS','USER_GROUP','COMPUTER_GROUP',
                    'CONTENT_TYPE','FILE_EXTENSION','TIME_RANGE','DEPARTMENT')),
  condition_value TEXT              NOT NULL,
  action          device_action_type NOT NULL,
  is_active       BOOLEAN           NOT NULL DEFAULT TRUE,
  rule_order      INTEGER           NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN policy_rules.rule_order IS 'Within a policy, rules are evaluated in ascending rule_order';


-- ── 4.3 Policy Assignments ───────────────────────────────────
CREATE TABLE IF NOT EXISTS policy_assignments (
  assignment_id  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id      UUID        NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
  target_type    VARCHAR(20) NOT NULL CHECK (target_type IN (
                   'USER','USER_GROUP','COMPUTER','COMPUTER_GROUP','DEPARTMENT')),
  target_id      UUID        NOT NULL,
  is_active      BOOLEAN     NOT NULL DEFAULT TRUE,
  assigned_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_by    UUID        REFERENCES profiles(profile_id) ON DELETE SET NULL
);


-- ============================================================
-- SECTION 5 — DEVICE CONTROL MODULE
-- ============================================================

-- ── 5.1 Device Classes ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS device_classes (
  class_id      UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  class_name    VARCHAR(100) NOT NULL UNIQUE,
  description   TEXT,
  is_custom     BOOLEAN      NOT NULL DEFAULT FALSE,
  default_action device_action_type NOT NULL DEFAULT 'BLOCK',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN device_classes.default_action IS 'Fallback action when no explicit policy rule matches';


-- ── 5.2 Devices ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS devices (
  device_id       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  device_name     VARCHAR(255),
  vendor_id       VARCHAR(10),
  product_id      VARCHAR(10),
  serial_number   VARCHAR(255),
  device_class_id UUID         REFERENCES device_classes(class_id) ON DELETE SET NULL,
  is_whitelisted  BOOLEAN      NOT NULL DEFAULT FALSE,
  is_blacklisted  BOOLEAN      NOT NULL DEFAULT FALSE,
  notes           TEXT,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_device_not_both CHECK (NOT (is_whitelisted AND is_blacklisted))
);

CREATE OR REPLACE TRIGGER trg_devices_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON CONSTRAINT chk_device_not_both ON devices
  IS 'A device cannot be simultaneously whitelisted and blacklisted';


-- ── 5.3 Device Sessions ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS device_sessions (
  session_id             UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id              UUID               NOT NULL REFERENCES devices(device_id)   ON DELETE CASCADE,
  computer_id            UUID               NOT NULL REFERENCES computers(computer_id) ON DELETE CASCADE,
  user_id                UUID               REFERENCES managed_users(user_id)        ON DELETE SET NULL,
  action_taken           device_action_type NOT NULL,
  connection_time        TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  disconnection_time     TIMESTAMPTZ,
  policy_id              UUID               REFERENCES policies(policy_id)           ON DELETE SET NULL,
  file_count             INTEGER            NOT NULL DEFAULT 0,
  data_transferred_bytes BIGINT             NOT NULL DEFAULT 0,
  CONSTRAINT chk_session_times CHECK (
    disconnection_time IS NULL OR disconnection_time >= connection_time
  )
);

COMMENT ON COLUMN device_sessions.data_transferred_bytes IS 'Bytes transferred during this session';


-- ============================================================
-- SECTION 6 — CONTENT AWARE PROTECTION MODULE
-- ============================================================

-- ── 6.1 Content Patterns ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_patterns (
  pattern_id    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_name  VARCHAR(255) NOT NULL,
  pattern_type  VARCHAR(50)  NOT NULL CHECK (pattern_type IN (
                  'REGEX','KEYWORD','DICTIONARY','FINGERPRINT','ML_MODEL')),
  pattern_value TEXT         NOT NULL,
  description   TEXT,
  is_predefined BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN content_patterns.is_predefined IS 'TRUE = system built-in pattern (credit cards, SSN, etc.)';


-- ── 6.2 Content Aware Policies ───────────────────────────────
CREATE TABLE IF NOT EXISTS content_aware_policies (
  policy_id    UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name  VARCHAR(255)   NOT NULL,
  description  TEXT,
  status       policy_status  NOT NULL DEFAULT 'DRAFT',
  action       content_action NOT NULL,
  created_by   UUID           REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_content_aware_policies_updated_at
  BEFORE UPDATE ON content_aware_policies
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ── 6.3 Content Policy Rules ─────────────────────────────────
CREATE TABLE IF NOT EXISTS content_policy_rules (
  rule_id       UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id     UUID           NOT NULL REFERENCES content_aware_policies(policy_id) ON DELETE CASCADE,
  pattern_id    UUID           NOT NULL REFERENCES content_patterns(pattern_id)       ON DELETE CASCADE,
  file_types    TEXT[]         DEFAULT '{}',   -- e.g. '{pdf,docx,xlsx}'
  min_file_size BIGINT         CHECK (min_file_size >= 0),
  max_file_size BIGINT         CHECK (max_file_size >= 0),
  action        content_action NOT NULL,
  is_active     BOOLEAN        NOT NULL DEFAULT TRUE,
  CONSTRAINT chk_file_size_range CHECK (
    min_file_size IS NULL OR max_file_size IS NULL OR max_file_size >= min_file_size
  )
);


-- ── 6.4 Content Inspection Results ───────────────────────────
CREATE TABLE IF NOT EXISTS content_inspection_results (
  inspection_id   UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name       VARCHAR(255)   NOT NULL,
  file_path       TEXT           NOT NULL,
  file_size       BIGINT         CHECK (file_size >= 0),
  file_hash       VARCHAR(64),                -- SHA-256 hex string
  file_type       VARCHAR(100),
  user_id         UUID           REFERENCES managed_users(user_id)          ON DELETE SET NULL,
  computer_id     UUID           REFERENCES computers(computer_id)           ON DELETE SET NULL,
  policy_id       UUID           REFERENCES content_aware_policies(policy_id) ON DELETE SET NULL,
  pattern_matches JSONB          DEFAULT '[]', -- [{pattern_id, pattern_name, match_count, snippets:[]}]
  action_taken    content_action NOT NULL,
  inspection_time TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SECTION 7 — eDISCOVERY MODULE
-- ============================================================

-- ── 7.1 eDiscovery Policies ──────────────────────────────────
CREATE TABLE IF NOT EXISTS ediscovery_policies (
  policy_id    UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name  VARCHAR(255)  NOT NULL,
  description  TEXT,
  status       policy_status NOT NULL DEFAULT 'DRAFT',
  -- scan_scope: {computers:[uuid], groups:[uuid], paths:[string], exclude_paths:[string]}
  scan_scope   JSONB         NOT NULL DEFAULT '{}',
  -- schedule: {type:"ONCE|DAILY|WEEKLY|MONTHLY", cron:"...", next_run:"..."}
  schedule     JSONB         DEFAULT '{}',
  created_by   UUID          REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_ediscovery_policies_updated_at
  BEFORE UPDATE ON ediscovery_policies
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ── 7.2 eDiscovery Scans ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS ediscovery_scans (
  scan_id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id            UUID        NOT NULL REFERENCES ediscovery_policies(policy_id) ON DELETE CASCADE,
  scan_name            VARCHAR(255) NOT NULL,
  status               scan_status NOT NULL DEFAULT 'PENDING',
  scheduled_time       TIMESTAMPTZ,
  start_time           TIMESTAMPTZ,
  end_time             TIMESTAMPTZ,
  total_files_scanned  BIGINT      NOT NULL DEFAULT 0,
  files_with_matches   BIGINT      NOT NULL DEFAULT 0,
  error_message        TEXT,
  created_by           UUID        REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_scan_times CHECK (end_time IS NULL OR end_time >= start_time)
);


-- ── 7.3 eDiscovery Results ───────────────────────────────────
CREATE TABLE IF NOT EXISTS ediscovery_results (
  result_id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id           UUID        NOT NULL REFERENCES ediscovery_scans(scan_id) ON DELETE CASCADE,
  file_name         VARCHAR(255) NOT NULL,
  file_path         TEXT        NOT NULL,
  file_size         BIGINT      CHECK (file_size >= 0),
  file_hash         VARCHAR(64),
  file_type         VARCHAR(100),
  sensitivity_level VARCHAR(20) NOT NULL DEFAULT 'LOW'
                    CHECK (sensitivity_level IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  -- matched_patterns: [{pattern_id, pattern_name, match_count}]
  matched_patterns  JSONB       DEFAULT '[]',
  -- remediation: {action:"DELETE|QUARANTINE|ENCRYPT|NONE", done_at:"...", done_by:"..."}
  remediation       JSONB       DEFAULT '{"action":"NONE"}',
  is_false_positive BOOLEAN     NOT NULL DEFAULT FALSE,
  computer_id       UUID        REFERENCES computers(computer_id)    ON DELETE SET NULL,
  user_id           UUID        REFERENCES managed_users(user_id)    ON DELETE SET NULL,
  discovered_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN ediscovery_results.is_false_positive IS 'Marked by analyst; excludes from compliance counts';


-- ============================================================
-- SECTION 8 — ENCRYPTION MODULE
-- ============================================================

-- ── 8.1 Encryption Keys ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS encryption_keys (
  key_id        UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name      VARCHAR(255)         NOT NULL,
  key_algorithm encryption_algorithm NOT NULL,
  -- key_value stored as BYTEA; encrypt at application layer before insert
  key_value     BYTEA                NOT NULL,
  key_size      INTEGER              CHECK (key_size IN (128,256,2048,4096)),
  is_active     BOOLEAN              NOT NULL DEFAULT TRUE,
  created_by    UUID                 REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ
);

COMMENT ON COLUMN encryption_keys.key_value IS 'Key material encrypted at application level before storage';


-- ── 8.2 Encrypted Devices ────────────────────────────────────
CREATE TABLE IF NOT EXISTS encrypted_devices (
  device_encryption_id UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id            UUID                 NOT NULL REFERENCES devices(device_id)   ON DELETE CASCADE,
  computer_id          UUID                 NOT NULL REFERENCES computers(computer_id) ON DELETE CASCADE,
  user_id              UUID                 REFERENCES managed_users(user_id)        ON DELETE SET NULL,
  key_id               UUID                 REFERENCES encryption_keys(key_id)       ON DELETE SET NULL,
  encryption_algorithm encryption_algorithm NOT NULL,
  is_encrypted         BOOLEAN              NOT NULL DEFAULT TRUE,
  encryption_time      TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  last_access_time     TIMESTAMPTZ
);


-- ── 8.3 Encryption Operations Log ────────────────────────────
CREATE TABLE IF NOT EXISTS encryption_operations (
  operation_id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  device_encryption_id UUID        NOT NULL REFERENCES encrypted_devices(device_encryption_id) ON DELETE CASCADE,
  operation_type       VARCHAR(20) NOT NULL CHECK (operation_type IN ('ENCRYPT','DECRYPT','PASSWORD_CHANGE','KEY_ROTATION')),
  file_name            VARCHAR(255),
  file_size            BIGINT      CHECK (file_size >= 0),
  operation_time       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id              UUID        REFERENCES managed_users(user_id)  ON DELETE SET NULL,
  computer_id          UUID        REFERENCES computers(computer_id)  ON DELETE SET NULL,
  status               VARCHAR(20) NOT NULL DEFAULT 'SUCCESS'
                       CHECK (status IN ('SUCCESS','FAILED','PARTIAL')),
  error_message        TEXT,
  duration_ms          INTEGER     CHECK (duration_ms >= 0)          -- milliseconds
);


-- ── 8.4 Temporary Offline Passwords ──────────────────────────
CREATE TABLE IF NOT EXISTS temporary_passwords (
  password_id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  device_encryption_id UUID        NOT NULL REFERENCES encrypted_devices(device_encryption_id) ON DELETE CASCADE,
  password_hash        VARCHAR(255) NOT NULL,                        -- bcrypt hash
  expires_at           TIMESTAMPTZ NOT NULL,
  is_used              BOOLEAN     NOT NULL DEFAULT FALSE,
  used_at              TIMESTAMPTZ,
  usage_count          INTEGER     NOT NULL DEFAULT 0,
  max_uses             INTEGER     NOT NULL DEFAULT 1,
  created_by           UUID        REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_temp_password_expiry CHECK (expires_at > created_at)
);

COMMENT ON TABLE temporary_passwords IS 'One-time passwords for offline EasyLock access (BRD FR-EE-002)';


-- ============================================================
-- SECTION 9 — LOGGING & AUDIT TRAIL
-- ============================================================

-- ── 9.1 System Logs ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS system_logs (
  log_id      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  log_level   log_level   NOT NULL,
  module      VARCHAR(50) NOT NULL,
  message     TEXT        NOT NULL,
  details     JSONB       DEFAULT '{}',
  user_id     UUID        REFERENCES profiles(profile_id)      ON DELETE SET NULL,
  computer_id UUID        REFERENCES computers(computer_id)    ON DELETE SET NULL,
  ip_address  INET,
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE system_logs IS 'Application-level structured logs for all modules';


-- ── 9.2 Device Events Log ────────────────────────────────────
CREATE TABLE IF NOT EXISTS device_events (
  event_id     UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id    UUID               NOT NULL REFERENCES devices(device_id)    ON DELETE CASCADE,
  computer_id  UUID               NOT NULL REFERENCES computers(computer_id) ON DELETE CASCADE,
  user_id      UUID               REFERENCES managed_users(user_id)         ON DELETE SET NULL,
  event_type   VARCHAR(50)        NOT NULL CHECK (event_type IN (
                 'CONNECT','DISCONNECT','BLOCK','ALLOW','READ_ONLY','ENCRYPT','WHITELIST','BLACKLIST')),
  action_taken device_action_type,
  policy_id    UUID               REFERENCES policies(policy_id)            ON DELETE SET NULL,
  event_time   TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  details      JSONB              DEFAULT '{}'
);


-- ── 9.3 Policy Violations Log ────────────────────────────────
CREATE TABLE IF NOT EXISTS policy_violations (
  violation_id   UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id      UUID           REFERENCES policies(policy_id)         ON DELETE SET NULL,
  user_id        UUID           REFERENCES managed_users(user_id)      ON DELETE SET NULL,
  computer_id    UUID           REFERENCES computers(computer_id)      ON DELETE SET NULL,
  device_id      UUID           REFERENCES devices(device_id)          ON DELETE SET NULL,
  violation_type VARCHAR(100)   NOT NULL,
  severity       alert_severity NOT NULL,
  description    TEXT           NOT NULL,
  action_taken   VARCHAR(100),
  violation_time TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  resolved       BOOLEAN        NOT NULL DEFAULT FALSE,
  resolved_by    UUID           REFERENCES profiles(profile_id)        ON DELETE SET NULL,
  resolved_at    TIMESTAMPTZ,
  resolution_note TEXT,
  CONSTRAINT chk_violation_resolution CHECK (
    (resolved = FALSE AND resolved_by IS NULL AND resolved_at IS NULL) OR
    (resolved = TRUE  AND resolved_by IS NOT NULL AND resolved_at IS NOT NULL)
  )
);


-- ── 9.4 Administrative Actions Log (Audit Trail) ─────────────
CREATE TABLE IF NOT EXISTS admin_actions (
  action_id     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID        NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
  action_type   VARCHAR(100) NOT NULL,                               -- CREATE_POLICY, MODIFY_USER, …
  target_type   VARCHAR(50),                                         -- USER, COMPUTER, POLICY, …
  target_id     UUID,
  old_values    JSONB,
  new_values    JSONB,
  action_time   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address    INET,
  user_agent    TEXT,
  session_id    TEXT
);

COMMENT ON TABLE admin_actions IS 'Immutable audit log — no UPDATE or DELETE allowed (enforced via RLS)';


-- ── 9.5 File Transfer Log ────────────────────────────────────
CREATE TABLE IF NOT EXISTS file_transfers (
  transfer_id          UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name            VARCHAR(255)       NOT NULL,
  file_path            TEXT               NOT NULL,
  file_size            BIGINT             CHECK (file_size >= 0),
  file_hash            VARCHAR(64),
  source_location      VARCHAR(255),
  destination_location VARCHAR(255),
  user_id              UUID               REFERENCES managed_users(user_id)   ON DELETE SET NULL,
  computer_id          UUID               REFERENCES computers(computer_id)   ON DELETE SET NULL,
  device_id            UUID               REFERENCES devices(device_id)       ON DELETE SET NULL,
  transfer_type        VARCHAR(50)        NOT NULL CHECK (transfer_type IN ('COPY','MOVE','UPLOAD','DOWNLOAD','EMAIL','PRINT')),
  action_taken         device_action_type,
  policy_violation_id  UUID               REFERENCES policy_violations(violation_id) ON DELETE SET NULL,
  transfer_time        TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SECTION 10 — ALERTS MODULE
-- ============================================================

-- ── 10.1 Alert Rules ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alert_rules (
  rule_id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name             VARCHAR(255)   NOT NULL,
  alert_type            VARCHAR(50)    NOT NULL CHECK (alert_type IN (
                          'SYSTEM','DEVICE','CONTENT','ENCRYPTION','COMPLIANCE','LICENSE')),
  -- condition_expression: {field:"severity", operator:">=", value:"HIGH", count:3, window_minutes:60}
  condition_expression  JSONB          NOT NULL,
  severity              alert_severity NOT NULL,
  is_active             BOOLEAN        NOT NULL DEFAULT TRUE,
  -- notification_channels: [{type:"EMAIL", recipients:[...]}, {type:"WEBHOOK", url:"..."}]
  notification_channels JSONB          DEFAULT '[]',
  cooldown_minutes      INTEGER        NOT NULL DEFAULT 60,           -- avoid alert storms
  created_by            UUID           REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_alert_rules_updated_at
  BEFORE UPDATE ON alert_rules
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ── 10.2 Alerts ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
  alert_id        UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id         UUID           REFERENCES alert_rules(rule_id)      ON DELETE SET NULL,
  alert_type      VARCHAR(50)    NOT NULL,
  title           VARCHAR(255)   NOT NULL,
  message         TEXT           NOT NULL,
  severity        alert_severity NOT NULL,
  status          VARCHAR(20)    NOT NULL DEFAULT 'OPEN'
                  CHECK (status IN ('OPEN','ACKNOWLEDGED','RESOLVED','SUPPRESSED')),
  source_type     VARCHAR(50),
  source_id       UUID,
  user_id         UUID           REFERENCES managed_users(user_id)    ON DELETE SET NULL,
  computer_id     UUID           REFERENCES computers(computer_id)    ON DELETE SET NULL,
  device_id       UUID           REFERENCES devices(device_id)        ON DELETE SET NULL,
  related_log_id  UUID,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  acknowledged_by UUID           REFERENCES profiles(profile_id)      ON DELETE SET NULL,
  acknowledged_at TIMESTAMPTZ,
  resolved_by     UUID           REFERENCES profiles(profile_id)      ON DELETE SET NULL,
  resolved_at     TIMESTAMPTZ
);


-- ── 10.3 Alert Notifications ─────────────────────────────────
CREATE TABLE IF NOT EXISTS alert_notifications (
  notification_id UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id        UUID        NOT NULL REFERENCES alerts(alert_id) ON DELETE CASCADE,
  channel_type    VARCHAR(20) NOT NULL CHECK (channel_type IN ('EMAIL','SMS','SNMP','WEBHOOK','SLACK')),
  recipient       VARCHAR(255) NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                  CHECK (status IN ('PENDING','SENT','FAILED','RETRY')),
  sent_at         TIMESTAMPTZ,
  retry_count     INTEGER     NOT NULL DEFAULT 0,
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SECTION 11 — REPORTING & ANALYTICS
-- ============================================================

-- ── 11.1 Report Templates ────────────────────────────────────
CREATE TABLE IF NOT EXISTS report_templates (
  template_id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name      VARCHAR(255) NOT NULL UNIQUE,
  description        TEXT,
  report_type        VARCHAR(50) NOT NULL CHECK (report_type IN (
                       'DEVICE_ACTIVITY','POLICY_VIOLATIONS','COMPLIANCE',
                       'FILE_TRANSFERS','USER_ACTIVITY','ENCRYPTION','EDISCOVERY','EXECUTIVE')),
  -- query_definition: {table:"...", filters:{...}, columns:[...], order_by:"..."}
  query_definition   JSONB       NOT NULL,
  parameters         JSONB       DEFAULT '[]',  -- [{name, type, label, required, default}]
  is_system_template BOOLEAN     NOT NULL DEFAULT FALSE,
  created_by         UUID        REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_report_templates_updated_at
  BEFORE UPDATE ON report_templates
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ── 11.2 Scheduled Reports ───────────────────────────────────
CREATE TABLE IF NOT EXISTS scheduled_reports (
  schedule_id     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id     UUID        NOT NULL REFERENCES report_templates(template_id) ON DELETE CASCADE,
  report_name     VARCHAR(255) NOT NULL,
  schedule_type   VARCHAR(20) NOT NULL CHECK (schedule_type IN ('ONCE','DAILY','WEEKLY','MONTHLY','QUARTERLY')),
  -- schedule_config: {day_of_week:1, hour:8, minute:0, timezone:"UTC"}
  schedule_config JSONB       NOT NULL,
  -- recipients: ["user@corp.com", ...]
  recipients      JSONB       NOT NULL DEFAULT '[]',
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_by      UUID        REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_run_at     TIMESTAMPTZ,
  next_run_at     TIMESTAMPTZ
);


-- ── 11.3 Report History ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS report_history (
  report_id    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id  UUID        REFERENCES scheduled_reports(schedule_id) ON DELETE SET NULL,
  template_id  UUID        REFERENCES report_templates(template_id)  ON DELETE SET NULL,
  report_name  VARCHAR(255) NOT NULL,
  parameters   JSONB       DEFAULT '{}',
  status       VARCHAR(20) NOT NULL DEFAULT 'PENDING'
               CHECK (status IN ('PENDING','RUNNING','COMPLETED','FAILED')),
  start_time   TIMESTAMPTZ,
  end_time     TIMESTAMPTZ,
  file_path    VARCHAR(500),
  file_size    BIGINT      CHECK (file_size >= 0),
  row_count    INTEGER     CHECK (row_count >= 0),
  generated_by UUID        REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ── 11.4 Dashboard Widgets ───────────────────────────────────
CREATE TABLE IF NOT EXISTS dashboard_widgets (
  widget_id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_name      VARCHAR(255) NOT NULL,
  widget_type      VARCHAR(50) NOT NULL CHECK (widget_type IN (
                     'METRIC','CHART_LINE','CHART_BAR','CHART_PIE','TABLE','MAP','HEATMAP')),
  -- data_source: {table:"...", aggregation:"COUNT|SUM|AVG", filters:{...}, refresh_seconds:30}
  data_source      JSONB       NOT NULL,
  refresh_interval INTEGER     NOT NULL DEFAULT 300 CHECK (refresh_interval >= 10),
  is_default       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_by       UUID        REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_dashboard_widgets_updated_at
  BEFORE UPDATE ON dashboard_widgets
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ── 11.5 User Dashboard Configurations ───────────────────────
CREATE TABLE IF NOT EXISTS user_dashboards (
  dashboard_id   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
  dashboard_name VARCHAR(255) NOT NULL,
  -- layout_config: [{widget_id, x, y, w, h}]
  layout_config  JSONB       NOT NULL DEFAULT '[]',
  is_default     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_user_dashboards_updated_at
  BEFORE UPDATE ON user_dashboards
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ── 11.6 Dashboard Widget Assignments ────────────────────────
CREATE TABLE IF NOT EXISTS dashboard_widget_assignments (
  assignment_id UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id  UUID        NOT NULL REFERENCES user_dashboards(dashboard_id) ON DELETE CASCADE,
  widget_id     UUID        NOT NULL REFERENCES dashboard_widgets(widget_id)  ON DELETE CASCADE,
  position_x    INTEGER     NOT NULL DEFAULT 0,
  position_y    INTEGER     NOT NULL DEFAULT 0,
  width         INTEGER     NOT NULL DEFAULT 4 CHECK (width BETWEEN 1 AND 12),
  height        INTEGER     NOT NULL DEFAULT 3 CHECK (height >= 1),
  widget_config JSONB       DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (dashboard_id, widget_id)
);


-- ============================================================
-- SECTION 12 — SYSTEM CONFIGURATION
-- ============================================================

-- ── 12.1 System Settings ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS system_settings (
  setting_id    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key   VARCHAR(255) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type  VARCHAR(20) NOT NULL CHECK (setting_type IN ('STRING','INTEGER','BOOLEAN','JSON')),
  description   TEXT,
  is_encrypted  BOOLEAN     NOT NULL DEFAULT FALSE,
  is_readonly   BOOLEAN     NOT NULL DEFAULT FALSE,
  updated_by    UUID        REFERENCES profiles(profile_id) ON DELETE SET NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN system_settings.is_readonly IS 'TRUE = cannot be changed via UI, only by DB admin';


-- ── 12.2 Licenses ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS licenses (
  license_id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key        VARCHAR(255) NOT NULL UNIQUE,
  product_name       VARCHAR(100) NOT NULL,
  version            VARCHAR(50),
  edition            VARCHAR(50)  NOT NULL DEFAULT 'STANDARD'
                     CHECK (edition IN ('STANDARD','PROFESSIONAL','ENTERPRISE')),
  max_endpoints      INTEGER      CHECK (max_endpoints > 0),
  current_endpoints  INTEGER      NOT NULL DEFAULT 0,
  -- modules: {device_control:true, content_aware:true, ediscovery:true, ...}
  licensed_modules   JSONB        NOT NULL DEFAULT '{}',
  expires_at         TIMESTAMPTZ,
  is_active          BOOLEAN      NOT NULL DEFAULT TRUE,
  license_details    JSONB        DEFAULT '{}',
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_licenses_updated_at
  BEFORE UPDATE ON licenses
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ── 12.3 Directory Services ──────────────────────────────────
CREATE TABLE IF NOT EXISTS directory_services (
  service_id      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type    VARCHAR(20) NOT NULL CHECK (service_type IN ('AD','AZURE_AD','LDAP')),
  service_name    VARCHAR(100) NOT NULL,
  -- connection_config: {host, port, ssl, bind_dn, bind_password_encrypted, base_dn}
  connection_config JSONB     NOT NULL,
  -- sync_config: {user_filter, group_filter, interval_minutes, attribute_map:{...}}
  sync_config     JSONB       DEFAULT '{}',
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  last_sync_at    TIMESTAMPTZ,
  sync_status     VARCHAR(20) DEFAULT 'NEVER_RUN'
                  CHECK (sync_status IN ('NEVER_RUN','SUCCESS','FAILED','RUNNING')),
  sync_error      TEXT,
  users_synced    INTEGER     NOT NULL DEFAULT 0,
  groups_synced   INTEGER     NOT NULL DEFAULT 0,
  created_by      UUID        REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_directory_services_updated_at
  BEFORE UPDATE ON directory_services
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON COLUMN directory_services.connection_config
  IS 'Sensitive credentials must be encrypted at application level before storing';


-- ── 12.4 SIEM Configurations ─────────────────────────────────
CREATE TABLE IF NOT EXISTS siem_configurations (
  siem_id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  siem_name         VARCHAR(100) NOT NULL,
  siem_type         VARCHAR(50) NOT NULL CHECK (siem_type IN ('SYSLOG','CEF','LEEF','API','WEBHOOK')),
  -- connection_config: {host, port, protocol, api_key_encrypted, tls:true}
  connection_config JSONB       NOT NULL,
  -- event_mapping: {device_block:"...", policy_violation:"...", ...}
  event_mapping     JSONB       DEFAULT '{}',
  is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
  events_sent       BIGINT      NOT NULL DEFAULT 0,
  last_event_at     TIMESTAMPTZ,
  created_by        UUID        REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_siem_configurations_updated_at
  BEFORE UPDATE ON siem_configurations
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ============================================================
-- SECTION 13 — BACKUP & MAINTENANCE
-- ============================================================

-- ── 13.1 Backup Jobs ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS backup_jobs (
  backup_id     UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_name   VARCHAR(255)  NOT NULL,
  backup_type   VARCHAR(20)   NOT NULL CHECK (backup_type IN ('FULL','INCREMENTAL','DIFFERENTIAL')),
  status        backup_status NOT NULL DEFAULT 'RUNNING',
  start_time    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  end_time      TIMESTAMPTZ,
  file_size     BIGINT        CHECK (file_size >= 0),
  file_path     VARCHAR(500),
  checksum      VARCHAR(64),
  backup_config JSONB         DEFAULT '{}',
  error_message TEXT,
  created_by    UUID          REFERENCES profiles(profile_id) ON DELETE SET NULL,
  CONSTRAINT chk_backup_times CHECK (end_time IS NULL OR end_time >= start_time)
);


-- ── 13.2 System Snapshots ────────────────────────────────────
CREATE TABLE IF NOT EXISTS system_snapshots (
  snapshot_id    UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_name  VARCHAR(255)  NOT NULL,
  description    TEXT,
  snapshot_type  VARCHAR(20)   NOT NULL CHECK (snapshot_type IN ('SYSTEM','CONFIGURATION','DATABASE')),
  status         backup_status NOT NULL DEFAULT 'RUNNING',
  start_time     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  end_time       TIMESTAMPTZ,
  file_size      BIGINT        CHECK (file_size >= 0),
  file_path      VARCHAR(500),
  checksum       VARCHAR(64),
  error_message  TEXT,
  created_by     UUID          REFERENCES profiles(profile_id) ON DELETE SET NULL,
  CONSTRAINT chk_snapshot_times CHECK (end_time IS NULL OR end_time >= start_time)
);


-- ── 13.3 File Shadow Repository ──────────────────────────────
CREATE TABLE IF NOT EXISTS file_shadows (
  shadow_id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  original_file_name VARCHAR(255) NOT NULL,
  original_file_path TEXT         NOT NULL,
  shadow_file_path   VARCHAR(500) NOT NULL,
  file_size          BIGINT       CHECK (file_size >= 0),
  file_hash          VARCHAR(64),
  user_id            UUID         REFERENCES managed_users(user_id)  ON DELETE SET NULL,
  computer_id        UUID         REFERENCES computers(computer_id)  ON DELETE SET NULL,
  device_id          UUID         REFERENCES devices(device_id)      ON DELETE SET NULL,
  transfer_id        UUID         REFERENCES file_transfers(transfer_id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  expires_at         TIMESTAMPTZ
);

COMMENT ON TABLE file_shadows IS 'Shadow copy of transferred files for forensic review (BRD FR-REP-003)';


-- ============================================================
-- SECTION 14 — ALLOWLISTS & DENYLISTS
-- ============================================================

-- ── 14.1 Device Allowlists ───────────────────────────────────
CREATE TABLE IF NOT EXISTS device_allowlists (
  allowlist_id UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type  VARCHAR(20) NOT NULL CHECK (entity_type IN ('SERIAL_NUMBER','VENDOR_ID','PRODUCT_ID','CLASS')),
  entity_value VARCHAR(255) NOT NULL,
  description  TEXT,
  is_temporary BOOLEAN     NOT NULL DEFAULT FALSE,
  created_by   UUID        REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ,
  UNIQUE (entity_type, entity_value)
);


-- ── 14.2 Device Denylists ────────────────────────────────────
CREATE TABLE IF NOT EXISTS device_denylists (
  denylist_id  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type  VARCHAR(20) NOT NULL CHECK (entity_type IN ('SERIAL_NUMBER','VENDOR_ID','PRODUCT_ID','CLASS')),
  entity_value VARCHAR(255) NOT NULL,
  description  TEXT,
  created_by   UUID        REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ,
  UNIQUE (entity_type, entity_value)
);


-- ── 14.3 File Type Allowlists ────────────────────────────────
CREATE TABLE IF NOT EXISTS filetype_allowlists (
  allowlist_id    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  file_extension  VARCHAR(20) NOT NULL UNIQUE,
  description     TEXT,
  applies_to      VARCHAR(20) NOT NULL DEFAULT 'ALL'
                  CHECK (applies_to IN ('ALL','USB','NETWORK','EMAIL','PRINT')),
  created_by      UUID        REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ── 14.4 File Type Denylists ─────────────────────────────────
CREATE TABLE IF NOT EXISTS filetype_denylists (
  denylist_id    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  file_extension VARCHAR(20) NOT NULL UNIQUE,
  description    TEXT,
  applies_to     VARCHAR(20) NOT NULL DEFAULT 'ALL'
                 CHECK (applies_to IN ('ALL','USB','NETWORK','EMAIL','PRINT')),
  created_by     UUID        REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ── 14.5 URL Categories ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS url_categories (
  category_id   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name VARCHAR(100) NOT NULL UNIQUE,
  description   TEXT,
  is_custom     BOOLEAN      NOT NULL DEFAULT FALSE,
  default_action device_action_type NOT NULL DEFAULT 'ALLOW',
  created_by    UUID         REFERENCES profiles(profile_id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


-- ── 14.6 URL Category Mappings ───────────────────────────────
CREATE TABLE IF NOT EXISTS url_category_mappings (
  mapping_id    UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   UUID               NOT NULL REFERENCES url_categories(category_id) ON DELETE CASCADE,
  url_pattern   VARCHAR(500)       NOT NULL,
  pattern_type  VARCHAR(20)        NOT NULL DEFAULT 'WILDCARD'
                CHECK (pattern_type IN ('WILDCARD','REGEX','EXACT','DOMAIN')),
  action        device_action_type NOT NULL,
  is_active     BOOLEAN            NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SECTION 15 — PERFORMANCE INDEXES
-- ============================================================

-- Core entities
CREATE INDEX IF NOT EXISTS idx_profiles_username        ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_active          ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_department      ON profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_managed_users_username   ON managed_users(username);
CREATE INDEX IF NOT EXISTS idx_managed_users_email      ON managed_users(email);
CREATE INDEX IF NOT EXISTS idx_managed_users_active     ON managed_users(is_active);
CREATE INDEX IF NOT EXISTS idx_managed_users_department ON managed_users(department_id);

CREATE INDEX IF NOT EXISTS idx_computers_status         ON computers(status);
CREATE INDEX IF NOT EXISTS idx_computers_last_seen      ON computers(last_seen);
CREATE INDEX IF NOT EXISTS idx_computers_name           ON computers(computer_name);
CREATE INDEX IF NOT EXISTS idx_computers_department     ON computers(department_id);
CREATE INDEX IF NOT EXISTS idx_computers_tags           ON computers USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_user_group_memberships_user   ON user_group_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_group_memberships_group  ON user_group_memberships(group_id);
CREATE INDEX IF NOT EXISTS idx_comp_group_memberships_comp   ON computer_group_memberships(computer_id);
CREATE INDEX IF NOT EXISTS idx_comp_group_memberships_group  ON computer_group_memberships(group_id);

-- Policies
CREATE INDEX IF NOT EXISTS idx_policies_status      ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policies_type        ON policies(policy_type);
CREATE INDEX IF NOT EXISTS idx_policies_priority    ON policies(priority);
CREATE INDEX IF NOT EXISTS idx_policy_rules_policy  ON policy_rules(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_assign_policy ON policy_assignments(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_assign_target ON policy_assignments(target_type, target_id);

-- Devices
CREATE INDEX IF NOT EXISTS idx_devices_serial         ON devices(serial_number);
CREATE INDEX IF NOT EXISTS idx_devices_vendor_product ON devices(vendor_id, product_id);
CREATE INDEX IF NOT EXISTS idx_devices_whitelisted    ON devices(is_whitelisted);
CREATE INDEX IF NOT EXISTS idx_devices_blacklisted    ON devices(is_blacklisted);
CREATE INDEX IF NOT EXISTS idx_devices_class          ON devices(device_class_id);

CREATE INDEX IF NOT EXISTS idx_device_sessions_device     ON device_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_device_sessions_computer   ON device_sessions(computer_id);
CREATE INDEX IF NOT EXISTS idx_device_sessions_user       ON device_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_device_sessions_time       ON device_sessions(connection_time DESC);
CREATE INDEX IF NOT EXISTS idx_device_sessions_action     ON device_sessions(action_taken);

-- Content Aware
CREATE INDEX IF NOT EXISTS idx_content_patterns_type     ON content_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_content_inspect_user      ON content_inspection_results(user_id);
CREATE INDEX IF NOT EXISTS idx_content_inspect_computer  ON content_inspection_results(computer_id);
CREATE INDEX IF NOT EXISTS idx_content_inspect_time      ON content_inspection_results(inspection_time DESC);
CREATE INDEX IF NOT EXISTS idx_content_inspect_action    ON content_inspection_results(action_taken);
CREATE INDEX IF NOT EXISTS idx_content_inspect_patterns  ON content_inspection_results USING GIN(pattern_matches);

-- eDiscovery
CREATE INDEX IF NOT EXISTS idx_ediscovery_scans_status      ON ediscovery_scans(status);
CREATE INDEX IF NOT EXISTS idx_ediscovery_scans_policy      ON ediscovery_scans(policy_id);
CREATE INDEX IF NOT EXISTS idx_ediscovery_results_scan      ON ediscovery_results(scan_id);
CREATE INDEX IF NOT EXISTS idx_ediscovery_results_sensitivity ON ediscovery_results(sensitivity_level);
CREATE INDEX IF NOT EXISTS idx_ediscovery_results_computer  ON ediscovery_results(computer_id);
CREATE INDEX IF NOT EXISTS idx_ediscovery_results_fp        ON ediscovery_results(is_false_positive);

-- Encryption
CREATE INDEX IF NOT EXISTS idx_encrypted_devices_device     ON encrypted_devices(device_id);
CREATE INDEX IF NOT EXISTS idx_encrypted_devices_computer   ON encrypted_devices(computer_id);
CREATE INDEX IF NOT EXISTS idx_encrypted_devices_user       ON encrypted_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_encryption_ops_device        ON encryption_operations(device_encryption_id);
CREATE INDEX IF NOT EXISTS idx_encryption_ops_time          ON encryption_operations(operation_time DESC);
CREATE INDEX IF NOT EXISTS idx_temp_passwords_expires       ON temporary_passwords(expires_at);
CREATE INDEX IF NOT EXISTS idx_temp_passwords_used          ON temporary_passwords(is_used);

-- Logs
CREATE INDEX IF NOT EXISTS idx_system_logs_level     ON system_logs(log_level);
CREATE INDEX IF NOT EXISTS idx_system_logs_module    ON system_logs(module);
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs("timestamp" DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_user      ON system_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_device_events_device   ON device_events(device_id);
CREATE INDEX IF NOT EXISTS idx_device_events_computer ON device_events(computer_id);
CREATE INDEX IF NOT EXISTS idx_device_events_user     ON device_events(user_id);
CREATE INDEX IF NOT EXISTS idx_device_events_time     ON device_events(event_time DESC);
CREATE INDEX IF NOT EXISTS idx_device_events_type     ON device_events(event_type);

CREATE INDEX IF NOT EXISTS idx_violations_time     ON policy_violations(violation_time DESC);
CREATE INDEX IF NOT EXISTS idx_violations_severity ON policy_violations(severity);
CREATE INDEX IF NOT EXISTS idx_violations_resolved ON policy_violations(resolved);
CREATE INDEX IF NOT EXISTS idx_violations_user     ON policy_violations(user_id);
CREATE INDEX IF NOT EXISTS idx_violations_computer ON policy_violations(computer_id);

CREATE INDEX IF NOT EXISTS idx_admin_actions_admin  ON admin_actions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_time   ON admin_actions(action_time DESC);
CREATE INDEX IF NOT EXISTS idx_admin_actions_type   ON admin_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target ON admin_actions(target_type, target_id);

CREATE INDEX IF NOT EXISTS idx_file_transfers_user     ON file_transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_file_transfers_computer ON file_transfers(computer_id);
CREATE INDEX IF NOT EXISTS idx_file_transfers_device   ON file_transfers(device_id);
CREATE INDEX IF NOT EXISTS idx_file_transfers_time     ON file_transfers(transfer_time DESC);
CREATE INDEX IF NOT EXISTS idx_file_transfers_hash     ON file_transfers(file_hash);
CREATE INDEX IF NOT EXISTS idx_file_transfers_action   ON file_transfers(action_taken);

-- Alerts
CREATE INDEX IF NOT EXISTS idx_alerts_status     ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity   ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_type       ON alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_alerts_time       ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_source     ON alerts(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_alert_notif_alert ON alert_notifications(alert_id);
CREATE INDEX IF NOT EXISTS idx_alert_notif_status ON alert_notifications(status);

-- Reporting
CREATE INDEX IF NOT EXISTS idx_report_templates_type  ON report_templates(report_type);
CREATE INDEX IF NOT EXISTS idx_sched_reports_active   ON scheduled_reports(is_active);
CREATE INDEX IF NOT EXISTS idx_sched_reports_next_run ON scheduled_reports(next_run_at);
CREATE INDEX IF NOT EXISTS idx_report_history_status  ON report_history(status);
CREATE INDEX IF NOT EXISTS idx_report_history_time    ON report_history(created_at DESC);

-- System
CREATE INDEX IF NOT EXISTS idx_system_settings_key  ON system_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_licenses_active      ON licenses(is_active);
CREATE INDEX IF NOT EXISTS idx_licenses_expires     ON licenses(expires_at);
CREATE INDEX IF NOT EXISTS idx_dir_services_active  ON directory_services(is_active);
CREATE INDEX IF NOT EXISTS idx_siem_configs_active  ON siem_configurations(is_active);

-- Backup
CREATE INDEX IF NOT EXISTS idx_backup_jobs_status     ON backup_jobs(status);
CREATE INDEX IF NOT EXISTS idx_backup_jobs_time       ON backup_jobs(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_snapshots_status       ON system_snapshots(status);
CREATE INDEX IF NOT EXISTS idx_snapshots_time         ON system_snapshots(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_file_shadows_expires   ON file_shadows(expires_at);
CREATE INDEX IF NOT EXISTS idx_file_shadows_user      ON file_shadows(user_id);
CREATE INDEX IF NOT EXISTS idx_file_shadows_computer  ON file_shadows(computer_id);
CREATE INDEX IF NOT EXISTS idx_file_shadows_hash      ON file_shadows(file_hash);

-- Allowlists / Denylists
CREATE INDEX IF NOT EXISTS idx_dev_allowlists_entity   ON device_allowlists(entity_type, entity_value);
CREATE INDEX IF NOT EXISTS idx_dev_allowlists_expires  ON device_allowlists(expires_at);
CREATE INDEX IF NOT EXISTS idx_dev_denylists_entity    ON device_denylists(entity_type, entity_value);
CREATE INDEX IF NOT EXISTS idx_dev_denylists_expires   ON device_denylists(expires_at);
CREATE INDEX IF NOT EXISTS idx_ft_allowlists_ext       ON filetype_allowlists(file_extension);
CREATE INDEX IF NOT EXISTS idx_ft_denylists_ext        ON filetype_denylists(file_extension);
CREATE INDEX IF NOT EXISTS idx_url_cat_mappings_cat    ON url_category_mappings(category_id);
CREATE INDEX IF NOT EXISTS idx_url_cat_mappings_active ON url_category_mappings(is_active);

-- Full-text search indexes (trigram)
CREATE INDEX IF NOT EXISTS idx_trgm_devices_name      ON devices USING GIN(device_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_trgm_computers_name    ON computers USING GIN(computer_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_trgm_violations_desc   ON policy_violations USING GIN(description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_trgm_system_logs_msg   ON system_logs USING GIN(message gin_trgm_ops);


-- ============================================================
-- SECTION 16 — ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Supabase automatically uses auth.uid() for the logged-in user.
-- All admin portal users must have a matching row in profiles.

-- Enable RLS on all tables
ALTER TABLE departments                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE managed_users                ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_groups                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_group_memberships       ENABLE ROW LEVEL SECURITY;
ALTER TABLE computers                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE computer_groups              ENABLE ROW LEVEL SECURITY;
ALTER TABLE computer_group_memberships   ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_rules                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_assignments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_classes               ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_sessions              ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_patterns             ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_aware_policies       ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_policy_rules         ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_inspection_results   ENABLE ROW LEVEL SECURITY;
ALTER TABLE ediscovery_policies          ENABLE ROW LEVEL SECURITY;
ALTER TABLE ediscovery_scans             ENABLE ROW LEVEL SECURITY;
ALTER TABLE ediscovery_results           ENABLE ROW LEVEL SECURITY;
ALTER TABLE encryption_keys              ENABLE ROW LEVEL SECURITY;
ALTER TABLE encrypted_devices            ENABLE ROW LEVEL SECURITY;
ALTER TABLE encryption_operations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE temporary_passwords          ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_events                ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_violations            ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions                ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_transfers               ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_rules                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_notifications          ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates             ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports            ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_history               ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_widgets            ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dashboards              ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_widget_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings              ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_services           ENABLE ROW LEVEL SECURITY;
ALTER TABLE siem_configurations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_jobs                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_snapshots             ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_shadows                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_allowlists            ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_denylists             ENABLE ROW LEVEL SECURITY;
ALTER TABLE filetype_allowlists          ENABLE ROW LEVEL SECURITY;
ALTER TABLE filetype_denylists           ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_categories               ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_category_mappings        ENABLE ROW LEVEL SECURITY;

-- ── Helper: check if caller is an active admin ────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE profile_id = auth.uid()
      AND is_admin = TRUE
      AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Helper: check if caller is any active user ────────────────
CREATE OR REPLACE FUNCTION is_active_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE profile_id = auth.uid()
      AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── PROFILES — users see only their own row; admins see all ──
DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (profile_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid() AND is_admin = (SELECT is_admin FROM profiles WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (is_admin());

-- ── READ-ONLY for non-admin authenticated users ───────────────
-- Most tables: active authenticated users can SELECT; only admins can INSERT/UPDATE/DELETE

-- Macro: all "admin write, user read" tables
DO $$ DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'departments','managed_users','user_groups','user_group_memberships',
    'computers','computer_groups','computer_group_memberships',
    'policies','policy_rules','policy_assignments',
    'device_classes','devices','device_sessions',
    'content_patterns','content_aware_policies','content_policy_rules','content_inspection_results',
    'ediscovery_policies','ediscovery_scans','ediscovery_results',
    'encrypted_devices','encryption_operations',
    'system_logs','device_events','policy_violations','file_transfers',
    'alert_rules','alerts','alert_notifications',
    'report_templates','scheduled_reports','report_history',
    'dashboard_widgets',
    'backup_jobs','system_snapshots','file_shadows',
    'device_allowlists','device_denylists','filetype_allowlists','filetype_denylists',
    'url_categories','url_category_mappings',
    'system_settings','licenses','directory_services','siem_configurations'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s_read" ON %I', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY "%s_read" ON %I FOR SELECT USING (is_active_user())',
      tbl, tbl
    );
    EXECUTE format('DROP POLICY IF EXISTS "%s_write" ON %I', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY "%s_write" ON %I FOR ALL USING (is_admin())',
      tbl, tbl
    );
  END LOOP;
END $$;

-- ── AUDIT TRAIL — append-only (no UPDATE/DELETE even for admins)
DROP POLICY IF EXISTS "admin_actions_insert" ON admin_actions;
CREATE POLICY "admin_actions_insert" ON admin_actions
  FOR INSERT WITH CHECK (admin_user_id = auth.uid() AND is_admin());

DROP POLICY IF EXISTS "admin_actions_select" ON admin_actions;
CREATE POLICY "admin_actions_select" ON admin_actions
  FOR SELECT USING (is_admin());
-- No UPDATE / DELETE policy → admins cannot modify the audit trail

-- ── ENCRYPTION KEYS — admins only, no SELECT for regular users
DROP POLICY IF EXISTS "encryption_keys_admin" ON encryption_keys;
CREATE POLICY "encryption_keys_admin" ON encryption_keys
  FOR ALL USING (is_admin());

-- ── TEMP PASSWORDS — admins only
DROP POLICY IF EXISTS "temp_passwords_admin" ON temporary_passwords;
CREATE POLICY "temp_passwords_admin" ON temporary_passwords
  FOR ALL USING (is_admin());

-- ── USER DASHBOARDS — users manage only their own
DROP POLICY IF EXISTS "user_dashboards_own" ON user_dashboards;
CREATE POLICY "user_dashboards_own" ON user_dashboards
  FOR ALL USING (user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "dashboard_widget_assignments_own" ON dashboard_widget_assignments;
CREATE POLICY "dashboard_widget_assignments_own" ON dashboard_widget_assignments
  FOR ALL USING (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM user_dashboards
      WHERE dashboard_id = dashboard_widget_assignments.dashboard_id
        AND user_id = auth.uid()
    )
  );


-- ============================================================
-- SECTION 17 — USEFUL VIEWS
-- ============================================================

-- ── 17.1 Active alerts summary ───────────────────────────────
CREATE OR REPLACE VIEW v_active_alerts AS
SELECT
  a.alert_id,
  a.alert_type,
  a.title,
  a.severity,
  a.status,
  a.created_at,
  mu.username   AS affected_user,
  c.computer_name,
  d.device_name,
  d.serial_number
FROM alerts a
LEFT JOIN managed_users mu ON mu.user_id = a.user_id
LEFT JOIN computers      c  ON c.computer_id = a.computer_id
LEFT JOIN devices        d  ON d.device_id = a.device_id
WHERE a.status IN ('OPEN','ACKNOWLEDGED')
ORDER BY
  CASE a.severity WHEN 'CRITICAL' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'MEDIUM' THEN 3 ELSE 4 END,
  a.created_at DESC;

COMMENT ON VIEW v_active_alerts IS 'Open and acknowledged alerts sorted by severity then time';


-- ── 17.2 Endpoint status summary ─────────────────────────────
CREATE OR REPLACE VIEW v_endpoint_summary AS
SELECT
  status,
  COUNT(*)           AS count,
  ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0), 1) AS pct
FROM computers
GROUP BY status;


-- ── 17.3 Policy violations (last 30 days) ────────────────────
CREATE OR REPLACE VIEW v_recent_violations AS
SELECT
  pv.violation_id,
  pv.violation_type,
  pv.severity,
  pv.description,
  pv.violation_time,
  pv.resolved,
  mu.username       AS username,
  d.department_name AS department,
  c.computer_name,
  dev.device_name,
  p.policy_name
FROM policy_violations pv
LEFT JOIN managed_users mu ON mu.user_id = pv.user_id
LEFT JOIN (
  SELECT department_id, name AS department_name FROM departments
) d ON d.department_id = mu.department_id
LEFT JOIN computers     c   ON c.computer_id   = pv.computer_id
LEFT JOIN devices       dev ON dev.device_id   = pv.device_id
LEFT JOIN policies      p   ON p.policy_id     = pv.policy_id
WHERE pv.violation_time >= NOW() - INTERVAL '30 days'
ORDER BY pv.violation_time DESC;


-- ── 17.4 Dashboard KPI snapshot ──────────────────────────────
CREATE OR REPLACE VIEW v_dashboard_kpis AS
SELECT
  (SELECT COUNT(*) FROM computers WHERE status = 'ONLINE')                         AS endpoints_online,
  (SELECT COUNT(*) FROM computers)                                                  AS endpoints_total,
  (SELECT COUNT(*) FROM alerts WHERE status = 'OPEN')                              AS open_alerts,
  (SELECT COUNT(*) FROM alerts WHERE status = 'OPEN' AND severity = 'CRITICAL')   AS critical_alerts,
  (SELECT COUNT(*) FROM policy_violations
   WHERE violation_time >= CURRENT_DATE AND NOT resolved)                           AS violations_today,
  (SELECT COUNT(*) FROM policy_violations
   WHERE violation_time >= CURRENT_DATE AND severity = 'CRITICAL')                 AS critical_violations_today,
  (SELECT COUNT(*) FROM content_inspection_results
   WHERE action_taken = 'BLOCK' AND inspection_time >= CURRENT_DATE)               AS files_blocked_today,
  (SELECT COUNT(*) FROM policies WHERE status = 'ACTIVE')                          AS active_policies,
  (SELECT COUNT(*) FROM encrypted_devices WHERE is_encrypted = TRUE)               AS encrypted_devices,
  (SELECT COUNT(*) FROM ediscovery_scans WHERE status = 'RUNNING')                AS active_scans;

COMMENT ON VIEW v_dashboard_kpis IS 'Single-row KPI snapshot for the main dashboard. Refresh with SELECT * FROM v_dashboard_kpis';


-- ── 17.5 Top violators (last 7 days) ─────────────────────────
CREATE OR REPLACE VIEW v_top_violators AS
SELECT
  mu.user_id,
  mu.username,
  d.name AS department,
  COUNT(*) AS violation_count,
  SUM(CASE WHEN pv.severity = 'CRITICAL' THEN 1 ELSE 0 END) AS critical_count,
  MAX(pv.violation_time) AS last_violation
FROM policy_violations pv
JOIN managed_users mu ON mu.user_id = pv.user_id
LEFT JOIN departments d ON d.department_id = mu.department_id
WHERE pv.violation_time >= NOW() - INTERVAL '7 days'
GROUP BY mu.user_id, mu.username, d.name
ORDER BY violation_count DESC
LIMIT 20;


-- ============================================================
-- SECTION 18 — SEED DATA
-- ============================================================
-- Uncomment blocks below after running the schema to populate
-- default values required for the system to operate correctly.

-- ── Device Classes (required for device classification) ──────
/*
INSERT INTO device_classes (class_name, description, is_custom, default_action) VALUES
  ('USB_STORAGE',      'USB Flash Drives and Portable HDDs',    FALSE, 'BLOCK'),
  ('USB_HID',          'Keyboards, Mice, and Input Devices',    FALSE, 'ALLOW'),
  ('CD_DVD',           'Optical Disc Drives',                   FALSE, 'BLOCK'),
  ('PRINTER',          'Local and Network Printers',            FALSE, 'ALLOW'),
  ('NETWORK_ADAPTER',  'USB Network Interface Adapters',        FALSE, 'BLOCK'),
  ('BLUETOOTH',        'Bluetooth Controllers and Adapters',    FALSE, 'BLOCK'),
  ('CARD_READER',      'Smart Card and SD Card Readers',        FALSE, 'READ_ONLY'),
  ('SMARTPHONE',       'Smartphones and Tablets (MTP/PTP)',     FALSE, 'BLOCK'),
  ('EXTERNAL_HDD',     'External Hard Disk Drives',             FALSE, 'ENCRYPT'),
  ('CAMERA',           'Digital Cameras and Webcams',           FALSE, 'ALLOW'),
  ('BIOMETRIC',        'Fingerprint and Biometric Readers',     FALSE, 'ALLOW'),
  ('AUDIO',            'USB Headsets and Audio Devices',        FALSE, 'ALLOW')
ON CONFLICT (class_name) DO NOTHING;
*/

-- ── Content Patterns (PII, PCI-DSS, HIPAA) ──────────────────
/*
INSERT INTO content_patterns (pattern_name, pattern_type, pattern_value, description, is_predefined) VALUES
  ('Credit Card — Visa',       'REGEX',   '\b4[0-9]{12}(?:[0-9]{3})?\b',                                                        'Visa card numbers (13 or 16 digits)',              TRUE),
  ('Credit Card — Mastercard', 'REGEX',   '\b5[1-5][0-9]{14}\b',                                                                'Mastercard numbers (16 digits)',                   TRUE),
  ('Credit Card — Amex',       'REGEX',   '\b3[47][0-9]{13}\b',                                                                 'American Express card numbers (15 digits)',        TRUE),
  ('US Social Security Number','REGEX',   '\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b',                            'US SSN in XXX-XX-XXXX format',                    TRUE),
  ('Email Address',            'REGEX',   '\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b',                             'Email addresses',                                  TRUE),
  ('US Phone Number',          'REGEX',   '\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b',                'US phone numbers in various formats',              TRUE),
  ('IBAN',                     'REGEX',   '\b[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}(?:[A-Z0-9]{0,16})?\b',                      'International Bank Account Number',               TRUE),
  ('IPv4 Address',             'REGEX',   '\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b', 'IPv4 addresses',          TRUE),
  ('UK National Insurance',    'REGEX',   '\b[A-Z]{2}[0-9]{6}[A-D]\b',                                                        'UK NI numbers',                                    TRUE),
  ('Passport Number (Generic)','REGEX',   '\b[A-Z]{1,2}[0-9]{6,9}\b',                                                         'Generic passport number pattern',                  TRUE),
  ('HIPAA — Diagnosis Code',   'KEYWORD', 'ICD-10,diagnosis,medical record,patient ID,PHI',                                    'HIPAA Protected Health Information keywords',      TRUE),
  ('PCI-DSS Keywords',         'KEYWORD', 'cardholder,CVV,CVC,card number,expiry date,PIN,payment card',                      'PCI-DSS sensitive payment keywords',               TRUE)
ON CONFLICT DO NOTHING;
*/

-- ── URL Categories ───────────────────────────────────────────
/*
INSERT INTO url_categories (category_name, description, is_custom, default_action) VALUES
  ('Cloud Storage',      'Dropbox, Google Drive, OneDrive, Box',        FALSE, 'BLOCK'),
  ('Social Media',       'Facebook, Twitter, LinkedIn, Instagram',       FALSE, 'ALLOW'),
  ('Webmail',            'Gmail, Outlook, Yahoo Mail',                   FALSE, 'BLOCK'),
  ('File Sharing',       'WeTransfer, SendSpace, MediaFire',             FALSE, 'BLOCK'),
  ('Cryptocurrency',     'Crypto exchanges and wallets',                 FALSE, 'BLOCK'),
  ('Pastebin',           'Pastebin, Hastebin and similar services',      FALSE, 'BLOCK'),
  ('Corporate Approved', 'Internally approved cloud tools',              FALSE, 'ALLOW'),
  ('Development Tools',  'GitHub, GitLab, npm, PyPI',                   FALSE, 'ALLOW')
ON CONFLICT (category_name) DO NOTHING;
*/

-- ── System Settings (defaults) ───────────────────────────────
/*
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_readonly) VALUES
  ('system.name',                  'SentinelGo Endpoint Protector', 'STRING',  'Product display name',                          FALSE),
  ('system.version',               '2.0.0',                          'STRING',  'Current system version',                        TRUE),
  ('system.timezone',              'UTC',                            'STRING',  'System default timezone',                       FALSE),
  ('security.session_timeout_sec', '3600',                           'INTEGER', 'Session timeout in seconds (0 = no timeout)',    FALSE),
  ('security.password_min_length', '12',                             'INTEGER', 'Minimum password character length',             FALSE),
  ('security.password_complexity', 'true',                           'BOOLEAN', 'Require uppercase, lowercase, digit, symbol',   FALSE),
  ('security.mfa_required',        'false',                          'BOOLEAN', 'Require MFA for all admin users',               FALSE),
  ('security.max_login_attempts',  '5',                              'INTEGER', 'Lock account after N failed login attempts',     FALSE),
  ('logs.retention_days',          '90',                             'INTEGER', 'Days to retain log records before purging',      FALSE),
  ('logs.shadow_retention_days',   '30',                             'INTEGER', 'Days to retain file shadow copies',             FALSE),
  ('backup.auto_enabled',          'true',                           'BOOLEAN', 'Enable automatic scheduled backups',            FALSE),
  ('backup.retention_days',        '30',                             'INTEGER', 'Days to retain backup files',                   FALSE),
  ('alerts.email_enabled',         'true',                           'BOOLEAN', 'Send email notifications for alerts',           FALSE),
  ('alerts.email_from',            'noreply@sentinelgo.local',       'STRING',  'Sender address for alert emails',               FALSE),
  ('dashboard.refresh_sec',        '30',                             'INTEGER', 'Dashboard auto-refresh interval in seconds',    FALSE),
  ('endpoints.max_licensed',       '1000',                           'INTEGER', 'Maximum licensed endpoint count',               TRUE)
ON CONFLICT (setting_key) DO NOTHING;
*/

-- ── Report Templates ─────────────────────────────────────────
/*
INSERT INTO report_templates (template_name, description, report_type, query_definition, is_system_template) VALUES
  (
    'Device Activity Report',
    'All device connections and actions for a given period',
    'DEVICE_ACTIVITY',
    '{"table":"device_sessions","joins":["devices","computers","managed_users"],"date_field":"connection_time"}',
    TRUE
  ),
  (
    'Policy Violations Report',
    'All policy violations with user, computer and severity details',
    'POLICY_VIOLATIONS',
    '{"table":"policy_violations","joins":["managed_users","computers","policies"],"date_field":"violation_time"}',
    TRUE
  ),
  (
    'Compliance Executive Summary',
    'High-level compliance KPIs for executive review',
    'COMPLIANCE',
    '{"table":"v_dashboard_kpis","date_field":null}',
    TRUE
  ),
  (
    'File Transfer Log',
    'All file transfers with action taken and hash fingerprints',
    'FILE_TRANSFERS',
    '{"table":"file_transfers","joins":["managed_users","computers","devices"],"date_field":"transfer_time"}',
    TRUE
  ),
  (
    'User Activity Report',
    'Per-user breakdown of device usage and violations',
    'USER_ACTIVITY',
    '{"table":"managed_users","joins":["device_sessions","policy_violations"],"date_field":"created_at"}',
    TRUE
  )
ON CONFLICT (template_name) DO NOTHING;
*/


-- ============================================================
-- SECTION 19 — COMPLETION
-- ============================================================

SELECT
  'SentinelGo Supabase Schema v2.0 — deployed successfully' AS status,
  NOW() AS deployed_at,
  (SELECT COUNT(*) FROM information_schema.tables
   WHERE table_schema = 'public' AND table_type = 'BASE TABLE') AS table_count,
  (SELECT COUNT(*) FROM information_schema.views
   WHERE table_schema = 'public') AS view_count,
  (SELECT COUNT(*) FROM pg_indexes
   WHERE schemaname = 'public') AS index_count;
