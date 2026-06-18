import { ScoringRulesDeleteDialog } from './scoring-rules-delete-dialog'
import { ScoringRulesMutateDrawer } from './scoring-rules-mutate-drawer'
import { useScoringRules } from './scoring-rules-provider'

type Props = { testId: number }

export function ScoringRulesDialogs({ testId }: Props) {
  const { open, setOpen, currentRow, setCurrentRow } = useScoringRules()

  const closeAndClear = () => {
    setOpen(null)
    setTimeout(() => setCurrentRow(null), 300)
  }

  return (
    <>
      <ScoringRulesMutateDrawer
        key='scoring-rule-create'
        open={open === 'create'}
        onOpenChange={() => setOpen(open === 'create' ? null : 'create')}
        testId={testId}
      />

      {currentRow && (
        <>
          <ScoringRulesMutateDrawer
            key={`scoring-rule-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={(v) => {
              if (!v) closeAndClear()
            }}
            testId={testId}
            currentRow={currentRow}
          />

          <ScoringRulesDeleteDialog
            key={`scoring-rule-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={(v) => {
              if (!v) closeAndClear()
            }}
            rule={currentRow}
            testId={testId}
            onDeleted={closeAndClear}
          />
        </>
      )}
    </>
  )
}
