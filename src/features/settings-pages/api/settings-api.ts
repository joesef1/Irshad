import { api } from '@/lib/api'

interface ApiResponse<T> {
  succeeded: boolean
  status: string
  message: string | null
  data: T | null
  error: unknown
}

// ── FAQ ───────────────────────────────────────────────────────

export interface Faq {
  id: number
  question: string
  answer: string
}

export async function getAllFaqs(): Promise<Faq[]> {
  const res = await api.get<ApiResponse<Faq[]>>('/api/Settings/GetAllFAQs')
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch FAQs')
  return res.data.data
}

export async function getFaqById(id: number): Promise<Faq> {
  const res = await api.get<ApiResponse<Faq>>(`/api/Settings/GetFAQ/${id}`)
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'FAQ not found')
  return res.data.data
}

export async function addFaq(question: string, answer: string): Promise<void> {
  const res = await api.post<ApiResponse<unknown>>('/api/Settings/AddFAQ', {
    question,
    answer,
  })
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to add FAQ')
}

export async function updateFaq(
  id: number,
  question: string,
  answer: string
): Promise<void> {
  const res = await api.put<ApiResponse<unknown>>(
    `/api/Settings/UpdateFAQ/${id}`,
    {
      question,
      answer,
    }
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to update FAQ')
}

export async function deleteFaq(id: number): Promise<void> {
  const res = await api.delete<ApiResponse<unknown>>(
    `/api/Settings/DeleteFAQ/${id}`
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to delete FAQ')
}

// ── Technical Support ─────────────────────────────────────────

export interface TechnicalSupport {
  id?: number
  emailAddress?: string | null
  phoneNumber?: string | null
  [key: string]: unknown
}

export async function getTechnicalSupport(): Promise<TechnicalSupport> {
  const res = await api.get<ApiResponse<TechnicalSupport>>(
    '/api/Settings/GetTechnicalSupport'
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch support info')
  return res.data.data
}

export async function updateTechnicalSupport(
  payload: TechnicalSupport
): Promise<void> {
  const res = await api.put<ApiResponse<unknown>>(
    '/api/Settings/UpdateTechnicalSupport',
    payload
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to update support info')
}

// ── Security & Privacy ────────────────────────────────────────

export interface SecurityPrivacy {
  id?: number
  content: string
  [key: string]: unknown
}

export async function getSecurityAndPrivacy(): Promise<SecurityPrivacy> {
  const res = await api.get<ApiResponse<SecurityPrivacy>>(
    '/api/Settings/GetSecurityAndPrivacy'
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch privacy policy')
  return res.data.data
}

export async function updateSecurityAndPrivacy(content: string): Promise<void> {
  const res = await api.put<ApiResponse<unknown>>(
    '/api/Settings/UpdateSecurityAndPrivacy',
    { content }
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to update privacy policy')
}

// ── Query keys ────────────────────────────────────────────────

export const faqsQueryKey = ['settings', 'faqs'] as const
export const technicalSupportQueryKey = ['settings', 'support'] as const
export const privacyQueryKey = ['settings', 'privacy'] as const
