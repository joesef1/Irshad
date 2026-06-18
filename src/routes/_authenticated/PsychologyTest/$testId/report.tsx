import { createFileRoute } from '@tanstack/react-router'
import { ScoringRules } from '@/features/scoring-rules'

export const Route = createFileRoute(
  '/_authenticated/PsychologyTest/$testId/report'
)({
  component: ReportPage,
})

function ReportPage() {
  const { testId } = Route.useParams()
  return <ScoringRules testId={Number(testId)} />
}
