/**
 * ${import.meta.env.VITE_APP_NAME} API Service
 * All Supabase REST API calls organized by BRD module
 */
import { supabase, type Tables } from '@/lib/supabase'

// ─── DASHBOARD ─────────────────────────────────────────────────────────────

export const dashboardApi = {
  /** Summary stats for the main dashboard */
  async getSummaryStats() {
    const [computers, alerts, violations, devices] = await Promise.all([
      (supabase.from('computers') as any).select('status', { count: 'exact' }),
      (supabase.from('alerts') as any).select('severity, status', { count: 'exact' }).eq('status', 'OPEN'),
      (supabase.from('policy_violations') as any).select('severity', { count: 'exact' }).eq('resolved', false),
      (supabase.from('device_sessions') as any).select('action_taken', { count: 'exact' })
        .gte('connection_time', new Date(Date.now() - 86400000).toISOString()),
    ])
    return { computers, alerts, violations, devices }
  },

  /** Recent security events for feed */
  async getRecentEvents(limit = 10) {
    return supabase
      .from('device_events')
      .select(`
        event_id, event_type, action_taken, event_time, details,
        devices(device_name, serial_number),
        computers(computer_name),
        users(username, display_name)
      `)
      .order('event_time', { ascending: false })
      .limit(limit)
  },

  /** Active policy count */
  async getActivePolicies() {
    return supabase
      .from('policies')
      .select('policy_id, policy_name, policy_type', { count: 'exact' })
      .eq('status', 'ACTIVE')
  },

  /** Recent violations (last 7 days) for chart */
  async getViolationTrend() {
    const since = new Date(Date.now() - 7 * 86400000).toISOString()
    return supabase
      .from('policy_violations')
      .select('severity, violation_time')
      .gte('violation_time', since)
      .order('violation_time', { ascending: true })
  },
}

// ─── DEVICE CONTROL ────────────────────────────────────────────────────────

export const deviceControlApi = {
  /** All devices with class info */
  async getDevices(params?: { search?: string; whitelisted?: boolean; blacklisted?: boolean; page?: number; limit?: number }) {
    let q = supabase
      .from('devices')
      .select(`*, device_classes(class_name, description)`, { count: 'exact' })
    if (params?.search) q = q.ilike('device_name', `%${params.search}%`)
    if (params?.whitelisted !== undefined) q = q.eq('is_whitelisted', params.whitelisted)
    if (params?.blacklisted !== undefined) q = q.eq('is_blacklisted', params.blacklisted)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    q = q.range(page * limit, page * limit + limit - 1).order('created_at', { ascending: false })
    return q
  },

  async getDeviceById(id: string) {
    return supabase
      .from('devices')
      .select(`*, device_classes(class_name)`)
      .eq('device_id', id)
      .single()
  },

  async updateDevice(id: string, data: Partial<{ is_whitelisted: boolean; is_blacklisted: boolean; notes: string }>) {
    return supabase.from('devices').update({ ...data, updated_at: new Date().toISOString() }).eq('device_id', id)
  },

  /** Device sessions / connection history */
  async getDeviceSessions(params?: { deviceId?: string; computerId?: string; userId?: string; action?: string; from?: string; to?: string; page?: number; limit?: number }) {
    let q = supabase.from('device_sessions').select(`
      *, devices(device_name, serial_number),
      computers(computer_name), users(username, display_name)
    `, { count: 'exact' })
    if (params?.deviceId) q = q.eq('device_id', params.deviceId)
    if (params?.computerId) q = q.eq('computer_id', params.computerId)
    if (params?.userId) q = q.eq('user_id', params.userId)
    if (params?.action) q = q.eq('action_taken', params.action)
    if (params?.from) q = q.gte('connection_time', params.from)
    if (params?.to) q = q.lte('connection_time', params.to)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('connection_time', { ascending: false })
  },

  /** All device classes */
  async getDeviceClasses() {
    return supabase.from('device_classes').select('*').order('class_name')
  },

  async createDeviceClass(data: { class_name: string; description?: string; is_custom: boolean }) {
    return supabase.from('device_classes').insert(data).select().single()
  },

  /** Computers */
  async getComputers(params?: { search?: string; status?: string; page?: number; limit?: number }) {
    let q = supabase.from('computers').select(`*, departments(name)`, { count: 'exact' })
    if (params?.search) q = q.ilike('computer_name', `%${params.search}%`)
    if (params?.status) q = q.eq('status', params.status)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('last_seen', { ascending: false })
  },

  async getComputerById(id: string) {
    return supabase.from('computers').select(`*, departments(name)`).eq('computer_id', id).single()
  },

  /** Users */
  async getEndpointUsers(params?: { search?: string; isActive?: boolean; page?: number; limit?: number }) {
    let q = supabase.from('users').select(`*, departments(name)`, { count: 'exact' })
    if (params?.search) q = q.or(`username.ilike.%${params.search}%,display_name.ilike.%${params.search}%,email.ilike.%${params.search}%`)
    if (params?.isActive !== undefined) q = q.eq('is_active', params.isActive)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('created_at', { ascending: false })
  },

  async getUserById(id: string) {
    return supabase.from('users').select(`*, departments(name), user_group_memberships(user_groups(group_name))`).eq('user_id', id).single()
  },

  async updateUser(id: string, data: Partial<Tables['users']>) {
    return supabase.from('users').update({ ...data, updated_at: new Date().toISOString() }).eq('user_id', id)
  },

  /** Groups */
  async getUserGroups() {
    return supabase.from('user_groups').select('*').order('group_name')
  },

  async getComputerGroups() {
    return supabase.from('computer_groups').select('*').order('group_name')
  },
}

// ─── POLICIES ──────────────────────────────────────────────────────────────

export const policiesApi = {
  async getPolicies(params?: { type?: string; status?: string; search?: string; page?: number; limit?: number }) {
    let q = supabase.from('policies').select(`*, users!created_by(username, display_name)`, { count: 'exact' })
    if (params?.type) q = q.eq('policy_type', params.type)
    if (params?.status) q = q.eq('status', params.status)
    if (params?.search) q = q.ilike('policy_name', `%${params.search}%`)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('priority').order('created_at', { ascending: false })
  },

  async getPolicyById(id: string) {
    return supabase
      .from('policies')
      .select(`*, policy_rules(*), policy_assignments(*), users!created_by(username)`)
      .eq('policy_id', id)
      .single()
  },

  async createPolicy(data: Omit<Tables['policies'], 'policy_id' | 'created_at' | 'updated_at'>) {
    return supabase.from('policies').insert(data).select().single()
  },

  async updatePolicy(id: string, data: Partial<Tables['policies']>) {
    return supabase.from('policies').update({ ...data, updated_at: new Date().toISOString() }).eq('policy_id', id)
  },

  async deletePolicy(id: string) {
    return supabase.from('policies').delete().eq('policy_id', id)
  },

  async getPolicyRules(policyId: string) {
    return supabase.from('policy_rules').select('*').eq('policy_id', policyId)
  },

  async createPolicyRule(data: Omit<Tables['policy_rules'], 'rule_id' | 'created_at'>) {
    return supabase.from('policy_rules').insert(data).select().single()
  },
}

// ─── CONTENT AWARE PROTECTION ──────────────────────────────────────────────

export const contentAwareApi = {
  async getContentPolicies(params?: { status?: string; page?: number; limit?: number }) {
    let q = supabase.from('content_aware_policies').select(`*, users!created_by(username)`, { count: 'exact' })
    if (params?.status) q = q.eq('status', params.status)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('created_at', { ascending: false })
  },

  async getContentPatterns(params?: { type?: string; search?: string }) {
    let q = supabase.from('content_patterns').select('*', { count: 'exact' })
    if (params?.type) q = q.eq('pattern_type', params.type)
    if (params?.search) q = q.ilike('pattern_name', `%${params.search}%`)
    return q.order('pattern_name')
  },

  async createContentPattern(data: { pattern_name: string; pattern_type: string; pattern_value: string; description?: string; is_predefined?: boolean }) {
    return supabase.from('content_patterns').insert(data).select().single()
  },

  async getInspectionResults(params?: { userId?: string; computerId?: string; action?: string; from?: string; to?: string; page?: number; limit?: number }) {
    let q = supabase.from('content_inspection_results').select(`
      *, users(username, display_name), computers(computer_name),
      content_aware_policies(policy_name)
    `, { count: 'exact' })
    if (params?.userId) q = q.eq('user_id', params.userId)
    if (params?.computerId) q = q.eq('computer_id', params.computerId)
    if (params?.action) q = q.eq('action_taken', params.action)
    if (params?.from) q = q.gte('inspection_time', params.from)
    if (params?.to) q = q.lte('inspection_time', params.to)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('inspection_time', { ascending: false })
  },
}

// ─── EDISCOVERY ────────────────────────────────────────────────────────────

export const ediscoveryApi = {
  async getPolicies() {
    return supabase.from('ediscovery_policies').select(`*, users!created_by(username)`).order('created_at', { ascending: false })
  },

  async createPolicy(data: { policy_name: string; description?: string; scan_scope: Record<string, unknown> }) {
    return supabase.from('ediscovery_policies').insert(data).select().single()
  },

  async getScans(params?: { status?: string; policyId?: string; page?: number; limit?: number }) {
    let q = supabase.from('ediscovery_scans').select(`
      *, ediscovery_policies(policy_name), users!created_by(username)
    `, { count: 'exact' })
    if (params?.status) q = q.eq('status', params.status)
    if (params?.policyId) q = q.eq('policy_id', params.policyId)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('created_at', { ascending: false })
  },

  async getScanResults(scanId: string, params?: { sensitivity?: string; page?: number; limit?: number }) {
    let q = supabase.from('ediscovery_results').select(`
      *, computers(computer_name), users(username, display_name)
    `, { count: 'exact' }).eq('scan_id', scanId)
    if (params?.sensitivity) q = q.eq('sensitivity_level', params.sensitivity)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('discovered_at', { ascending: false })
  },

  async cancelScan(scanId: string) {
    return supabase.from('ediscovery_scans').update({ status: 'CANCELLED' }).eq('scan_id', scanId)
  },
}

// ─── ENCRYPTION ────────────────────────────────────────────────────────────

export const encryptionApi = {
  async getEncryptedDevices(params?: { computerId?: string; userId?: string; page?: number; limit?: number }) {
    let q = supabase.from('encrypted_devices').select(`
      *, devices(device_name, serial_number),
      computers(computer_name), users(username, display_name),
      encryption_keys(key_name, key_algorithm)
    `, { count: 'exact' })
    if (params?.computerId) q = q.eq('computer_id', params.computerId)
    if (params?.userId) q = q.eq('user_id', params.userId)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('encryption_time', { ascending: false })
  },

  async getEncryptionOperations(params?: { deviceEncryptionId?: string; page?: number; limit?: number }) {
    let q = supabase.from('encryption_operations').select(`
      *, users(username), computers(computer_name)
    `, { count: 'exact' })
    if (params?.deviceEncryptionId) q = q.eq('device_encryption_id', params.deviceEncryptionId)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('operation_time', { ascending: false })
  },

  async createTemporaryPassword(data: { device_encryption_id: string; password_hash: string; expires_at: string; created_by: string }) {
    return supabase.from('temporary_passwords').insert(data).select().single()
  },
}

// ─── REPORTS & LOGS ────────────────────────────────────────────────────────

export const reportsApi = {
  /** Logs report - device events */
  async getSystemLogs(params?: { level?: string; module?: string; userId?: string; computerId?: string; from?: string; to?: string; page?: number; limit?: number }) {
    let q = supabase.from('system_logs').select(`
      *, users(username), computers(computer_name)
    `, { count: 'exact' })
    if (params?.level) q = q.eq('log_level', params.level)
    if (params?.module) q = q.eq('module', params.module)
    if (params?.userId) q = q.eq('user_id', params.userId)
    if (params?.from) q = q.gte('timestamp', params.from)
    if (params?.to) q = q.lte('timestamp', params.to)
    const limit = params?.limit ?? 50
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('timestamp', { ascending: false })
  },

  /** File tracing */
  async getFileTransfers(params?: { userId?: string; computerId?: string; deviceId?: string; action?: string; from?: string; to?: string; search?: string; page?: number; limit?: number }) {
    let q = supabase.from('file_transfers').select(`
      *, users(username, display_name), computers(computer_name), devices(device_name, serial_number)
    `, { count: 'exact' })
    if (params?.userId) q = q.eq('user_id', params.userId)
    if (params?.computerId) q = q.eq('computer_id', params.computerId)
    if (params?.deviceId) q = q.eq('device_id', params.deviceId)
    if (params?.action) q = q.eq('action_taken', params.action)
    if (params?.from) q = q.gte('transfer_time', params.from)
    if (params?.to) q = q.lte('transfer_time', params.to)
    if (params?.search) q = q.ilike('file_name', `%${params.search}%`)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('transfer_time', { ascending: false })
  },

  /** Policy violations */
  async getPolicyViolations(params?: { severity?: string; resolved?: boolean; userId?: string; from?: string; to?: string; page?: number; limit?: number }) {
    let q = supabase.from('policy_violations').select(`
      *, policies(policy_name, policy_type),
      users(username, display_name), computers(computer_name), devices(device_name)
    `, { count: 'exact' })
    if (params?.severity) q = q.eq('severity', params.severity)
    if (params?.resolved !== undefined) q = q.eq('resolved', params.resolved)
    if (params?.userId) q = q.eq('user_id', params.userId)
    if (params?.from) q = q.gte('violation_time', params.from)
    if (params?.to) q = q.lte('violation_time', params.to)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('violation_time', { ascending: false })
  },

  async resolveViolation(id: string, resolvedBy: string) {
    return supabase.from('policy_violations').update({ resolved: true, resolved_by: resolvedBy, resolved_at: new Date().toISOString() }).eq('violation_id', id)
  },

  /** Admin actions audit */
  async getAdminActions(params?: { adminId?: string; actionType?: string; from?: string; to?: string; page?: number; limit?: number }) {
    let q = supabase.from('admin_actions').select(`
      *, users!admin_user_id(username, display_name)
    `, { count: 'exact' })
    if (params?.adminId) q = q.eq('admin_user_id', params.adminId)
    if (params?.actionType) q = q.eq('action_type', params.actionType)
    if (params?.from) q = q.gte('action_time', params.from)
    if (params?.to) q = q.lte('action_time', params.to)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('action_time', { ascending: false })
  },

  /** Report templates */
  async getReportTemplates() {
    return supabase.from('report_templates').select('*').order('template_name')
  },

  async getScheduledReports() {
    return supabase.from('scheduled_reports').select(`*, report_templates(template_name, report_type)`).order('created_at', { ascending: false })
  },

  async getReportHistory(params?: { page?: number; limit?: number }) {
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return supabase.from('report_history').select(`*, users!generated_by(username)`, { count: 'exact' })
      .range(page * limit, page * limit + limit - 1)
      .order('created_at', { ascending: false })
  },
}

// ─── ALERTS ────────────────────────────────────────────────────────────────

export const alertsApi = {
  async getAlerts(params?: { severity?: string; status?: string; type?: string; from?: string; to?: string; page?: number; limit?: number }) {
    let q = supabase.from('alerts').select(`
      *, users(username), computers(computer_name), devices(device_name)
    `, { count: 'exact' })
    if (params?.severity) q = q.eq('severity', params.severity)
    if (params?.status) q = q.eq('status', params.status)
    if (params?.type) q = q.eq('alert_type', params.type)
    if (params?.from) q = q.gte('created_at', params.from)
    if (params?.to) q = q.lte('created_at', params.to)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('created_at', { ascending: false })
  },

  async acknowledgeAlert(id: string, userId: string) {
    return supabase.from('alerts').update({ status: 'ACKNOWLEDGED', acknowledged_by: userId, acknowledged_at: new Date().toISOString() }).eq('alert_id', id)
  },

  async resolveAlert(id: string, userId: string) {
    return supabase.from('alerts').update({ status: 'RESOLVED', resolved_by: userId, resolved_at: new Date().toISOString() }).eq('alert_id', id)
  },

  async getAlertRules() {
    return supabase.from('alert_rules').select(`*, users!created_by(username)`).order('rule_name')
  },

  async createAlertRule(data: { rule_name: string; alert_type: string; condition_expression: Record<string, unknown>; severity: string; notification_channels?: Record<string, unknown> }) {
    return supabase.from('alert_rules').insert(data).select().single()
  },

  async toggleAlertRule(id: string, isActive: boolean) {
    return supabase.from('alert_rules').update({ is_active: isActive, updated_at: new Date().toISOString() }).eq('rule_id', id)
  },
}

// ─── ALLOWLISTS / DENYLISTS ────────────────────────────────────────────────

export const listsApi = {
  async getDeviceAllowlists() {
    return supabase.from('device_allowlists').select(`*, users!created_by(username)`).order('created_at', { ascending: false })
  },

  async addToAllowlist(data: { entity_type: string; entity_value: string; description?: string; expires_at?: string }) {
    return supabase.from('device_allowlists').insert(data).select().single()
  },

  async removeFromAllowlist(id: string) {
    return supabase.from('device_allowlists').delete().eq('allowlist_id', id)
  },

  async getDeviceDenylists() {
    return supabase.from('device_denylists').select(`*, users!created_by(username)`).order('created_at', { ascending: false })
  },

  async addToDenylist(data: { entity_type: string; entity_value: string; description?: string; expires_at?: string }) {
    return supabase.from('device_denylists').insert(data).select().single()
  },

  async removeFromDenylist(id: string) {
    return supabase.from('device_denylists').delete().eq('denylist_id', id)
  },

  async getFiletypeAllowlists() {
    return supabase.from('filetype_allowlists').select('*').order('file_extension')
  },

  async getFiletypeDenylists() {
    return supabase.from('filetype_denylists').select('*').order('file_extension')
  },

  async getUrlCategories() {
    return supabase.from('url_categories').select(`*, url_category_mappings(count)`).order('category_name')
  },

  async getUrlMappings(categoryId: string) {
    return supabase.from('url_category_mappings').select('*').eq('category_id', categoryId)
  },
}

// ─── SYSTEM ADMINISTRATION ─────────────────────────────────────────────────

export const adminApi = {
  async getDepartments() {
    return supabase.from('departments').select('*').order('name')
  },

  async createDepartment(data: { name: string; description?: string; parent_department_id?: string }) {
    return supabase.from('departments').insert(data).select().single()
  },

  async updateDepartment(id: string, data: Partial<{ name: string; description: string }>) {
    return supabase.from('departments').update({ ...data, updated_at: new Date().toISOString() }).eq('department_id', id)
  },

  async getSystemSettings() {
    return supabase.from('system_settings').select('*').order('setting_key')
  },

  async updateSystemSetting(key: string, value: string) {
    return supabase.from('system_settings').update({ setting_value: value, updated_at: new Date().toISOString() }).eq('setting_key', key)
  },

  async getLicense() {
    return supabase.from('licenses').select('*').eq('is_active', true).single()
  },

  async getDirectoryServices() {
    return supabase.from('directory_services').select('*').order('service_name')
  },

  async createDirectoryService(data: { service_type: string; service_name: string; connection_config: Record<string, unknown>; sync_config?: Record<string, unknown> }) {
    return supabase.from('directory_services').insert(data).select().single()
  },

  async toggleDirectoryService(id: string, isActive: boolean) {
    return supabase.from('directory_services').update({ is_active: isActive, updated_at: new Date().toISOString() }).eq('service_id', id)
  },

  async getSiemConfigurations() {
    return supabase.from('siem_configurations').select('*').order('siem_name')
  },
}

// ─── MAINTENANCE ───────────────────────────────────────────────────────────

export const maintenanceApi = {
  async getBackupJobs(params?: { status?: string; page?: number; limit?: number }) {
    let q = supabase.from('backup_jobs').select(`*, users!created_by(username)`, { count: 'exact' })
    if (params?.status) q = q.eq('status', params.status)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('start_time', { ascending: false })
  },

  async getSnapshots() {
    return supabase.from('system_snapshots').select(`*, users!created_by(username)`).order('start_time', { ascending: false })
  },

  async getFileShadows(params?: { userId?: string; computerId?: string; search?: string; page?: number; limit?: number }) {
    let q = supabase.from('file_shadows').select(`
      *, users(username), computers(computer_name), devices(device_name)
    `, { count: 'exact' })
    if (params?.userId) q = q.eq('user_id', params.userId)
    if (params?.computerId) q = q.eq('computer_id', params.computerId)
    if (params?.search) q = q.ilike('original_file_name', `%${params.search}%`)
    const limit = params?.limit ?? 20
    const page = params?.page ?? 0
    return q.range(page * limit, page * limit + limit - 1).order('created_at', { ascending: false })
  },

  async deleteFileShadow(id: string) {
    return supabase.from('file_shadows').delete().eq('shadow_id', id)
  },
}

// ─── Re-export Tables type for other files to use ──────────────────────────
export type { Tables } from '@/lib/supabase'
