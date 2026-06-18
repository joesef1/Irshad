import { TestQuestionsDeleteDialog } from './test-questions-delete-dialog'
import { TestQuestionsMutateDrawer } from './test-questions-mutate-drawer'
import { useTestQuestions } from './test-questions-provider'

type Props = { testId: number }

export function TestQuestionsDialogs({ testId }: Props) {
  const { open, setOpen, currentRow, setCurrentRow } = useTestQuestions()

  const closeAndClear = () => {
    setOpen(null)
    setTimeout(() => setCurrentRow(null), 300)
  }

  return (
    <>
      <TestQuestionsMutateDrawer
        key='test-question-create'
        open={open === 'create'}
        onOpenChange={() => setOpen(open === 'create' ? null : 'create')}
        testId={testId}
      />

      {currentRow && (
        <>
          <TestQuestionsMutateDrawer
            key={`test-question-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={(v) => {
              if (!v) closeAndClear()
            }}
            testId={testId}
            currentRow={currentRow}
          />

          <TestQuestionsDeleteDialog
            key={`test-question-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={(v) => {
              if (!v) closeAndClear()
            }}
            question={currentRow}
            testId={testId}
            onDeleted={closeAndClear}
          />
        </>
      )}
    </>
  )
}
