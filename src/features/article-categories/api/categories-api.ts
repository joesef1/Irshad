import { api } from '@/lib/api'
import { type Category } from '../data/schema'

interface ApiResponse<T> {
  succeeded: boolean
  status: string
  message: string | null
  data: T | null
  error: unknown
}

export async function getAllCategories(): Promise<Category[]> {
  const res = await api.get<ApiResponse<Category[]>>(
    '/api/Articles/GetAllCategories'
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch categories')
  return res.data.data
}

export async function addCategory(name: string): Promise<void> {
  const res = await api.post<ApiResponse<unknown>>(
    '/api/Articles/AddCategory',
    null,
    {
      params: { CategoryName: name },
    }
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to add category')
}

export async function updateCategory(id: number, name: string): Promise<void> {
  const res = await api.patch<ApiResponse<unknown>>(
    `/api/Articles/UpdateCategory/${id}`,
    null,
    { params: { CategoryName: name } }
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to update category')
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await api.delete<ApiResponse<unknown>>(
    `/api/Articles/DeleteCategory/${id}`
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to delete category')
}

export const categoriesQueryKey = ['article-categories'] as const
