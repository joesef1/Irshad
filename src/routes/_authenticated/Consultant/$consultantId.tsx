import { createFileRoute } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConsultantDetails } from '@/features/consultants/components/consultant-details'

export const Route = createFileRoute(
  '/_authenticated/Consultant/$consultantId'
)({
  component: ConsultantDetailPage,
})

function ConsultantDetailPage() {
  const { consultantId } = Route.useParams()

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
          <h2 className='text-2xl font-bold tracking-tight'>
            Consultant Details
          </h2>
          <p className='text-muted-foreground'>
            View profile, documents, and manage consultant status.
          </p>
        </div>
        <ConsultantDetails consultantId={consultantId} />
      </Main>
    </>
  )
}
