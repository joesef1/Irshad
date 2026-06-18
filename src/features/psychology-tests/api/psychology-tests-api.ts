import { api } from '@/lib/api'
import { type PsychologyTest } from '../data/schema'

interface ApiResponse<T> {
  succeeded: boolean
  status: string
  message: string | null
  data: T | null
  error: unknown
}

export async function getAllPsychologyTests(): Promise<PsychologyTest[]> {
  const res = await api.get<ApiResponse<PsychologyTest[]>>(
    '/api/PsychologyTest/GetAll'
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch psychology tests')
  return res.data.data
}

export interface CreatePsychologyTestPayload {
  Title: string
  Description: string
  IsFree: boolean
  ReportRequiresPurchase: boolean
  Price?: number | null
  URLImage?: File | null
}

export async function createPsychologyTest(
  payload: CreatePsychologyTestPayload
): Promise<void> {
  const form = new FormData()
  form.append('Title', payload.Title)
  form.append('Description', payload.Description)
  form.append('IsFree', String(payload.IsFree))
  form.append('ReportRequiresPurchase', String(payload.ReportRequiresPurchase))
  if (payload.Price != null) form.append('Price', String(payload.Price))
  if (payload.URLImage) form.append('URLImage', payload.URLImage)

  const res = await api.post<ApiResponse<unknown>>(
    '/api/PsychologyTest/Create',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to create psychology test')
}

export interface UpdatePsychologyTestPayload {
  Id: number
  Title: string
  Description: string
  IsFree: boolean
  ReportRequiresPurchase: boolean
  Price?: number | null
  URLImage?: File | null
}

export async function updatePsychologyTest(
  payload: UpdatePsychologyTestPayload
): Promise<void> {
  const form = new FormData()
  form.append('Id', String(payload.Id))
  form.append('Title', payload.Title)
  form.append('Description', payload.Description)
  form.append('IsFree', String(payload.IsFree))
  form.append('ReportRequiresPurchase', String(payload.ReportRequiresPurchase))
  if (payload.Price != null) form.append('Price', String(payload.Price))
  if (payload.URLImage) form.append('URLImage', payload.URLImage)

  const res = await api.put<ApiResponse<unknown>>(
    '/api/PsychologyTest/Update',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to update psychology test')
}

export async function deletePsychologyTest(id: number): Promise<void> {
  const res = await api.delete<ApiResponse<unknown>>(
    `/api/PsychologyTest/delete/${id}`
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to delete psychology test')
}

export const psychologyTestsQueryKey = ['psychology-tests'] as const
