import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Subscription } from '../data/schema'

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
      <DataTableColumnHeader column={column} title='Plan Name' />
    ),
    cell: ({ row }) => (
      <span className='font-medium'>{row.getValue('name')}</span>
    ),
  },
  {
    accessorKey: 'durationInDays',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Duration' />
    ),
    cell: ({ row }) => {
      const days = row.getValue<number | null>('durationInDays')
      return (
        <span className='text-muted-foreground'>
          {days != null ? `${days} days` : '—'}
        </span>
      )
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
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
    accessorKey: 'benefits',
    header: () => <span className='text-xs font-medium'>Benefits</span>,
    cell: ({ row }) => {
      const benefits = row.original.benefits
      if (!benefits?.length)
        return <span className='text-muted-foreground'>—</span>
      return (
        <div className='flex flex-wrap gap-1'>
          {benefits.slice(0, 3).map((b, i) => (
            <Badge key={b.id ?? i} variant='secondary' className='text-xs'>
              {b.description}
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
