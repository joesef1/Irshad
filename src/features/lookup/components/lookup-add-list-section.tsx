import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { standardSchemaResolver as zodResolver } from '@hookform/resolvers/standard-schema'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type LookupItem } from '../api/lookup-api'

const formSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب.'),
})
type FormValues = z.infer<typeof formSchema>

type Props = {
  title: string
  addLabel: string
  queryKey: readonly string[]
  fetchFn: () => Promise<LookupItem[]>
  addFn: (name: string) => Promise<void>
  placeholder?: string
  nameKey?: string
}

export function LookupAddListSection({
  title,
  addLabel,
  queryKey,
  fetchFn,
  addFn,
  placeholder,
  nameKey = 'name',
}: Props) {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({ queryKey, queryFn: fetchFn })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) => addFn(values.name),
    onSuccess: () => {
      toast.success(`تمت إضافة ${addLabel}.`)
      queryClient.invalidateQueries({ queryKey })
      form.reset()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-base'>
            <Plus className='size-4' /> إضافة {addLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
              className='flex items-end gap-3'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={placeholder ?? `أدخل اسم ${addLabel}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                disabled={mutation.isPending}
                className='mb-0.5'
              >
                {mutation.isPending ? 'جارٍ الحفظ…' : 'إضافة'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>قائمة {title}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className='flex flex-col gap-2'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className='h-9 w-full rounded' />
              ))}
            </div>
          )}
          {isError && (
            <p className='text-sm text-destructive'>فشل تحميل {title}.</p>
          )}
          {data && (
            <div className='overflow-hidden rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-16'>#</TableHead>
                    <TableHead>الاسم</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className='h-16 text-center text-muted-foreground'
                      >
                        لا توجد {title}.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className='text-muted-foreground'>
                          {item.id}
                        </TableCell>
                        <TableCell className='font-medium'>
                          {String(item[nameKey] ?? '—')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
