import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { standardSchemaResolver as zodResolver } from '@hookform/resolvers/standard-schema'
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  addCategory,
  categoriesQueryKey,
  updateCategory,
} from '../api/categories-api'
import { type Category } from '../data/schema'

const formSchema = z.object({
  name: z.string().min(1, 'اسم التصنيف مطلوب.'),
})
type CategoryForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Category
}

export function CategoriesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const isUpdate = !!currentRow
  const queryClient = useQueryClient()

  const form = useForm<CategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: currentRow?.name ?? '' },
  })

  const mutation = useMutation({
    mutationFn: (data: CategoryForm) =>
      isUpdate
        ? updateCategory(currentRow!.id, data.name)
        : addCategory(data.name),
    onSuccess: () => {
      toast.success(isUpdate ? 'تم تحديث التصنيف.' : 'تم إنشاء التصنيف.')
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey })
      onOpenChange(false)
      form.reset()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const onSubmit = (data: CategoryForm) => mutation.mutate(data)

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset({ name: currentRow?.name ?? '' })
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'تعديل' : 'إنشاء'} تصنيف</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'قم بتحديث اسم التصنيف أدناه.'
              : 'أضف تصنيفاً جديداً للمقالات.'}{' '}
            انقر على حفظ عند الانتهاء.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='category-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='مثال: الصحة النفسية' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>إغلاق</Button>
          </SheetClose>
          <Button
            form='category-form'
            type='submit'
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
