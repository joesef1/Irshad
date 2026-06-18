import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type PsychologyTest } from '../data/schema'

type PsychologyTestDialogType = 'create' | 'update' | 'delete'

type PsychologyTestsContextType = {
  open: PsychologyTestDialogType | null
  setOpen: (str: PsychologyTestDialogType | null) => void
  currentRow: PsychologyTest | null
  setCurrentRow: React.Dispatch<React.SetStateAction<PsychologyTest | null>>
}

const PsychologyTestsContext =
  React.createContext<PsychologyTestsContextType | null>(null)

export function PsychologyTestsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<PsychologyTestDialogType>(null)
  const [currentRow, setCurrentRow] = useState<PsychologyTest | null>(null)

  return (
    <PsychologyTestsContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </PsychologyTestsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePsychologyTests() {
  const ctx = React.useContext(PsychologyTestsContext)
  if (!ctx)
    throw new Error(
      'usePsychologyTests must be used within <PsychologyTestsProvider>'
    )
  return ctx
}
