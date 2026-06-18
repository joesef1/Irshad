import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://api.ershad-ai.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token from auth store on every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().auth.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
