import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type ColumnDef } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
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
import { DataTableColumnHeader } from '@/components/data-table'
import { type TestQuestion } from '../data/schema'
import { useTestQuestions } from './test-questions-provider'

function RowActions({ question }: { question: TestQuestion }) {
  const { setOpen, setCurrentRow } = useTestQuestions()
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
            setCurrentRow(question)
            setOpen('update')
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(question)
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

export const testQuestionsColumns: ColumnDef<TestQuestion>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='#' />,
    cell: ({ row }) => <div className='w-12'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'questionText',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Question' />
    ),
    cell: ({ row }) => (
      <span className='font-medium'>{row.getValue('questionText')}</span>
    ),
  },
  {
    accessorKey: 'testSectionTitle',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Section' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {row.getValue<string | null>('testSectionTitle') ?? '—'}
      </span>
    ),
  },
  {
    id: 'optionsCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Options' />
    ),
    cell: ({ row }) => {
      const count = row.original.options?.length ?? 0
      return <Badge variant='secondary'>{count}</Badge>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowActions question={row.original} />,
  },
]
