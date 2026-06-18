import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type TestQuestion } from '../data/schema'

type TestQuestionDialogType = 'create' | 'update' | 'delete'

type TestQuestionsContextType = {
  open: TestQuestionDialogType | null
  setOpen: (str: TestQuestionDialogType | null) => void
  currentRow: TestQuestion | null
  setCurrentRow: React.Dispatch<React.SetStateAction<TestQuestion | null>>
}

const TestQuestionsContext =
  React.createContext<TestQuestionsContextType | null>(null)

export function TestQuestionsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<TestQuestionDialogType>(null)
  const [currentRow, setCurrentRow] = useState<TestQuestion | null>(null)

  return (
    <TestQuestionsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TestQuestionsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTestQuestions() {
  const ctx = React.useContext(TestQuestionsContext)
  if (!ctx)
    throw new Error(
      'useTestQuestions must be used within <TestQuestionsProvider>'
    )
  return ctx
}
