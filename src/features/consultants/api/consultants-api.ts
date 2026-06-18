import { api } from '@/lib/api'
import { type Consultant } from '../data/schema'

interface ApiResponse<T> {
  succeeded: boolean
  status: string
  message: string | null
  data: T | null
  error: unknown
}

export async function getAllConsultants(): Promise<Consultant[]> {
  const response = await api.get<ApiResponse<Consultant[]>>(
    '/api/Auth/GetAllConsultant'
  )
  const { succeeded, data, message } = response.data

  if (!succeeded || !data) {
    throw new Error(message ?? 'Failed to fetch consultants')
  }

  return data
}

export const consultantsQueryKey = ['consultants'] as const
