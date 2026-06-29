import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getAllConsultants, consultantsQueryKey } from './api/consultants-api'
import { ConsultantsTable } from './components/consultants-table'

export function Consultants() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: consultantsQueryKey,
    queryFn: getAllConsultants,
  })

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
          <h2 className='text-2xl font-bold tracking-tight'>المستشارون</h2>
          <p className='text-muted-foreground'>
            عرض وإدارة جميع المستشارين المسجلين.
          </p>
        </div>

        {isLoading && (
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full rounded-md' />
            ))}
          </div>
        )}

        {isError && (
          <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-destructive dark:bg-red-950/20'>
            فشل تحميل المستشارين:{' '}
            {error instanceof Error ? error.message : 'خطأ غير معروف'}
          </div>
        )}

        {data && <ConsultantsTable data={data} />}
      </Main>
    </>
  )
}
