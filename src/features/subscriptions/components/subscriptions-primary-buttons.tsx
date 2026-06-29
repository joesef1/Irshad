import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSubscriptions } from './subscriptions-provider'

export function SubscriptionsPrimaryButtons() {
  const { setOpen } = useSubscriptions()
  return (
    <Button className='space-x-1' onClick={() => setOpen('create')}>
      <span>إضافة خطة</span> <Plus size={18} />
    </Button>
  )
}
