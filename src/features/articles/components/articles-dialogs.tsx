import { ArticlesDeleteDialog } from './articles-delete-dialog'
import { ArticlesMutateDrawer } from './articles-mutate-drawer'
import { useArticles } from './articles-provider'

export function ArticlesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useArticles()

  const closeAndClear = () => {
    setOpen(null)
    setTimeout(() => setCurrentRow(null), 300)
  }

  return (
    <>
      <ArticlesMutateDrawer
        key='article-create'
        open={open === 'create'}
        onOpenChange={() => setOpen(open === 'create' ? null : 'create')}
      />

      {currentRow && (
        <>
          <ArticlesMutateDrawer
            key={`article-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={(v) => {
              if (!v) closeAndClear()
            }}
            currentRow={currentRow}
          />
          <ArticlesDeleteDialog
            key={`article-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={(v) => {
              if (!v) closeAndClear()
            }}
            article={currentRow}
            onDeleted={closeAndClear}
          />
        </>
      )}
    </>
  )
}
