import { createFileRoute } from '@tanstack/react-router'
import { RegisterAdmin } from '@/features/register-admin'

export const Route = createFileRoute('/_authenticated/off-register/')({
  component: RegisterAdmin,
})
