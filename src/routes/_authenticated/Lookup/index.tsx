import { createFileRoute } from '@tanstack/react-router'
import { Lookup } from '@/features/lookup'

export const Route = createFileRoute('/_authenticated/Lookup/')({
  component: Lookup,
})
