import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useArticles } from './articles-provider'

export function ArticlesPrimaryButtons() {
  const { setOpen } = useArticles()
  return (
    <Button className='space-x-1' onClick={() => setOpen('create')}>
      <span>Add Article</span> <Plus size={18} />
    </Button>
  )
}
