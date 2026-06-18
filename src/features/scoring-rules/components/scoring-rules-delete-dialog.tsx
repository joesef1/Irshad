import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import {
  deleteScoringRule,
  scoringRulesQueryKey,
} from '../api/scoring-rules-api'
import { type ScoringRule } from '../data/schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule: ScoringRule
  testId: number
  onDeleted: () => void
}

export function ScoringRulesDeleteDialog({
  open,
  onOpenChange,
  rule,
  testId,
  onDeleted,
}: Props) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => deleteScoringRule(rule.id),
    onSuccess: () => {
      toast.success('Scoring rule deleted.')
      queryClient.invalidateQueries({ queryKey: scoringRulesQueryKey(testId) })
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
      title={`Delete scoring rule #${rule.id}?`}
      desc={
        <>
          You are about to permanently delete the scoring rule with score range{' '}
          <strong>
            {rule.minScore}–{rule.maxScore}
          </strong>
          . This action cannot be undone.
        </>
      }
      confirmText={mutation.isPending ? 'Deleting…' : 'Delete'}
    />
  )
}
