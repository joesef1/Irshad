import { createFileRoute } from '@tanstack/react-router'
import { Consultants } from '@/features/consultants'

export const Route = createFileRoute('/_authenticated/Consultant/')({
  component: Consultants,
})
