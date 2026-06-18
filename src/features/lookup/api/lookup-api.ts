import { api } from '@/lib/api'

interface ApiResponse<T> {
  succeeded: boolean
  status: string
  message: string | null
  data: T | null
  error: unknown
}

export interface LookupItem {
  id: number
  name: string
  [key: string]: unknown
}

export interface StaticItem {
  id: number
  name: string
}

// ── Nationality ──────────────────────────────────────────────
export async function getAllNationalities(): Promise<LookupItem[]> {
  const res = await api.get<ApiResponse<LookupItem[]>>(
    '/api/Lookup/GetAllNationalities'
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch nationalities')
  return res.data.data
}

export async function addNationality(name: string): Promise<void> {
  const res = await api.post<ApiResponse<unknown>>(
    '/api/Lookup/AddNationality',
    { name }
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to add nationality')
}

// ── Specialization ───────────────────────────────────────────
export async function getAllSpecializations(): Promise<LookupItem[]> {
  const res = await api.get<ApiResponse<LookupItem[]>>(
    '/api/Lookup/GetAllSpecializations'
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch specializations')
  return res.data.data
}

export async function addSpecialization(name: string): Promise<void> {
  const res = await api.post<ApiResponse<unknown>>(
    '/api/Lookup/AddSpecialization',
    { name }
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to add specialization')
}

// ── Contact Time ─────────────────────────────────────────────
export async function getAllContactTimes(): Promise<LookupItem[]> {
  const res = await api.get<ApiResponse<LookupItem[]>>(
    '/api/Lookup/GetAllContactTimes'
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch contact times')
  return res.data.data
}

export async function addContactTime(name: string): Promise<void> {
  const res = await api.post<ApiResponse<unknown>>(
    '/api/Lookup/AddContactTime',
    { name }
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to add contact time')
}

// ── Static lists ─────────────────────────────────────────────
export async function getAllGenders(): Promise<StaticItem[]> {
  const res = await api.get<ApiResponse<StaticItem[]>>(
    '/api/Lookup/GetAllGender'
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch genders')
  return res.data.data
}

export async function getAllMaritalStatuses(): Promise<StaticItem[]> {
  const res = await api.get<ApiResponse<StaticItem[]>>(
    '/api/Lookup/GetAllMaritalStatus'
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch marital statuses')
  return res.data.data
}

export async function getAllAppointmentStatuses(): Promise<StaticItem[]> {
  const res = await api.get<ApiResponse<StaticItem[]>>(
    '/api/Lookup/GetAllAppointmentStatus'
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch appointment statuses')
  return res.data.data
}

export async function getDaysNames(): Promise<StaticItem[]> {
  const res = await api.get<ApiResponse<StaticItem[]>>(
    '/api/Lookup/GetDaysName'
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch days')
  return res.data.data
}

// ── Query keys ───────────────────────────────────────────────
export const nationalitiesQueryKey = ['lookup', 'nationalities'] as const
export const specializationsQueryKey = ['lookup', 'specializations'] as const
export const contactTimesQueryKey = ['lookup', 'contact-times'] as const
export const gendersQueryKey = ['lookup', 'genders'] as const
export const maritalStatusesQueryKey = ['lookup', 'marital-statuses'] as const
export const appointmentStatusesQueryKey = [
  'lookup',
  'appointment-statuses',
] as const
export const daysQueryKey = ['lookup', 'days'] as const
