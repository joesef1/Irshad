import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type StaticItem } from '../api/lookup-api'

type Props = {
  title: string
  queryKey: readonly string[]
  fetchFn: () => Promise<StaticItem[]>
}

export function LookupStaticList({ title, queryKey, fetchFn }: Props) {
  const { data, isLoading, isError } = useQuery({ queryKey, queryFn: fetchFn })

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className='flex flex-col gap-2'>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className='h-7 w-full rounded' />
            ))}
          </div>
        )}
        {isError && (
          <p className='text-sm text-destructive'>فشل تحميل {title}.</p>
        )}
        {data && (
          <div className='flex flex-wrap gap-2'>
            {data.map((item) => (
              <Badge
                key={item.id}
                variant='outline'
                className='gap-1.5 px-3 py-1 text-sm'
              >
                <span className='text-muted-foreground'>{item.id}.</span>{' '}
                {item.name}
              </Badge>
            ))}
            {data.length === 0 && (
              <p className='text-sm text-muted-foreground'>لا توجد بيانات.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
