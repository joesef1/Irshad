import { createFileRoute } from '@tanstack/react-router'
import { TestQuestions } from '@/features/test-questions'

export const Route = createFileRoute(
  '/_authenticated/PsychologyTest/$testId/questions'
)({
  component: QuestionsPage,
})

function QuestionsPage() {
  const { testId } = Route.useParams()
  return <TestQuestions testId={Number(testId)} />
}
