import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Subscription } from '../data/schema'

/** Extract a display string from whatever shape the benefit arrives in */
function benefitLabel(b: unknown): string {
  if (typeof b === 'string') return b
  if (b && typeof b === 'object') {
    const obj = b as Record<string, unknown>
    return (
      (obj.description as string) ??
      (obj.benefit as string) ??
      (obj.name as string) ??
      JSON.stringify(b)
    )
  }
  return String(b)
}

export const subscriptionsColumns: ColumnDef<Subscription>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='#' />,
    cell: ({ row }) => <div className='w-12'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='اسم الخطة' />
    ),
    cell: ({ row }) => (
      <span className='font-medium'>{row.getValue('name')}</span>
    ),
  },
  {
    id: 'duration',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='المدة' />
    ),
    cell: ({ row }) => {
      // Accept both field name variants
      const days =
        (row.original.durationInDays as number | null | undefined) ??
        (row.original.duration as number | null | undefined)
      return (
        <span className='text-muted-foreground'>
          {days != null ? `${days} يوم` : '—'}
        </span>
      )
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='السعر' />
    ),
    cell: ({ row }) => {
      const price = row.getValue<number | null>('price')
      return (
        <span className='text-muted-foreground'>
          {price != null ? `$${price}` : '—'}
        </span>
      )
    },
  },
  {
    id: 'benefits',
    header: () => <span className='text-xs font-medium'>المزايا</span>,
    cell: ({ row }) => {
      const benefits = row.original.benefits as unknown[] | null | undefined
      if (!benefits?.length)
        return <span className='text-muted-foreground'>—</span>
      return (
        <div className='flex flex-wrap gap-1'>
          {benefits.slice(0, 3).map((b, i) => (
            <Badge key={i} variant='secondary' className='text-xs'>
              {benefitLabel(b)}
            </Badge>
          ))}
          {benefits.length > 3 && (
            <Badge variant='outline' className='text-xs'>
              +{benefits.length - 3}
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
]
