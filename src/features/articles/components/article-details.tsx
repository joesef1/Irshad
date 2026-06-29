import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { standardSchemaResolver as zodResolver } from '@hookform/resolvers/standard-schema'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDialog } from '@/components/confirm-dialog'
import {
  addSection,
  articleDetailsQueryKey,
  deleteArticleSections,
  getArticleDetails,
} from '../api/articles-api'

const sectionSchema = z.object({
  title: z.string().min(1, 'عنوان القسم مطلوب.'),
  content: z.string().min(1, 'المحتوى مطلوب.'),
})
type SectionForm = z.infer<typeof sectionSchema>

type Props = { articleId: number }

export function ArticleDetails({ articleId }: Props) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const {
    data: article,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: articleDetailsQueryKey(articleId),
    queryFn: () => getArticleDetails(articleId),
  })

  const form = useForm<SectionForm>({
    resolver: zodResolver(sectionSchema),
    defaultValues: { title: '', content: '' },
  })

  const addSectionMutation = useMutation({
    mutationFn: (data: SectionForm) =>
      addSection(articleId, data.title, data.content),
    onSuccess: () => {
      toast.success('تمت إضافة القسم.')
      queryClient.invalidateQueries({
        queryKey: articleDetailsQueryKey(articleId),
      })
      setDrawerOpen(false)
      form.reset()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteSectionsMutation = useMutation({
    mutationFn: () => deleteArticleSections(articleId),
    onSuccess: () => {
      toast.success('تم حذف جميع الأقسام.')
      queryClient.invalidateQueries({
        queryKey: articleDetailsQueryKey(articleId),
      })
      setDeleteOpen(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4'>
        <Skeleton className='h-10 w-32' />
        <Skeleton className='h-40 w-full rounded-xl' />
        <Skeleton className='h-40 w-full rounded-xl' />
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-destructive dark:bg-red-950/20'>
        فشل تحميل المقالة:{' '}
        {error instanceof Error ? error.message : 'خطأ غير معروف'}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* رجوع */}
      <Button
        variant='ghost'
        size='sm'
        className='w-fit gap-1.5'
        onClick={() => navigate({ to: '/Articles' })}
      >
        <ArrowLeft className='size-4' /> العودة إلى المقالات
      </Button>

      {/* بطاقة المقالة */}
      <Card>
        <CardContent className='flex flex-wrap gap-4 pt-6'>
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={article.title}
              className='h-32 w-48 rounded-md object-cover'
            />
          )}
          <div className='flex flex-col gap-1'>
            <h2 className='text-xl font-semibold'>{article.title}</h2>
            {article.categoryName && (
              <span className='text-sm text-muted-foreground'>
                {article.categoryName}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* قائمة الأقسام */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-base'>الأقسام</CardTitle>
          <div className='flex gap-2'>
            <Button
              size='sm'
              className='gap-1.5'
              onClick={() => setDrawerOpen(true)}
            >
              <Plus className='size-4' /> إضافة قسم
            </Button>
            {article.sections && article.sections.length > 0 && (
              <Button
                variant='destructive'
                size='sm'
                className='gap-1.5'
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className='size-4' /> حذف جميع الأقسام
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          {!article.sections?.length ? (
            <p className='text-sm text-muted-foreground'>لا توجد أقسام بعد.</p>
          ) : (
            article.sections.map((section, i) => (
              <div key={section.id} className='flex flex-col gap-1'>
                {i > 0 && <Separator className='mb-3' />}
                <p className='font-medium'>{section.title}</p>
                <p className='text-sm whitespace-pre-wrap text-muted-foreground'>
                  {section.content}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* درج إضافة قسم */}
      <Sheet
        open={drawerOpen}
        onOpenChange={(v) => {
          setDrawerOpen(v)
          if (!v) form.reset()
        }}
      >
        <SheetContent className='flex flex-col'>
          <SheetHeader className='text-start'>
            <SheetTitle>إضافة قسم</SheetTitle>
            <SheetDescription>
              أضف قسماً جديداً لهذه المقالة. انقر على حفظ عند الانتهاء.
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form
              id='section-form'
              onSubmit={form.handleSubmit((d) => addSectionMutation.mutate(d))}
              className='flex-1 space-y-5 overflow-y-auto px-4'
            >
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان القسم</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='مثال: المقدمة' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المحتوى</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={8}
                        placeholder='اكتب محتوى القسم هنا…'
                      />
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
              form='section-form'
              type='submit'
              disabled={addSectionMutation.isPending}
            >
              {addSectionMutation.isPending ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* تأكيد حذف جميع الأقسام */}
      <ConfirmDialog
        destructive
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        handleConfirm={() => deleteSectionsMutation.mutate()}
        className='max-w-md'
        title='حذف جميع الأقسام؟'
        desc={
          <>
            سيتم حذف جميع أقسام <strong>{article.title}</strong> بشكل نهائي. لا
            يمكن التراجع عن هذا الإجراء.
          </>
        }
        confirmText={
          deleteSectionsMutation.isPending ? 'جارٍ الحذف…' : 'حذف الكل'
        }
      />
    </div>
  )
}
