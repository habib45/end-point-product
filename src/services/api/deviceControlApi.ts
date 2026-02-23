// =====================================================
// Device Control API Service
// FR-DC-001: Device Control Dashboard
// FR-DC-002: Device Management
// FR-DC-003: Computer Management
// FR-DC-004: User Management
// FR-DC-005: Group Management
// FR-DC-006: Global Rights Management
// FR-DC-007: Global Settings
// FR-DC-008: Custom Device Classes
// =====================================================

import { supabase } from '@/services/supabase/client'
import type {
  Device, DeviceClass, DeviceSession, Computer, ComputerGroup,
  User, UserGroup, Policy, PolicyAssignment,
  ApiResponse, PaginationParams, DateRangeParams
} from '@/types/database'

// ---- FR-DC-001: Device Control Dashboard ----

export async function getDeviceControlStats(): Promise<ApiResponse<{
  totalDevices: number
  blockedToday: number
  allowedToday: number
  whitelistedDevices: number
}>> {
  const today = new Date().toISOString().split('T')[0]

  const [totalRes, blockedRes, allowedRes, whitelistRes] = await Promise.all([
    (supabase.from('devices') as any).select('*', { count: 'exact', head: true }),
    (supabase.from('device_sessions') as any).select('*', { count: 'exact', head: true })
      .eq('action_taken', 'BLOCK')
      .gte('connection_time', today),
    (supabase.from('device_sessions') as any).select('*', { count: 'exact', head: true })
      .eq('action_taken', 'ALLOW')
      .gte('connection_time', today),
    (supabase.from('devices') as any).select('*', { count: 'exact', head: true })
      .eq('is_whitelisted', true),
  ])

  return {
    data: {
      totalDevices: totalRes.count ?? 0,
      blockedToday: blockedRes.count ?? 0,
      allowedToday: allowedRes.count ?? 0,
      whitelistedDevices: whitelistRes.count ?? 0,
    },
    error: null,
  }
}

// Real-time device connection events — uses Supabase Realtime
export function subscribeToDeviceEvents(callback: (payload: unknown) => void) {
  return (supabase.channel('device_events_realtime') as any)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'device_events',
    }, callback)
    .subscribe()
}

// Recent device sessions
export async function getRecentDeviceSessions(
  params?: PaginationParams & DateRangeParams
): Promise<ApiResponse<DeviceSession[]>> {
  const { page = 1, pageSize = 20, startDate, endDate } = params ?? {}
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = (supabase.from('device_sessions') as any)
    .select(`
      *,
      devices(device_name, serial_number, vendor_id, product_id,
        device_classes(class_name)),
      computers(computer_name, ip_address),
      users(username, display_name)
    `, { count: 'exact' })
    .order('connection_time', { ascending: false })
    .range(from, to)

  if (startDate) query = query.gte('connection_time', startDate)
  if (endDate) query = query.lte('connection_time', endDate)

  const { data, error, count } = await query
  if (error) return { data: null, error: error.message }
  return { data: data as DeviceSession[], error: null, count: count ?? 0 }
}

// ---- FR-DC-002: Device Management ----

export async function getDevices(params?: PaginationParams & {
  search?: string
  classId?: string
  whitelisted?: boolean
  blacklisted?: boolean
}): Promise<ApiResponse<Device[]>> {
  const { page = 1, pageSize = 20, search, classId, whitelisted, blacklisted } = params ?? {}
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = (supabase.from('devices') as any)
    .select('*, device_classes(class_name, description)', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`device_name.ilike.%${search}%,serial_number.ilike.%${search}%,vendor_id.ilike.%${search}%`)
  }
  if (classId) query = query.eq('device_class_id', classId)
  if (whitelisted !== undefined) query = query.eq('is_whitelisted', whitelisted)
  if (blacklisted !== undefined) query = query.eq('is_blacklisted', blacklisted)

  const { data, error, count } = await query
  if (error) return { data: null, error: error.message }
  return { data: data as Device[], error: null, count: count ?? 0 }
}

export async function getDeviceById(deviceId: string): Promise<ApiResponse<Device>> {
  const { data, error } = await (supabase.from('devices') as any)
    .select('*, device_classes(class_name, description)')
    .eq('device_id', deviceId)
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function createDevice(device: Partial<Device>): Promise<ApiResponse<Device>> {
  const { data, error } = await (supabase.from('devices') as any)
    .insert(device)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function updateDevice(deviceId: string, updates: Partial<Device>): Promise<ApiResponse<Device>> {
  const { data, error } = await (supabase.from('devices') as any)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('device_id', deviceId)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function deleteDevice(deviceId: string): Promise<ApiResponse<null>> {
  const { error } = await (supabase.from('devices') as any)
    .delete()
    .eq('device_id', deviceId)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

// FR-DC-002: Whitelist/Blacklist a device
export async function setDeviceWhitelist(deviceId: string, whitelisted: boolean): Promise<ApiResponse<Device>> {
  return updateDevice(deviceId, { is_whitelisted: whitelisted })
}

export async function setDeviceBlacklist(deviceId: string, blacklisted: boolean): Promise<ApiResponse<Device>> {
  return updateDevice(deviceId, { is_blacklisted: blacklisted })
}

// ---- FR-DC-008: Device Classes ----

export async function getDeviceClasses(): Promise<ApiResponse<DeviceClass[]>> {
  const { data, error } = await (supabase.from('device_classes') as any)
    .select('*')
    .order('class_name')
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function createDeviceClass(dc: Partial<DeviceClass>): Promise<ApiResponse<DeviceClass>> {
  const { data, error } = await (supabase.from('device_classes') as any)
    .insert({ ...dc, is_custom: true })
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

// ---- FR-DC-003: Computer Management ----

export async function getComputers(params?: PaginationParams & {
  search?: string
  status?: string
  departmentId?: string
}): Promise<ApiResponse<Computer[]>> {
  const { page = 1, pageSize = 20, search, status, departmentId } = params ?? {}
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = (supabase.from('computers') as any)
    .select('*, departments(name)', { count: 'exact' })
    .range(from, to)
    .order('computer_name')

  if (search) query = query.ilike('computer_name', `%${search}%`)
  if (status) query = query.eq('status', status)
  if (departmentId) query = query.eq('department_id', departmentId)

  const { data, error, count } = await query
  if (error) return { data: null, error: error.message }
  return { data: data as Computer[], error: null, count: count ?? 0 }
}

export async function getComputerById(computerId: string): Promise<ApiResponse<Computer>> {
  const { data, error } = await (supabase.from('computers') as any)
    .select('*, departments(name)')
    .eq('computer_id', computerId)
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function updateComputer(computerId: string, updates: Partial<Computer>): Promise<ApiResponse<Computer>> {
  const { data, error } = await (supabase.from('computers') as any)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('computer_id', computerId)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function getComputerGroups(): Promise<ApiResponse<ComputerGroup[]>> {
  const { data, error } = await (supabase.from('computer_groups') as any)
    .select('*')
    .order('group_name')
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function createComputerGroup(group: Partial<ComputerGroup>): Promise<ApiResponse<ComputerGroup>> {
  const { data, error } = await (supabase.from('computer_groups') as any)
    .insert(group)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function assignComputerToGroup(computerId: string, groupId: string): Promise<ApiResponse<null>> {
  const { error } = await (supabase.from('computer_group_memberships') as any)
    .upsert({ computer_id: computerId, group_id: groupId })
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

// ---- FR-DC-004: User Management ----

export async function getUsers(params?: PaginationParams & {
  search?: string
  departmentId?: string
  isActive?: boolean
  userType?: string
}): Promise<ApiResponse<User[]>> {
  const { page = 1, pageSize = 20, search, departmentId, isActive, userType } = params ?? {}
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = (supabase.from('users') as any)
    .select('*, departments(name)', { count: 'exact' })
    .range(from, to)
    .order('username')

  if (search) {
    query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%,display_name.ilike.%${search}%`)
  }
  if (departmentId) query = query.eq('department_id', departmentId)
  if (isActive !== undefined) query = query.eq('is_active', isActive)
  if (userType) query = query.eq('user_type', userType)

  const { data, error, count } = await query
  if (error) return { data: null, error: error.message }
  return { data: data as User[], error: null, count: count ?? 0 }
}

export async function getUserById(userId: string): Promise<ApiResponse<User>> {
  const { data, error } = await (supabase.from('users') as any)
    .select('*, departments(name)')
    .eq('user_id', userId)
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function createUser(user: Partial<User>): Promise<ApiResponse<User>> {
  const { data, error } = await (supabase.from('users') as any)
    .insert(user)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
  const { data, error } = await (supabase.from('users') as any)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function deleteUser(userId: string): Promise<ApiResponse<null>> {
  const { error } = await (supabase.from('users') as any)
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

// ---- FR-DC-005: Group Management ----

export async function getUserGroups(): Promise<ApiResponse<UserGroup[]>> {
  const { data, error } = await (supabase.from('user_groups') as any)
    .select('*')
    .order('group_name')
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function createUserGroup(group: Partial<UserGroup>): Promise<ApiResponse<UserGroup>> {
  const { data, error } = await (supabase.from('user_groups') as any)
    .insert(group)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function addUserToGroup(userId: string, groupId: string): Promise<ApiResponse<null>> {
  const { error } = await (supabase.from('user_group_memberships') as any)
    .upsert({ user_id: userId, group_id: groupId })
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function removeUserFromGroup(userId: string, groupId: string): Promise<ApiResponse<null>> {
  const { error } = await (supabase.from('user_group_memberships') as any)
    .delete()
    .eq('user_id', userId)
    .eq('group_id', groupId)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

// ---- FR-DC-006: Global Rights / Policy Assignments ----

export async function getPolicies(params?: PaginationParams & {
  status?: string
  policyType?: string
}): Promise<ApiResponse<Policy[]>> {
  const { page = 1, pageSize = 20, status, policyType } = params ?? {}
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = (supabase.from('policies') as any)
    .select('*, users!created_by(username)', { count: 'exact' })
    .range(from, to)
    .order('priority')

  if (status) query = query.eq('status', status)
  if (policyType) query = query.eq('policy_type', policyType)

  const { data, error, count } = await query
  if (error) return { data: null, error: error.message }
  return { data: data as Policy[], error: null, count: count ?? 0 }
}

export async function createPolicy(policy: Partial<Policy>): Promise<ApiResponse<Policy>> {
  const { data, error } = await (supabase.from('policies') as any)
    .insert(policy)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function updatePolicy(policyId: string, updates: Partial<Policy>): Promise<ApiResponse<Policy>> {
  const { data, error } = await (supabase.from('policies') as any)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('policy_id', policyId)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function deletePolicy(policyId: string): Promise<ApiResponse<null>> {
  const { error } = await supabase
    .from('policies')
    .delete()
    .eq('policy_id', policyId)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function assignPolicy(assignment: Partial<PolicyAssignment>): Promise<ApiResponse<PolicyAssignment>> {
  const { data, error } = await supabase
    .from('policy_assignments')
    .insert(assignment)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}
