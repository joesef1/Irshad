import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, Trash2 } from 'lucide-react'
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
import { type Article } from '../data/schema'
import { useArticles } from './articles-provider'

function RowActions({ article }: { article: Article }) {
  const { setOpen, setCurrentRow } = useArticles()
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
      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuItem asChild>
          <Link
            to='/Articles/$articleId'
            params={{ articleId: String(article.id) }}
          >
            <Eye className='mr-2 size-4' /> View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(article)
            setOpen('update')
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(article)
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

export const articlesColumns: ColumnDef<Article>[] = [
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
    accessorKey: 'categoryName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {row.getValue('categoryName') ?? '—'}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'imageUrl',
    header: () => <span>Image</span>,
    cell: ({ row }) => {
      const url = row.getValue<string | null>('imageUrl')
      if (!url) return <span className='text-muted-foreground'>—</span>
      return (
        <img
          src={url}
          alt='article'
          className='h-10 w-16 rounded object-cover'
        />
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowActions article={row.original} />,
  },
]
