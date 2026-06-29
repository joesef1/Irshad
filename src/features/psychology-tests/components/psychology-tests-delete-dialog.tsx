import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import {
  deletePsychologyTest,
  psychologyTestsQueryKey,
} from '../api/psychology-tests-api'
import { type PsychologyTest } from '../data/schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  test: PsychologyTest
  onDeleted: () => void
}

export function PsychologyTestsDeleteDialog({
  open,
  onOpenChange,
  test,
  onDeleted,
}: Props) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => deletePsychologyTest(test.id),
    onSuccess: () => {
      toast.success('تم حذف الاختبار النفسي.')
      queryClient.invalidateQueries({ queryKey: psychologyTestsQueryKey })
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
      title={`حذف "${test.title}"؟`}
      desc={
        <>
          أنت على وشك حذف الاختبار النفسي <strong>{test.title}</strong> بشكل
          نهائي. لا يمكن التراجع عن هذا الإجراء.
        </>
      }
      confirmText={mutation.isPending ? 'جارٍ الحذف…' : 'حذف'}
    />
  )
}
