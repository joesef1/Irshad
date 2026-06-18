import { type ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Consultant } from '../data/schema'

export const consultantsColumns: ColumnDef<Consultant>[] = [
  {
    id: 'consultant',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Consultant' />
    ),
    cell: ({ row }) => {
      const { fullName, userName } = row.original
      const initials = (fullName ?? userName)
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

      return (
        <div className='flex items-center gap-3'>
          <Avatar className='size-8'>
            <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='font-medium'>{fullName ?? userName}</span>
            <span className='text-xs text-muted-foreground'>@{userName}</span>
          </div>
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='ps-2 text-nowrap'>{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => <div>{row.getValue('phoneNumber') ?? '—'}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'nationality',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nationality' />
    ),
    cell: ({ row }) => <div>{row.getValue('nationality') ?? '—'}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'qualification',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Qualification' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48'>
        {row.getValue('qualification') ?? '—'}
      </LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'experienceYears',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Experience' />
    ),
    cell: ({ row }) => {
      const years = row.getValue<string | null>('experienceYears')
      return <div>{years ? `${years} yrs` : '—'}</div>
    },
  },
  {
    accessorKey: 'specialization',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Specializations' />
    ),
    cell: ({ row }) => {
      const specs = row.getValue<string[] | null>('specialization')
      if (!specs || specs.length === 0) return <div>—</div>
      return (
        <div className='flex flex-wrap gap-1'>
          {specs.slice(0, 2).map((s) => (
            <Badge key={s} variant='secondary' className='text-xs'>
              {s}
            </Badge>
          ))}
          {specs.length > 2 && (
            <Badge variant='outline' className='text-xs'>
              +{specs.length - 2}
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gender' />
    ),
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('gender') ?? '—'}</div>
    ),
    enableSorting: false,
  },
]
