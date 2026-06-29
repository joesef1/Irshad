import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { articlesQueryKey, deleteArticle } from '../api/articles-api'
import { type Article } from '../data/schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  article: Article
  onDeleted: () => void
}

export function ArticlesDeleteDialog({
  open,
  onOpenChange,
  article,
  onDeleted,
}: Props) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => deleteArticle(article.id),
    onSuccess: () => {
      toast.success('تم حذف المقالة.')
      queryClient.invalidateQueries({ queryKey: articlesQueryKey })
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
      title={`حذف "${article.title}"؟`}
      desc={
        <>
          أنت على وشك حذف <strong>{article.title}</strong> بشكل نهائي. لا يمكن
          التراجع عن هذا الإجراء.
        </>
      }
      confirmText={mutation.isPending ? 'جارٍ الحذف…' : 'حذف'}
    />
  )
}
