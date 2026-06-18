import { createFileRoute } from '@tanstack/react-router'
import { Articles } from '@/features/articles'

export const Route = createFileRoute('/_authenticated/Articles/')({
  component: Articles,
})
