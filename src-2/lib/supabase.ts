import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Type-safe table helpers ───────────────────────────────────────────────

export type Tables = {
  departments: {
    department_id: string
    name: string
    description: string | null
    parent_department_id: string | null
    created_at: string
    updated_at: string
  }
  users: {
    user_id: string
    username: string
    email: string | null
    display_name: string | null
    user_type: 'LOCAL' | 'AD' | 'AZURE_AD' | 'LDAP'
    department_id: string | null
    is_active: boolean
    is_admin: boolean
    last_login: string | null
    created_at: string
    updated_at: string
  }
  computers: {
    computer_id: string
    computer_name: string
    domain_name: string | null
    ip_address: string | null
    mac_address: string | null
    os_type: string | null
    os_version: string | null
    client_version: string | null
    status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'DECOMMISSIONED'
    last_seen: string | null
    department_id: string | null
    created_at: string
    updated_at: string
  }
  devices: {
    device_id: string
    device_name: string | null
    vendor_id: string | null
    product_id: string | null
    serial_number: string | null
    device_class_id: string | null
    is_whitelisted: boolean
    is_blacklisted: boolean
    notes: string | null
    created_at: string
    updated_at: string
  }
  device_sessions: {
    session_id: string
    device_id: string
    computer_id: string
    user_id: string | null
    action_taken: 'ALLOW' | 'BLOCK' | 'READ_ONLY' | 'ENCRYPT'
    connection_time: string
    disconnection_time: string | null
    policy_id: string | null
    file_count: number
    data_transferred_bytes: number
  }
  device_events: {
    event_id: string
    device_id: string
    computer_id: string
    user_id: string | null
    event_type: string
    action_taken: string | null
    policy_id: string | null
    event_time: string
    details: Record<string, unknown> | null
  }
  policy_violations: {
    violation_id: string
    policy_id: string | null
    user_id: string | null
    computer_id: string | null
    device_id: string | null
    violation_type: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    description: string
    action_taken: string | null
    violation_time: string
    resolved: boolean
    resolved_by: string | null
    resolved_at: string | null
  }
  alerts: {
    alert_id: string
    rule_id: string | null
    alert_type: string
    title: string
    message: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED'
    source_type: string | null
    source_id: string | null
    user_id: string | null
    computer_id: string | null
    device_id: string | null
    created_at: string
    acknowledged_at: string | null
    resolved_at: string | null
  }
  policies: {
    policy_id: string
    policy_name: string
    description: string | null
    policy_type: string
    status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'DEPRECATED'
    priority: number
    created_by: string | null
    created_at: string
    updated_at: string
    version: number
  }
  content_inspection_results: {
    inspection_id: string
    file_name: string
    file_path: string
    file_size: number | null
    file_hash: string | null
    file_type: string | null
    user_id: string | null
    computer_id: string | null
    policy_id: string | null
    pattern_matches: Record<string, unknown> | null
    action_taken: 'BLOCK' | 'ALLOW' | 'ENCRYPT' | 'QUARANTINE' | 'NOTIFY'
    inspection_time: string
  }
  ediscovery_scans: {
    scan_id: string
    policy_id: string
    scan_name: string
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
    scheduled_time: string | null
    start_time: string | null
    end_time: string | null
    total_files_scanned: number
    files_with_matches: number
    created_by: string | null
    created_at: string
  }
  file_transfers: {
    transfer_id: string
    file_name: string
    file_path: string
    file_size: number | null
    file_hash: string | null
    source_location: string | null
    destination_location: string | null
    user_id: string | null
    computer_id: string | null
    device_id: string | null
    transfer_type: string
    action_taken: string | null
    transfer_time: string
  }
  admin_actions: {
    action_id: string
    admin_user_id: string
    action_type: string
    target_type: string | null
    target_id: string | null
    old_values: Record<string, unknown> | null
    new_values: Record<string, unknown> | null
    action_time: string
    ip_address: string | null
    user_agent: string | null
  }
  licenses: {
    license_id: string
    license_key: string
    product_name: string
    version: string | null
    max_endpoints: number | null
    current_endpoints: number
    expires_at: string | null
    is_active: boolean
    created_at: string
    updated_at: string
  }
  system_settings: {
    setting_id: string
    setting_key: string
    setting_value: string | null
    setting_type: string
    description: string | null
    is_encrypted: boolean
    updated_at: string
  }
  backup_jobs: {
    backup_id: string
    backup_name: string
    backup_type: string
    status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
    start_time: string
    end_time: string | null
    file_size: number | null
    file_path: string | null
    created_by: string | null
  }
}
