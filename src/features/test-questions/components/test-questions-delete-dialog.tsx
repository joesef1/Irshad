import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import {
  deleteTestQuestion,
  testQuestionsQueryKey,
} from '../api/test-questions-api'
import { type TestQuestion } from '../data/schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  question: TestQuestion
  testId: number
  onDeleted: () => void
}

export function TestQuestionsDeleteDialog({
  open,
  onOpenChange,
  question,
  testId,
  onDeleted,
}: Props) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => deleteTestQuestion(question.id),
    onSuccess: () => {
      toast.success('تم حذف السؤال.')
      queryClient.invalidateQueries({ queryKey: testQuestionsQueryKey(testId) })
      onOpenChange(false)
      onDeleted()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <ConfirmDialog
      destructive
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={() => mutation.mutate()}
      className='max-w-md'
      title='حذف هذا السؤال؟'
      desc={
        <>
          أنت على وشك حذف السؤال:{' '}
          <strong>&quot;{question.questionText}&quot;</strong> بشكل نهائي. لا
          يمكن التراجع عن هذا الإجراء.
        </>
      }
      confirmText={mutation.isPending ? 'جارٍ الحذف…' : 'حذف'}
    />
  )
}
