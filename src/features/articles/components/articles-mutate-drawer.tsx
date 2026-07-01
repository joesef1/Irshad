import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
  uploadUserFile,
} from '../api/articles-api'
import { type Article } from '../data/schema'
import { useAuthStore } from '@/stores/auth-store'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب.'),
  categoryId: z.string().min(1, 'يرجى اختيار تصنيف.'),
})

type FormData = z.infer<typeof formSchema>

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageUrlRef = useRef(currentRow?.imageUrl ?? '')
  const [uploading, setUploading] = useState(false)

  const { data: categories = [] } = useQuery({
    queryKey: categoriesQueryKey,
    queryFn: getAllCategories,
  })

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: currentRow?.title ?? '',
      categoryId: currentRow?.categoryId ? String(currentRow.categoryId) : '',
    },
  })

  useEffect(() => {
    form.reset({
      title: currentRow?.title ?? '',
      categoryId: currentRow?.categoryId ? String(currentRow.categoryId) : '',
    })
    imageUrlRef.current = currentRow?.imageUrl ?? ''
  }, [currentRow, form])

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const userId = useAuthStore.getState().auth.user?.accountNo
    if (!userId) {
      toast.error('User not authenticated')
      return
    }

    setUploading(true)
    try {
      const result = await uploadUserFile(userId, file)
      if (result.identityFileUrl) {
        imageUrlRef.current = result.identityFileUrl
        toast.success('تم رفع الصورة بنجاح.')
      }
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const fd = new FormData()
      fd.append('Title', data.title)
      fd.append('CategoryId', data.categoryId)

      const file = fileInputRef.current?.files?.[0]
      if (file) {
        fd.append('ImageUrl', file)
      } else if (!isUpdate) {
        throw new Error('يرجى رفع الصورة أولاً.')
      }

      return isUpdate
        ? updateArticle(currentRow!.id, fd)
        : addArticle(fd)
    },
    onSuccess: () => {
      toast.success(isUpdate ? 'تم تحديث المقالة.' : 'تم إنشاء المقالة.')
      queryClient.invalidateQueries({ queryKey: articlesQueryKey })
      onOpenChange(false)
      form.reset()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) {
          form.reset({
            title: currentRow?.title ?? '',
            categoryId: currentRow?.categoryId
              ? String(currentRow.categoryId)
              : '',
          })
          imageUrlRef.current = currentRow?.imageUrl ?? ''
          if (fileInputRef.current) fileInputRef.current.value = ''
        }
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'تعديل' : 'إضافة'} مقالة</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'قم بتحديث تفاصيل المقالة أدناه.'
              : 'أدخل تفاصيل المقالة.'}{' '}
            انقر على حفظ عند الانتهاء.
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
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='مثال: فهم القلق' />
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
                  <FormLabel>التصنيف</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='اختر تصنيفاً' />
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
                الصورة
                {isUpdate && (
                  <span className='ml-1 text-xs text-muted-foreground'>
                    (اختياري)
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <div className='flex items-center gap-2'>
                  <Input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    disabled={uploading}
                    onChange={handleFileChange}
                    className='h-9 py-0'
                  />
                  {uploading && (
                    <Loader2 className='size-4 animate-spin text-muted-foreground shrink-0' />
                  )}
                </div>
              </FormControl>
              {!isUpdate && !imageUrlRef.current && (
                <p className='text-sm font-medium text-destructive'>
                  يرجى رفع الصورة أولاً.
                </p>
              )}
            </FormItem>
          </form>
        </Form>

        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>إغلاق</Button>
          </SheetClose>
          <Button
            form='article-form'
            type='submit'
            disabled={mutation.isPending || uploading}
          >
            {mutation.isPending ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
