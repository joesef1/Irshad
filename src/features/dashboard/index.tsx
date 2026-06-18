import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { dashboardStatsQueryKey, getDashboardStats } from './api/dashboard-api'
import { StatCardSkeleton, StatsCards } from './components/stats-cards'

export function Dashboard() {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: dashboardStatsQueryKey,
    queryFn: getDashboardStats,
  })

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-col gap-6'>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>

        {/* ── Stats row ── */}
        {isLoading ? (
          <div className='grid gap-4 sm:grid-cols-3'>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : isError || !stats ? (
          <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-destructive dark:bg-red-950/20'>
            Failed to load dashboard statistics.
          </div>
        ) : (
          <StatsCards stats={stats} />
        )}

        {/* ── Recent users table ── */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>أحدث المنضمّين</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='flex flex-col gap-3'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className='h-10 w-full rounded' />
                ))}
              </div>
            ) : isError || !stats ? null : !stats.recentUsers?.length ? (
              <p className='text-sm text-muted-foreground'>No recent users.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>البريد</TableHead>
                    <TableHead>تاريخ الانضمام</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentUsers.map((user, index) => {
                    const displayName =
                      user.name ?? user.fullName ?? user.userName ?? '—'
                    const displayDate =
                      user.joinedAt ?? user.createdDate ?? null
                    // use id when available, fall back to email, then index
                    const rowKey = user.id ?? user.email ?? index

                    return (
                      <TableRow key={rowKey}>
                        <TableCell className='font-medium'>
                          {displayName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className='text-muted-foreground'>
                          {displayDate
                            ? new Date(displayDate).toLocaleString()
                            : '—'}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
