// =====================================================
// SentinelGo Database Types
// Generated from sentinelgo_schema.sql
// =====================================================

export type DeviceActionType = 'ALLOW' | 'BLOCK' | 'READ_ONLY' | 'ENCRYPT'
export type PolicyStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'DEPRECATED'
export type UserType = 'LOCAL' | 'AD' | 'AZURE_AD' | 'LDAP'
export type ComputerStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'DECOMMISSIONED'
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
export type ContentAction = 'BLOCK' | 'ALLOW' | 'ENCRYPT' | 'QUARANTINE' | 'NOTIFY'
export type ScanStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
export type BackupStatus = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
export type EncryptionAlgorithm = 'AES-256' | 'AES-128' | 'RSA-2048' | 'RSA-4096'

// =====================================================
// Row Types (what comes FROM Supabase)
// =====================================================

export interface Department {
  department_id: string
  name: string
  description: string | null
  parent_department_id: string | null
  created_at: string
  updated_at: string
}

export interface User {
  user_id: string
  username: string
  email: string | null
  display_name: string | null
  user_type: UserType
  department_id: string | null
  is_active: boolean
  is_admin: boolean
  password_hash: string | null
  ad_dn: string | null
  azure_ad_object_id: string | null
  ldap_dn: string | null
  last_login: string | null
  password_changed_at: string | null
  created_at: string
  updated_at: string
}

export interface UserGroup {
  group_id: string
  group_name: string
  description: string | null
  is_ad_group: boolean
  ad_group_dn: string | null
  created_at: string
  updated_at: string
}

export interface UserGroupMembership {
  membership_id: string
  user_id: string
  group_id: string
  created_at: string
}

export interface Computer {
  computer_id: string
  computer_name: string
  domain_name: string | null
  ip_address: string | null
  mac_address: string | null
  os_type: string | null
  os_version: string | null
  client_version: string | null
  status: ComputerStatus
  last_seen: string | null
  department_id: string | null
  created_at: string
  updated_at: string
}

export interface ComputerGroup {
  group_id: string
  group_name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Policy {
  policy_id: string
  policy_name: string
  description: string | null
  policy_type: string
  status: PolicyStatus
  priority: number
  created_by: string | null
  created_at: string
  updated_at: string
  version: number
}

export interface PolicyRule {
  rule_id: string
  policy_id: string
  rule_name: string
  condition_type: string
  condition_value: string
  action: DeviceActionType
  is_active: boolean
  created_at: string
}

export interface PolicyAssignment {
  assignment_id: string
  policy_id: string
  target_type: 'USER' | 'USER_GROUP' | 'COMPUTER' | 'COMPUTER_GROUP' | 'DEPARTMENT'
  target_id: string
  is_active: boolean
  assigned_at: string
  assigned_by: string | null
}

export interface DeviceClass {
  class_id: string
  class_name: string
  description: string | null
  is_custom: boolean
  created_at: string
}

export interface Device {
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

export interface DeviceSession {
  session_id: string
  device_id: string
  computer_id: string
  user_id: string | null
  action_taken: DeviceActionType
  connection_time: string
  disconnection_time: string | null
  policy_id: string | null
  file_count: number
  data_transferred_bytes: number
}

export interface ContentPattern {
  pattern_id: string
  pattern_name: string
  pattern_type: string
  pattern_value: string
  description: string | null
  is_predefined: boolean
  created_at: string
}

export interface ContentAwarePolicy {
  policy_id: string
  policy_name: string
  description: string | null
  status: PolicyStatus
  action: ContentAction
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ContentInspectionResult {
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
  action_taken: ContentAction
  inspection_time: string
}

export interface EdiscoveryPolicy {
  policy_id: string
  policy_name: string
  description: string | null
  status: PolicyStatus
  scan_scope: Record<string, unknown> | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface EdiscoveryScan {
  scan_id: string
  policy_id: string
  scan_name: string
  status: ScanStatus
  scheduled_time: string | null
  start_time: string | null
  end_time: string | null
  total_files_scanned: number
  files_with_matches: number
  created_by: string | null
  created_at: string
}

export interface EdiscoveryResult {
  result_id: string
  scan_id: string
  file_name: string
  file_path: string
  file_size: number | null
  file_hash: string | null
  file_type: string | null
  sensitivity_level: string | null
  matched_patterns: Record<string, unknown> | null
  computer_id: string | null
  user_id: string | null
  discovered_at: string
}

export interface EncryptedDevice {
  device_encryption_id: string
  device_id: string
  computer_id: string
  user_id: string | null
  key_id: string | null
  encryption_algorithm: EncryptionAlgorithm
  is_encrypted: boolean
  encryption_time: string
  last_access_time: string | null
}

export interface TemporaryPassword {
  password_id: string
  device_encryption_id: string
  password_hash: string
  expires_at: string
  is_used: boolean
  created_by: string | null
  created_at: string
  usage_count: number
}

export interface SystemLog {
  log_id: string
  log_level: LogLevel
  module: string
  message: string
  details: Record<string, unknown> | null
  user_id: string | null
  computer_id: string | null
  timestamp: string
}

export interface DeviceEvent {
  event_id: string
  device_id: string
  computer_id: string
  user_id: string | null
  event_type: string
  action_taken: DeviceActionType | null
  policy_id: string | null
  event_time: string
  details: Record<string, unknown> | null
}

export interface PolicyViolation {
  violation_id: string
  policy_id: string | null
  user_id: string | null
  computer_id: string | null
  device_id: string | null
  violation_type: string
  severity: AlertSeverity
  description: string
  action_taken: string | null
  violation_time: string
  resolved: boolean
  resolved_by: string | null
  resolved_at: string | null
}

export interface AdminAction {
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

export interface FileTransfer {
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
  action_taken: DeviceActionType | null
  policy_violation_id: string | null
  transfer_time: string
}

export interface Alert {
  alert_id: string
  rule_id: string | null
  alert_type: string
  title: string
  message: string
  severity: AlertSeverity
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED'
  source_type: string | null
  source_id: string | null
  user_id: string | null
  computer_id: string | null
  device_id: string | null
  related_log_id: string | null
  created_at: string
  acknowledged_by: string | null
  acknowledged_at: string | null
  resolved_by: string | null
  resolved_at: string | null
}

export interface AlertRule {
  rule_id: string
  rule_name: string
  alert_type: string
  condition_expression: Record<string, unknown>
  severity: AlertSeverity
  is_active: boolean
  notification_channels: Record<string, unknown> | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface AlertNotification {
  notification_id: string
  alert_id: string
  channel_type: string
  recipient: string
  status: 'PENDING' | 'SENT' | 'FAILED'
  sent_at: string | null
  error_message: string | null
  created_at: string
}

export interface ReportTemplate {
  template_id: string
  template_name: string
  description: string | null
  report_type: string
  query_definition: Record<string, unknown>
  parameters: Record<string, unknown> | null
  is_system_template: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ScheduledReport {
  schedule_id: string
  template_id: string
  report_name: string
  schedule_type: string
  schedule_config: Record<string, unknown>
  recipients: Record<string, unknown>
  is_active: boolean
  created_by: string | null
  created_at: string
  last_run_at: string | null
  next_run_at: string | null
}

export interface ReportHistory {
  report_id: string
  schedule_id: string | null
  template_id: string | null
  report_name: string
  parameters: Record<string, unknown> | null
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  start_time: string | null
  end_time: string | null
  file_path: string | null
  file_size: number | null
  generated_by: string | null
  created_at: string
}

export interface SystemSetting {
  setting_id: string
  setting_key: string
  setting_value: string | null
  setting_type: string
  description: string | null
  is_encrypted: boolean
  updated_by: string | null
  updated_at: string
}

export interface License {
  license_id: string
  license_key: string
  product_name: string
  version: string | null
  max_endpoints: number | null
  current_endpoints: number
  expires_at: string | null
  is_active: boolean
  license_details: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface DirectoryService {
  service_id: string
  service_type: string
  service_name: string
  connection_config: Record<string, unknown>
  sync_config: Record<string, unknown> | null
  is_active: boolean
  last_sync_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface SiemConfiguration {
  siem_id: string
  siem_name: string
  siem_type: string
  connection_config: Record<string, unknown>
  event_mapping: Record<string, unknown> | null
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface BackupJob {
  backup_id: string
  backup_name: string
  backup_type: string
  status: BackupStatus
  start_time: string
  end_time: string | null
  file_size: number | null
  file_path: string | null
  backup_config: Record<string, unknown> | null
  created_by: string | null
}

export interface FileShadow {
  shadow_id: string
  original_file_name: string
  original_file_path: string
  shadow_file_path: string
  file_size: number | null
  file_hash: string | null
  user_id: string | null
  computer_id: string | null
  device_id: string | null
  transfer_id: string | null
  created_at: string
  expires_at: string | null
}

export interface DeviceAllowlist {
  allowlist_id: string
  entity_type: string
  entity_value: string
  description: string | null
  created_by: string | null
  created_at: string
  expires_at: string | null
}

export interface DeviceDenylist {
  denylist_id: string
  entity_type: string
  entity_value: string
  description: string | null
  created_by: string | null
  created_at: string
  expires_at: string | null
}

export interface UrlCategory {
  category_id: string
  category_name: string
  description: string | null
  is_custom: boolean
  created_by: string | null
  created_at: string
}

// =====================================================
// Supabase Database interface (for typed client)
// =====================================================
export interface Database {
  public: {
    Tables: {
      departments: { Row: Department; Insert: Partial<Department>; Update: Partial<Department> }
      users: { Row: User; Insert: Partial<User>; Update: Partial<User> }
      user_groups: { Row: UserGroup; Insert: Partial<UserGroup>; Update: Partial<UserGroup> }
      user_group_memberships: { Row: UserGroupMembership; Insert: Partial<UserGroupMembership>; Update: Partial<UserGroupMembership> }
      computers: { Row: Computer; Insert: Partial<Computer>; Update: Partial<Computer> }
      computer_groups: { Row: ComputerGroup; Insert: Partial<ComputerGroup>; Update: Partial<ComputerGroup> }
      policies: { Row: Policy; Insert: Partial<Policy>; Update: Partial<Policy> }
      policy_rules: { Row: PolicyRule; Insert: Partial<PolicyRule>; Update: Partial<PolicyRule> }
      policy_assignments: { Row: PolicyAssignment; Insert: Partial<PolicyAssignment>; Update: Partial<PolicyAssignment> }
      device_classes: { Row: DeviceClass; Insert: Partial<DeviceClass>; Update: Partial<DeviceClass> }
      devices: { Row: Device; Insert: Partial<Device>; Update: Partial<Device> }
      device_sessions: { Row: DeviceSession; Insert: Partial<DeviceSession>; Update: Partial<DeviceSession> }
      content_patterns: { Row: ContentPattern; Insert: Partial<ContentPattern>; Update: Partial<ContentPattern> }
      content_aware_policies: { Row: ContentAwarePolicy; Insert: Partial<ContentAwarePolicy>; Update: Partial<ContentAwarePolicy> }
      content_inspection_results: { Row: ContentInspectionResult; Insert: Partial<ContentInspectionResult>; Update: Partial<ContentInspectionResult> }
      ediscovery_policies: { Row: EdiscoveryPolicy; Insert: Partial<EdiscoveryPolicy>; Update: Partial<EdiscoveryPolicy> }
      ediscovery_scans: { Row: EdiscoveryScan; Insert: Partial<EdiscoveryScan>; Update: Partial<EdiscoveryScan> }
      ediscovery_results: { Row: EdiscoveryResult; Insert: Partial<EdiscoveryResult>; Update: Partial<EdiscoveryResult> }
      encrypted_devices: { Row: EncryptedDevice; Insert: Partial<EncryptedDevice>; Update: Partial<EncryptedDevice> }
      temporary_passwords: { Row: TemporaryPassword; Insert: Partial<TemporaryPassword>; Update: Partial<TemporaryPassword> }
      system_logs: { Row: SystemLog; Insert: Partial<SystemLog>; Update: Partial<SystemLog> }
      device_events: { Row: DeviceEvent; Insert: Partial<DeviceEvent>; Update: Partial<DeviceEvent> }
      policy_violations: { Row: PolicyViolation; Insert: Partial<PolicyViolation>; Update: Partial<PolicyViolation> }
      admin_actions: { Row: AdminAction; Insert: Partial<AdminAction>; Update: Partial<AdminAction> }
      file_transfers: { Row: FileTransfer; Insert: Partial<FileTransfer>; Update: Partial<FileTransfer> }
      alerts: { Row: Alert; Insert: Partial<Alert>; Update: Partial<Alert> }
      alert_rules: { Row: AlertRule; Insert: Partial<AlertRule>; Update: Partial<AlertRule> }
      alert_notifications: { Row: AlertNotification; Insert: Partial<AlertNotification>; Update: Partial<AlertNotification> }
      report_templates: { Row: ReportTemplate; Insert: Partial<ReportTemplate>; Update: Partial<ReportTemplate> }
      scheduled_reports: { Row: ScheduledReport; Insert: Partial<ScheduledReport>; Update: Partial<ScheduledReport> }
      report_history: { Row: ReportHistory; Insert: Partial<ReportHistory>; Update: Partial<ReportHistory> }
      system_settings: { Row: SystemSetting; Insert: Partial<SystemSetting>; Update: Partial<SystemSetting> }
      licenses: { Row: License; Insert: Partial<License>; Update: Partial<License> }
      directory_services: { Row: DirectoryService; Insert: Partial<DirectoryService>; Update: Partial<DirectoryService> }
      siem_configurations: { Row: SiemConfiguration; Insert: Partial<SiemConfiguration>; Update: Partial<SiemConfiguration> }
      backup_jobs: { Row: BackupJob; Insert: Partial<BackupJob>; Update: Partial<BackupJob> }
      file_shadows: { Row: FileShadow; Insert: Partial<FileShadow>; Update: Partial<FileShadow> }
      device_allowlists: { Row: DeviceAllowlist; Insert: Partial<DeviceAllowlist>; Update: Partial<DeviceAllowlist> }
      device_denylists: { Row: DeviceDenylist; Insert: Partial<DeviceDenylist>; Update: Partial<DeviceDenylist> }
      url_categories: { Row: UrlCategory; Insert: Partial<UrlCategory>; Update: Partial<UrlCategory> }
    }
    Views: Record<string, never>
    Functions: {
      get_dashboard_summary: { Args: Record<string, never>; Returns: DashboardSummary }
      get_policy_violations_stats: { Args: { days?: number }; Returns: ViolationStats[] }
      get_device_activity_stats: { Args: { days?: number }; Returns: DeviceActivityStats[] }
      resolve_alert: { Args: { p_alert_id: string; p_resolved_by: string }; Returns: void }
      generate_temp_password: { Args: { p_device_encryption_id: string; p_created_by: string; p_validity_hours?: number }; Returns: string }
    }
    Enums: {
      device_action_type: DeviceActionType
      policy_status: PolicyStatus
      user_type: UserType
      computer_status: ComputerStatus
      alert_severity: AlertSeverity
      log_level: LogLevel
      content_action: ContentAction
      scan_status: ScanStatus
      backup_status: BackupStatus
      encryption_algorithm: EncryptionAlgorithm
    }
  }
}

// =====================================================
// Custom RPC / API Response Types
// =====================================================
export interface DashboardSummary {
  total_endpoints: number
  online_endpoints: number
  offline_endpoints: number
  active_policies: number
  open_alerts: number
  critical_alerts: number
  violations_today: number
  blocked_devices_today: number
}

export interface ViolationStats {
  date: string
  total: number
  high: number
  critical: number
}

export interface DeviceActivityStats {
  date: string
  connected: number
  blocked: number
  allowed: number
}

// =====================================================
// Query / Filter helpers
// =====================================================
export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface DateRangeParams {
  startDate?: string
  endDate?: string
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}
