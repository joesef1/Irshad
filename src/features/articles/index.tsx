import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getAllArticles, articlesQueryKey } from './api/articles-api'
import { ArticlesDialogs } from './components/articles-dialogs'
import { ArticlesPrimaryButtons } from './components/articles-primary-buttons'
import { ArticlesProvider } from './components/articles-provider'
import { ArticlesTable } from './components/articles-table'

export function Articles() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: articlesQueryKey,
    queryFn: getAllArticles,
  })

  return (
    <ArticlesProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>المقالات</h2>
            <p className='text-muted-foreground'>إدارة مقالاتك من هنا.</p>
          </div>
          <ArticlesPrimaryButtons />
        </div>

        {isLoading && (
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full rounded-md' />
            ))}
          </div>
        )}

        {isError && (
          <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-destructive dark:bg-red-950/20'>
            فشل تحميل المقالات:{' '}
            {error instanceof Error ? error.message : 'خطأ غير معروف'}
          </div>
        )}

        {data && <ArticlesTable data={data} />}
      </Main>

      <ArticlesDialogs />
    </ArticlesProvider>
  )
}
