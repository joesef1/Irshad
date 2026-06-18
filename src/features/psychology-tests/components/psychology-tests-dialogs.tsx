import { PsychologyTestsDeleteDialog } from './psychology-tests-delete-dialog'
import { PsychologyTestsMutateDrawer } from './psychology-tests-mutate-drawer'
import { usePsychologyTests } from './psychology-tests-provider'

export function PsychologyTestsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePsychologyTests()

  const closeAndClear = () => {
    setOpen(null)
    setTimeout(() => setCurrentRow(null), 300)
  }

  return (
    <>
      <PsychologyTestsMutateDrawer
        key='psychology-test-create'
        open={open === 'create'}
        onOpenChange={() => setOpen(open === 'create' ? null : 'create')}
      />

      {currentRow && (
        <>
          <PsychologyTestsMutateDrawer
            key={`psychology-test-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={(v) => {
              if (!v) closeAndClear()
            }}
            currentRow={currentRow}
          />

          <PsychologyTestsDeleteDialog
            key={`psychology-test-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={(v) => {
              if (!v) closeAndClear()
            }}
            test={currentRow}
            onDeleted={closeAndClear}
          />
        </>
      )}
    </>
  )
}
