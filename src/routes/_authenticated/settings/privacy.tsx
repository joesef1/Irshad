import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPage } from '@/features/settings-pages/privacy'

export const Route = createFileRoute('/_authenticated/settings/privacy')({
  component: PrivacyPage,
})
