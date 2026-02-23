// =====================================================
// Content Aware Protection API
// FR-CAP-001: Content Aware Dashboard
// FR-CAP-002: Content Aware Policies
// FR-CAP-003: Deep Packet Inspection
// =====================================================

import { supabase } from '@/services/supabase/client'
import type {
  ContentPattern, ContentAwarePolicy, ContentInspectionResult,
  ApiResponse, PaginationParams, DateRangeParams
} from '@/types/database'

// FR-CAP-001: Dashboard stats
export async function getContentAwareStats(): Promise<ApiResponse<{
  totalInspections: number
  blockedToday: number
  violationsThisWeek: number
  topViolators: unknown[]
}>> {
  const today = new Date().toISOString().split('T')[0]
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

  const [totalRes, blockedRes, weekRes] = await Promise.all([
    supabase.from('content_inspection_results').select('*', { count: 'exact', head: true }),
    supabase.from('content_inspection_results')
      .select('*', { count: 'exact', head: true })
      .eq('action_taken', 'BLOCK')
      .gte('inspection_time', today),
    supabase.from('content_inspection_results')
      .select('*', { count: 'exact', head: true })
      .neq('action_taken', 'ALLOW')
      .gte('inspection_time', weekAgo),
  ])

  // Top violators: group by user_id
  const { data: violators } = await supabase
    .from('content_inspection_results')
    .select('user_id, users(username, display_name)')
    .neq('action_taken', 'ALLOW')
    .gte('inspection_time', weekAgo)
    .limit(200)

  const violatorMap: Record<string, { username: string; count: number }> = {}
  ;(violators ?? []).forEach((r: unknown) => {
    const row = r as { user_id: string; users: { username: string } | null }
    if (!row.user_id) return
    if (!violatorMap[row.user_id]) {
      violatorMap[row.user_id] = { username: row.users?.username ?? 'Unknown', count: 0 }
    }
    violatorMap[row.user_id].count++
  })

  const topViolators = Object.values(violatorMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return {
    data: {
      totalInspections: totalRes.count ?? 0,
      blockedToday: blockedRes.count ?? 0,
      violationsThisWeek: weekRes.count ?? 0,
      topViolators,
    },
    error: null,
  }
}

// Content inspection results list
export async function getContentInspectionResults(
  params?: PaginationParams & DateRangeParams & { action?: string; userId?: string }
): Promise<ApiResponse<ContentInspectionResult[]>> {
  const { page = 1, pageSize = 20, startDate, endDate, action, userId } = params ?? {}
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('content_inspection_results')
    .select(`
      *,
      users(username, display_name),
      computers(computer_name),
      content_aware_policies(policy_name)
    `, { count: 'exact' })
    .order('inspection_time', { ascending: false })
    .range(from, to)

  if (startDate) query = query.gte('inspection_time', startDate)
  if (endDate) query = query.lte('inspection_time', endDate)
  if (action) query = query.eq('action_taken', action)
  if (userId) query = query.eq('user_id', userId)

  const { data, error, count } = await query
  if (error) return { data: null, error: error.message }
  return { data: data as ContentInspectionResult[], error: null, count: count ?? 0 }
}

// FR-CAP-002: Content Patterns (predefined + custom)
export async function getContentPatterns(isPredefined?: boolean): Promise<ApiResponse<ContentPattern[]>> {
  let query = supabase.from('content_patterns').select('*').order('pattern_name')
  if (isPredefined !== undefined) query = query.eq('is_predefined', isPredefined)
  const { data, error } = await query
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function createContentPattern(pattern: Partial<ContentPattern>): Promise<ApiResponse<ContentPattern>> {
  const { data, error } = await supabase
    .from('content_patterns')
    .insert({ ...pattern, is_predefined: false })
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function updateContentPattern(patternId: string, updates: Partial<ContentPattern>): Promise<ApiResponse<ContentPattern>> {
  const { data, error } = await supabase
    .from('content_patterns')
    .update(updates)
    .eq('pattern_id', patternId)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function deleteContentPattern(patternId: string): Promise<ApiResponse<null>> {
  const { error } = await supabase
    .from('content_patterns')
    .delete()
    .eq('pattern_id', patternId)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

// FR-CAP-002: Content Aware Policies
export async function getContentAwarePolicies(params?: PaginationParams): Promise<ApiResponse<ContentAwarePolicy[]>> {
  const { page = 1, pageSize = 20 } = params ?? {}
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('content_aware_policies')
    .select('*, users!created_by(username)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) return { data: null, error: error.message }
  return { data: data as ContentAwarePolicy[], error: null, count: count ?? 0 }
}

export async function createContentAwarePolicy(policy: Partial<ContentAwarePolicy>): Promise<ApiResponse<ContentAwarePolicy>> {
  const { data, error } = await supabase
    .from('content_aware_policies')
    .insert(policy)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function updateContentAwarePolicy(policyId: string, updates: Partial<ContentAwarePolicy>): Promise<ApiResponse<ContentAwarePolicy>> {
  const { data, error } = await supabase
    .from('content_aware_policies')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('policy_id', policyId)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function deleteContentAwarePolicy(policyId: string): Promise<ApiResponse<null>> {
  const { error } = await supabase
    .from('content_aware_policies')
    .delete()
    .eq('policy_id', policyId)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}
