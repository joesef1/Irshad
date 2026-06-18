import { createFileRoute } from '@tanstack/react-router'
import { FaqsPage } from '@/features/settings-pages/faqs'

export const Route = createFileRoute('/_authenticated/settings/faqs')({
  component: FaqsPage,
})
