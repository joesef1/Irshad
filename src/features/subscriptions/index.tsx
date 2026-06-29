import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  getAllSubscriptions,
  subscriptionsQueryKey,
} from './api/subscriptions-api'
import { SubscriptionsCreateDrawer } from './components/subscriptions-create-drawer'
import { SubscriptionsPrimaryButtons } from './components/subscriptions-primary-buttons'
import { SubscriptionsProvider } from './components/subscriptions-provider'
import { useSubscriptions } from './components/subscriptions-provider'
import { SubscriptionsTable } from './components/subscriptions-table'

function SubscriptionsContent() {
  const { open, setOpen } = useSubscriptions()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: subscriptionsQueryKey,
    queryFn: getAllSubscriptions,
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
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>خطط الاشتراك</h2>
            <p className='text-muted-foreground'>
              إدارة خطط الاشتراك والمزايا المرتبطة بها.
            </p>
          </div>
          <SubscriptionsPrimaryButtons />
        </div>

        {isLoading && (
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full rounded-md' />
            ))}
          </div>
        )}

        {isError && (
          <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-destructive dark:bg-red-950/20'>
            فشل تحميل الاشتراكات:{' '}
            {error instanceof Error ? error.message : 'خطأ غير معروف'}
          </div>
        )}

        {data && <SubscriptionsTable data={data} />}
      </Main>

      <SubscriptionsCreateDrawer
        key='subscription-create'
        open={open === 'create'}
        onOpenChange={() => setOpen(open === 'create' ? null : 'create')}
      />
    </>
  )
}

export function Subscriptions() {
  return (
    <SubscriptionsProvider>
      <SubscriptionsContent />
    </SubscriptionsProvider>
  )
}
