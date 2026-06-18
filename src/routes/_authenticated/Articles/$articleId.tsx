import { createFileRoute } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ArticleDetails } from '@/features/articles/components/article-details'

export const Route = createFileRoute('/_authenticated/Articles/$articleId')({
  component: ArticleDetailsPage,
})

function ArticleDetailsPage() {
  const { articleId } = Route.useParams()
  const id = Number(articleId)

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Article Details</h2>
          <p className='text-muted-foreground'>
            View article content and manage its sections.
          </p>
        </div>
        <ArticleDetails articleId={id} />
      </Main>
    </>
  )
}
