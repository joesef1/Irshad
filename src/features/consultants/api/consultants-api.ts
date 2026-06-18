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
  if (!succeeded || !data)
    throw new Error(message ?? 'Failed to fetch consultants')
  return data
}

export async function getConsultantById(id: string): Promise<Consultant> {
  const response = await api.get<ApiResponse<Consultant>>(
    `/api/Auth/GetConsultant/${id}`
  )
  const { succeeded, data, message } = response.data
  if (!succeeded || !data) throw new Error(message ?? 'Consultant not found')
  return data
}

export async function approveConsultant(id: string): Promise<void> {
  const response = await api.post<ApiResponse<null>>(
    `/api/AdminConsultant/Approve/${id}`
  )
  if (!response.data.succeeded) {
    throw new Error(response.data.message ?? 'Failed to update approval status')
  }
}

export async function blockConsultant(id: string): Promise<void> {
  const response = await api.post<ApiResponse<null>>(
    `/api/AdminConsultant/Block/${id}`
  )
  if (!response.data.succeeded) {
    throw new Error(response.data.message ?? 'Failed to update block status')
  }
}

export async function deleteConsultant(id: string): Promise<void> {
  const response = await api.delete<ApiResponse<null>>(
    `/api/AdminConsultant/Delete/${id}`
  )
  if (!response.data.succeeded) {
    throw new Error(response.data.message ?? 'Failed to delete consultant')
  }
}

export const consultantsQueryKey = ['consultants'] as const
export const consultantDetailQueryKey = (id: string) =>
  ['consultant', id] as const
