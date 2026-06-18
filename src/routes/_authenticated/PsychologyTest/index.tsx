import { createFileRoute } from '@tanstack/react-router'
import { PsychologyTests } from '@/features/psychology-tests'

export const Route = createFileRoute('/_authenticated/PsychologyTest/')({
  component: PsychologyTests,
})
