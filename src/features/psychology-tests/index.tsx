import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  getAllPsychologyTests,
  psychologyTestsQueryKey,
} from './api/psychology-tests-api'
import { PsychologyTestsDialogs } from './components/psychology-tests-dialogs'
import { PsychologyTestsPrimaryButtons } from './components/psychology-tests-primary-buttons'
import { PsychologyTestsProvider } from './components/psychology-tests-provider'
import { PsychologyTestsTable } from './components/psychology-tests-table'

export function PsychologyTests() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: psychologyTestsQueryKey,
    queryFn: getAllPsychologyTests,
  })

  return (
    <PsychologyTestsProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              الاختبارات النفسية
            </h2>
            <p className='text-muted-foreground'>
              إدارة الاختبارات النفسية من هنا.
            </p>
          </div>
          <PsychologyTestsPrimaryButtons />
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
            فشل تحميل الاختبارات النفسية:{' '}
            {error instanceof Error ? error.message : 'خطأ غير معروف'}
          </div>
        )}

        {data && <PsychologyTestsTable data={data} />}
      </Main>

      <PsychologyTestsDialogs />
    </PsychologyTestsProvider>
  )
}
