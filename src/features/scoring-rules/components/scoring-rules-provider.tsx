import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type ScoringRule } from '../data/schema'

type ScoringRuleDialogType = 'create' | 'update' | 'delete'

type ScoringRulesContextType = {
  open: ScoringRuleDialogType | null
  setOpen: (str: ScoringRuleDialogType | null) => void
  currentRow: ScoringRule | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ScoringRule | null>>
}

const ScoringRulesContext = React.createContext<ScoringRulesContextType | null>(
  null
)

export function ScoringRulesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<ScoringRuleDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ScoringRule | null>(null)

  return (
    <ScoringRulesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ScoringRulesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useScoringRules() {
  const ctx = React.useContext(ScoringRulesContext)
  if (!ctx)
    throw new Error(
      'useScoringRules must be used within <ScoringRulesProvider>'
    )
  return ctx
}
