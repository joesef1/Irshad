import { api } from '@/lib/api'
import { type TestQuestion } from '../data/schema'

interface ApiResponse<T> {
  succeeded: boolean
  status: string
  message: string | null
  data: T | null
  error: unknown
}

export async function getAllTestQuestions(
  testId: number
): Promise<TestQuestion[]> {
  const res = await api.get<ApiResponse<TestQuestion[]>>(
    '/api/TestQuestionOption/GetAll',
    { params: { TestId: testId } }
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch test questions')
  return res.data.data
}

export interface CreateTestQuestionPayload {
  questionText: string
  psychologyTestId: number
  testSectionId: number
  options: { optionText: string; scoreValue: number }[]
}

export async function createTestQuestion(
  payload: CreateTestQuestionPayload
): Promise<void> {
  const res = await api.post<ApiResponse<unknown>>(
    '/api/TestQuestionOption/Create',
    payload
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to create test question')
}

export interface UpdateTestQuestionPayload {
  id: number
  questionText: string
  testSectionId: number
  options: {
    id: number
    optionText: string
    scoreValue: number
    testQuestionId: number
  }[]
}

export async function updateTestQuestion(
  payload: UpdateTestQuestionPayload
): Promise<void> {
  const res = await api.put<ApiResponse<unknown>>(
    '/api/TestQuestionOption/Update',
    payload
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to update test question')
}

export async function deleteTestQuestion(id: number): Promise<void> {
  const res = await api.delete<ApiResponse<unknown>>(
    `/api/TestQuestionOption/delete/${id}`
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to delete test question')
}

export const testQuestionsQueryKey = (testId: number) =>
  ['test-questions', testId] as const
