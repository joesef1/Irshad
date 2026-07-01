import { api } from '@/lib/api'
import { type Article, type ArticleDetails } from '../data/schema'

interface ApiResponse<T> {
  succeeded: boolean
  status: string
  message: string | null
  data: T | null
  error: unknown
}

export async function getAllArticles(): Promise<Article[]> {
  const res = await api.get<ApiResponse<Article[]>>('/api/Articles/GetArticles')
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to fetch articles')
  return res.data.data
}

export async function getArticleDetails(id: number): Promise<ArticleDetails> {
  const res = await api.get<ApiResponse<ArticleDetails>>(
    `/api/Articles/GetArticleDetails/${id}`
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Article not found')
  return res.data.data
}

export async function addArticle(formData: FormData): Promise<void> {
  const res = await api.post<ApiResponse<unknown>>(
    '/api/Articles/AddArticle',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to add article')
}

export async function updateArticle(
  id: number,
  formData: FormData
): Promise<void> {
  const res = await api.put<ApiResponse<unknown>>(
    `/api/Articles/UpdateArticle/${id}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to update article')
}

export async function deleteArticle(id: number): Promise<void> {
  const res = await api.delete<ApiResponse<unknown>>(
    `/api/Articles/DeleteArticle/${id}`
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to delete article')
}

export async function addSection(
  articleId: number,
  title: string,
  content: string
): Promise<void> {
  const res = await api.post<ApiResponse<unknown>>('/api/Articles/AddSection', {
    articleId,
    title,
    content,
  })
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to add section')
}

export async function deleteArticleSections(articleId: number): Promise<void> {
  const res = await api.delete<ApiResponse<unknown>>(
    `/api/Articles/DeleteArticleSections/${articleId}`
  )
  if (!res.data.succeeded)
    throw new Error(res.data.message ?? 'Failed to delete sections')
}

export interface UploadUserFilesResponse {
  identityFileUrl: string | null
  qualificationFileUrl: string | null
  addressFileUrl: string | null
  personalFileUrl: string | null
}

export async function uploadUserFile(
  userId: string,
  file: File
): Promise<UploadUserFilesResponse> {
  const fd = new FormData()
  fd.append('IdentityFile', file)
  const res = await api.post<ApiResponse<UploadUserFilesResponse>>(
    `/api/Auth/UploadOrUpdateUserFilesAsync/${userId}`,
    fd,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  if (!res.data.succeeded || !res.data.data)
    throw new Error(res.data.message ?? 'Failed to upload file')
  return res.data.data
}

export const articlesQueryKey = ['articles'] as const
export const articleDetailsQueryKey = (id: number) =>
  ['article-details', id] as const
