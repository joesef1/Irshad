import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Category } from '../data/schema'

type CategoryDialogType = 'create' | 'update' | 'delete'

type CategoriesContextType = {
  open: CategoryDialogType | null
  setOpen: (str: CategoryDialogType | null) => void
  currentRow: Category | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Category | null>>
}

const CategoriesContext = React.createContext<CategoriesContextType | null>(
  null
)

export function CategoriesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<CategoryDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Category | null>(null)

  return (
    <CategoriesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CategoriesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCategories() {
  const ctx = React.useContext(CategoriesContext)
  if (!ctx)
    throw new Error('useCategories must be used within <CategoriesProvider>')
  return ctx
}
