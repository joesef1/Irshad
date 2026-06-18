import { createFileRoute } from '@tanstack/react-router'
import { SupportPage } from '@/features/settings-pages/support'

export const Route = createFileRoute('/_authenticated/settings/support')({
  component: SupportPage,
})
