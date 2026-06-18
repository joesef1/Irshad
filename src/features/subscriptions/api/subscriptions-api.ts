import { api } from '@/lib/api'
import { type Subscription } from '../data/schema'

interface ApiResponse<T> {
  succeeded: boolean
  status: string
  message: string | null
  data: T | null
  error: unknown
}

export interface AddSubscriptionPayload {
  name: string
  durationInDays: number
  price: number
  benefits: string[]
}

export async function getAllSubscriptions(): Promise<Subscription[]> {
  const res = await api.get<ApiResponse<Subscription[]>>(
    '/api/Subscription/GetAllSubscriptionsWithBenefits'
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch subscriptions')
  return res.data.data
}

export async function addSubscription(
  payload: AddSubscriptionPayload
): Promise<void> {
  const res = await api.post<ApiResponse<unknown>>(
    '/api/Subscription/AddSubscriptionWithBenefits',
    payload
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to add subscription')
}

export const subscriptionsQueryKey = ['subscriptions'] as const
