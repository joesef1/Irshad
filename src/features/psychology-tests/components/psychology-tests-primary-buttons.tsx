import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePsychologyTests } from './psychology-tests-provider'

export function PsychologyTestsPrimaryButtons() {
  const { setOpen } = usePsychologyTests()
  return (
    <Button className='space-x-1' onClick={() => setOpen('create')}>
      <span>إضافة اختبار</span> <Plus size={18} />
    </Button>
  )
}
