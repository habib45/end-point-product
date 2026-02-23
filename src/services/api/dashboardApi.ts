// =====================================================
// Dashboard API Service
// FR-DASH-001: General Dashboard
// FR-DASH-002: System Status Dashboard
// FR-DASH-003: Effective Rights Dashboard
// =====================================================

import { supabase } from '@/services/supabase/client'
import type { DashboardSummary, ViolationStats, DeviceActivityStats, ApiResponse } from '@/types/database'

// FR-DASH-001: Real-time dashboard summary using Supabase RPC
export async function getDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
  const { data, error } = await supabase.rpc('get_dashboard_summary')
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

// FR-DASH-001: Active policies count
export async function getActivePoliciesCount(): Promise<ApiResponse<number>> {
  const { count, error } = await supabase
    .from('policies')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ACTIVE')
  if (error) return { data: null, error: error.message }
  return { data: count ?? 0, error: null }
}

// FR-DASH-001: Recent security events (last 50)
export async function getRecentSecurityEvents(limit = 50): Promise<ApiResponse<unknown[]>> {
  const { data, error } = await supabase
    .from('device_events')
    .select(`
      event_id, event_type, action_taken, event_time, details,
      devices(device_name, serial_number),
      computers(computer_name),
      users(username, display_name)
    `)
    .order('event_time', { ascending: false })
    .limit(limit)
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

// FR-DASH-001: Recent alerts
export async function getRecentAlerts(limit = 10): Promise<ApiResponse<unknown[]>> {
  const { data, error } = await supabase
    .from('alerts')
    .select(`
      alert_id, alert_type, title, message, severity, status, created_at,
      users(username),
      computers(computer_name)
    `)
    .eq('status', 'OPEN')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

// FR-DASH-002: Endpoint connectivity counts
export async function getEndpointStatusCounts(): Promise<ApiResponse<Record<string, number>>> {
  const { data, error } = await supabase
    .from('computers')
    .select('status')
  if (error) return { data: null, error: error.message }

  const counts = (data ?? []).reduce((acc: Record<string, number>, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1
    return acc
  }, {})
  return { data: counts, error: null }
}

// FR-DASH-001: Policy violation trend (last N days)
export async function getViolationTrend(days = 30): Promise<ApiResponse<ViolationStats[]>> {
  const { data, error } = await supabase.rpc('get_policy_violations_stats', { days })
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

// FR-DASH-001: Device activity trend
export async function getDeviceActivityTrend(days = 7): Promise<ApiResponse<DeviceActivityStats[]>> {
  const { data, error } = await supabase.rpc('get_device_activity_stats', { days })
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

// FR-DASH-003: Effective rights - user permissions summary
export async function getEffectiveRightsSummary(userId?: string): Promise<ApiResponse<unknown[]>> {
  let query = supabase
    .from('policy_assignments')
    .select(`
      assignment_id, target_type, target_id, is_active, assigned_at,
      policies(policy_id, policy_name, policy_type, status, priority)
    `)
    .eq('is_active', true)

  if (userId) {
    query = query.eq('target_id', userId)
  }

  const { data, error } = await query.limit(100)
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

// FR-DASH-002: License status
export async function getLicenseStatus(): Promise<ApiResponse<unknown>> {
  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('is_active', true)
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}
