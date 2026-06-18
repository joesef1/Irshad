import { createFileRoute } from '@tanstack/react-router'
import { ArticleCategories } from '@/features/article-categories'

export const Route = createFileRoute('/_authenticated/ArticlesCategory/')({
  component: ArticleCategories,
})
