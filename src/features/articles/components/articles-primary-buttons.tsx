import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useArticles } from './articles-provider'

export function ArticlesPrimaryButtons() {
  const { setOpen } = useArticles()
  return (
    <Button className='space-x-1' onClick={() => setOpen('create')}>
      <span>إضافة مقالة</span> <Plus size={18} />
    </Button>
  )
}
