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
      toast.success('Psychology test deleted.')
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
      title={`Delete "${test.title}"?`}
      desc={
        <>
          You are about to permanently delete the psychology test{' '}
          <strong>{test.title}</strong>. This action cannot be undone.
        </>
      }
      confirmText={mutation.isPending ? 'Deleting…' : 'Delete'}
    />
  )
}
