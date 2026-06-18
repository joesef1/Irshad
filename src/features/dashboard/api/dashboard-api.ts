import { api } from '@/lib/api'

export interface RecentUser {
  id?: string
  name: string | null
  userName?: string | null
  fullName?: string | null
  email: string
  joinedAt?: string | null
  createdDate?: string | null
  [key: string]: unknown
}

export interface DashboardStats {
  totalUsers: number
  approvedConsultants: number
  pendingConsultants: number
  recentUsers?: RecentUser[]
  [key: string]: unknown
}

interface ApiResponse<T> {
  succeeded: boolean
  status: string
  message: string | null
  data: T | null
  error: unknown
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<ApiResponse<DashboardStats>>(
    '/api/AdminConsultant/GetDashboardStats'
  )
  const { succeeded, data, message } = response.data
  if (!succeeded || !data)
    throw new Error(message ?? 'Failed to fetch dashboard stats')
  return data
}

export const dashboardStatsQueryKey = ['dashboard', 'stats'] as const
