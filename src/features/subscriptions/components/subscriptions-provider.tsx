import React from 'react'
import useDialogState from '@/hooks/use-dialog-state'

type SubscriptionDialogType = 'create'

type SubscriptionsContextType = {
  open: SubscriptionDialogType | null
  setOpen: (str: SubscriptionDialogType | null) => void
}

const SubscriptionsContext =
  React.createContext<SubscriptionsContextType | null>(null)

export function SubscriptionsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<SubscriptionDialogType>(null)
  return (
    <SubscriptionsContext value={{ open, setOpen }}>
      {children}
    </SubscriptionsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSubscriptions() {
  const ctx = React.useContext(SubscriptionsContext)
  if (!ctx)
    throw new Error(
      'useSubscriptions must be used within <SubscriptionsProvider>'
    )
  return ctx
}
