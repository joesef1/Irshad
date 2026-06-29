import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCategories } from './categories-provider'

export function CategoriesPrimaryButtons() {
  const { setOpen } = useCategories()
  return (
    <Button className='space-x-1' onClick={() => setOpen('create')}>
      <span>إضافة تصنيف</span> <Plus size={18} />
    </Button>
  )
}
