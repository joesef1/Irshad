import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTestQuestions } from './test-questions-provider'

export function TestQuestionsPrimaryButtons() {
  const { setOpen } = useTestQuestions()
  return (
    <Button className='space-x-1' onClick={() => setOpen('create')}>
      <span>Add Question</span> <Plus size={18} />
    </Button>
  )
}
