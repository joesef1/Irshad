import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Article } from '../data/schema'

type ArticleDialogType = 'create' | 'update' | 'delete'

type ArticlesContextType = {
  open: ArticleDialogType | null
  setOpen: (str: ArticleDialogType | null) => void
  currentRow: Article | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Article | null>>
}

const ArticlesContext = React.createContext<ArticlesContextType | null>(null)

export function ArticlesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ArticleDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Article | null>(null)
  return (
    <ArticlesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ArticlesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useArticles() {
  const ctx = React.useContext(ArticlesContext)
  if (!ctx)
    throw new Error('useArticles must be used within <ArticlesProvider>')
  return ctx
}
