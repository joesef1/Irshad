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
      toast.success('Category deleted.')
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
      title={`Delete "${category.name}"?`}
      desc={
        <>
          You are about to permanently delete the category{' '}
          <strong>{category.name}</strong>. This action cannot be undone.
        </>
      }
      confirmText={mutation.isPending ? 'Deleting…' : 'Delete'}
    />
  )
}
