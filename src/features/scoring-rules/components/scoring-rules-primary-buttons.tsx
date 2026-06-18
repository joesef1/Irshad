import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useScoringRules } from './scoring-rules-provider'

export function ScoringRulesPrimaryButtons() {
  const { setOpen } = useScoringRules()
  return (
    <Button className='space-x-1' onClick={() => setOpen('create')}>
      <span>Add Rule</span> <Plus size={18} />
    </Button>
  )
}
