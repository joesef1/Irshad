import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { categoriesQueryKey, deleteCategory } from '../api/categories-api'
import { type Category } from '../data/schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category
  onDeleted: () => void
}

export function CategoriesDeleteDialog({
  open,
  onOpenChange,
  category,
  onDeleted,
}: Props) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => deleteCategory(category.id),
    onSuccess: () => {
      toast.success('تم حذف التصنيف.')
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey })
      onOpenChange(false)
      onDeleted()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <ConfirmDialog
      destructive
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={() => mutation.mutate()}
      className='max-w-md'
      title={`حذف "${category.name}"؟`}
      desc={
        <>
          أنت على وشك حذف التصنيف <strong>{category.name}</strong> بشكل نهائي.
          لا يمكن التراجع عن هذا الإجراء.
        </>
      }
      confirmText={mutation.isPending ? 'جارٍ الحذف…' : 'حذف'}
    />
  )
}
