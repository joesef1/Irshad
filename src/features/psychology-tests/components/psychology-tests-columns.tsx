import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { FileText, HelpCircle, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table'
import { type PsychologyTest } from '../data/schema'
import { usePsychologyTests } from './psychology-tests-provider'

function RowActions({ test }: { test: PsychologyTest }) {
  const { setOpen, setCurrentRow } = usePsychologyTests()
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-36'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(test)
            setOpen('update')
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(test)
            setOpen('delete')
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const psychologyTestsColumns: ColumnDef<PsychologyTest>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='#' />,
    cell: ({ row }) => <div className='w-12'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => (
      <span className='font-medium'>{row.getValue('title')}</span>
    ),
  },
  {
    accessorKey: 'isFree',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const isFree = row.getValue<boolean>('isFree')
      return (
        <Badge variant={isFree ? 'secondary' : 'default'}>
          {isFree ? 'Free' : 'Paid'}
        </Badge>
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
    accessorKey: 'createdDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = row.getValue<string | null>('createdDate')
      return (
        <span className='text-sm text-muted-foreground'>
          {date ? new Date(date).toLocaleDateString() : '—'}
        </span>
      )
    },
  },
  {
    id: 'report',
    header: () => (
      <span className='flex items-center gap-1 text-xs font-medium text-muted-foreground'>
        <FileText size={13} /> Report
      </span>
    ),
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='ghost' size='icon' className='h-8 w-8' asChild>
            <Link
              to='/PsychologyTest/$testId/report'
              params={{ testId: String(row.original.id) }}
              aria-label='View scoring rules'
            >
              <FileText className='size-4' />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Scoring Rules</TooltipContent>
      </Tooltip>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'questions',
    header: () => (
      <span className='flex items-center gap-1 text-xs font-medium text-muted-foreground'>
        <HelpCircle size={13} /> Questions
      </span>
    ),
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='ghost' size='icon' className='h-8 w-8' asChild>
            <Link
              to='/PsychologyTest/$testId/questions'
              params={{ testId: String(row.original.id) }}
              aria-label='View questions'
            >
              <HelpCircle className='size-4' />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Questions</TooltipContent>
      </Tooltip>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowActions test={row.original} />,
  },
]
