import { api } from '@/lib/api'
import { type ScoringRule } from '../data/schema'

interface ApiResponse<T> {
  succeeded: boolean
  status: string
  message: string | null
  data: T | null
  error: unknown
}

export async function getAllScoringRulesForTest(
  testId: number
): Promise<ScoringRule[]> {
  const res = await api.get<ApiResponse<ScoringRule[]>>(
    '/api/ScoringRule/GetAllRuleForTest',
    { params: { testId } }
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch scoring rules')
  return res.data.data
}

export async function getScoringRuleById(id: number): Promise<ScoringRule> {
  const res = await api.get<ApiResponse<ScoringRule>>(
    '/api/ScoringRule/GetById',
    { params: { Id: id } }
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch scoring rule')
  return res.data.data
}

export interface CreateScoringRulePayload {
  psychologyTestId: number
  minScore: number
  maxScore: number
  reportDetails: string
}

export async function createScoringRule(
  payload: CreateScoringRulePayload
): Promise<void> {
  const res = await api.post<ApiResponse<unknown>>(
    '/api/ScoringRule/Create',
    payload
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to create scoring rule')
}

export interface UpdateScoringRulePayload {
  id: number
  minScore: number
  maxScore: number
  reportDetails: string
}

export async function updateScoringRule(
  payload: UpdateScoringRulePayload
): Promise<void> {
  const res = await api.put<ApiResponse<unknown>>(
    '/api/ScoringRule/Update',
    payload
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to update scoring rule')
}

export async function deleteScoringRule(id: number): Promise<void> {
  const res = await api.delete<ApiResponse<unknown>>(
    `/api/GeneratedTestReport/delete/${id}`
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to delete scoring rule')
}

export const scoringRulesQueryKey = (testId: number) =>
  ['scoring-rules', testId] as const
