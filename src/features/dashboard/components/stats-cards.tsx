import { UserCheck, UserX, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type DashboardStats } from '../api/dashboard-api'

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: number | undefined
  icon: React.ElementType
}) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {value !== undefined ? value.toLocaleString() : '—'}
        </div>
      </CardContent>
    </Card>
  )
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-4 w-4 rounded' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-8 w-16' />
      </CardContent>
    </Card>
  )
}

export function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className='grid gap-4 sm:grid-cols-3'>
      <StatCard title='عدد المستخدمين' value={stats.totalUsers} icon={Users} />
      <StatCard
        title='المستشارين (تمت الموافقة)'
        value={stats.approvedConsultants}
        icon={UserCheck}
      />
      <StatCard
        title='المستشارين (بانتظار الموافقة)'
        value={stats.pendingConsultants}
        icon={UserX}
      />
    </div>
  )
}
