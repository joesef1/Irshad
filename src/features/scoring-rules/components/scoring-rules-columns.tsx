import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type ColumnDef } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table'
import { type ScoringRule } from '../data/schema'
import { useScoringRules } from './scoring-rules-provider'

function RowActions({ rule }: { rule: ScoringRule }) {
  const { setOpen, setCurrentRow } = useScoringRules()
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>فتح القائمة</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-36'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(rule)
            setOpen('update')
          }}
        >
          تعديل
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(rule)
            setOpen('delete')
          }}
        >
          حذف
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const scoringRulesColumns: ColumnDef<ScoringRule>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='#' />,
    cell: ({ row }) => <div className='w-12'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'minScore',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='أدنى درجة' />
    ),
    cell: ({ row }) => <span>{row.getValue('minScore')}</span>,
  },
  {
    accessorKey: 'maxScore',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='أعلى درجة' />
    ),
    cell: ({ row }) => <span>{row.getValue('maxScore')}</span>,
  },
  {
    accessorKey: 'reportDetails',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='تفاصيل التقرير' />
    ),
    cell: ({ row }) => {
      const details = row.getValue<string>('reportDetails')
      return (
        <span
          className='max-w-xs truncate text-muted-foreground'
          title={details}
        >
          {details.length > 80 ? `${details.slice(0, 80)}…` : details}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowActions rule={row.original} />,
  },
]
