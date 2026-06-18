import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  getAllCategories,
  categoriesQueryKey,
} from '@/features/article-categories/api/categories-api'
import {
  addArticle,
  articlesQueryKey,
  updateArticle,
} from '../api/articles-api'
import { type Article } from '../data/schema'

const createSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  categoryId: z.string().min(1, 'Please select a category.'),
  image: z
    .instanceof(FileList)
    .refine((f) => f.length > 0, 'Image is required.'),
})

const updateSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  categoryId: z.string().min(1, 'Please select a category.'),
  image: z.instanceof(FileList).optional(),
})

type CreateForm = z.infer<typeof createSchema>
type UpdateForm = z.infer<typeof updateSchema>
type AnyForm = CreateForm | UpdateForm

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Article
}

export function ArticlesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const isUpdate = !!currentRow
  const queryClient = useQueryClient()

  const { data: categories = [] } = useQuery({
    queryKey: categoriesQueryKey,
    queryFn: getAllCategories,
  })

  const form = useForm<AnyForm>({
    resolver: zodResolver(isUpdate ? updateSchema : createSchema) as never,
    defaultValues: {
      title: currentRow?.title ?? '',
      categoryId: currentRow?.categoryId ? String(currentRow.categoryId) : '',
    },
  })

  // Re-populate when editing a different row
  useEffect(() => {
    form.reset({
      title: currentRow?.title ?? '',
      categoryId: currentRow?.categoryId ? String(currentRow.categoryId) : '',
    })
  }, [currentRow, form])

  const mutation = useMutation({
    mutationFn: (data: AnyForm) => {
      const fd = new FormData()
      fd.append('Title', data.title)
      fd.append('CategoryId', data.categoryId)
      const files = (data as CreateForm).image
      if (files && files.length > 0) fd.append('ImageUrl', files[0])
      return isUpdate ? updateArticle(currentRow!.id, fd) : addArticle(fd)
    },
    onSuccess: () => {
      toast.success(isUpdate ? 'Article updated.' : 'Article created.')
      queryClient.invalidateQueries({ queryKey: articlesQueryKey })
      onOpenChange(false)
      form.reset()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const imageRef = form.register('image' as never)

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v)
          form.reset({
            title: currentRow?.title ?? '',
            categoryId: currentRow?.categoryId
              ? String(currentRow.categoryId)
              : '',
          })
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'Edit' : 'Add'} Article</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the article details below.'
              : 'Fill in the article details.'}{' '}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='article-form'
            onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
            className='flex-1 space-y-5 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='e.g. Understanding Anxiety'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>
                Image
                {isUpdate && (
                  <span className='ml-1 text-xs text-muted-foreground'>
                    (optional)
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  {...imageRef}
                  className='h-9 py-0'
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors['image' as never]?.message as string}
              </FormMessage>
            </FormItem>
          </form>
        </Form>

        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button
            form='article-form'
            type='submit'
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
