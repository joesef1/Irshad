import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
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
import { ConfigDrawer } from '@/components/config-drawer'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  addFaq,
  deleteFaq,
  type Faq,
  faqsQueryKey,
  getAllFaqs,
  updateFaq,
} from '../api/settings-api'

const formSchema = z.object({
  question: z.string().min(1, 'السؤال مطلوب.'),
  answer: z.string().min(1, 'الإجابة مطلوبة.'),
})
type FaqForm = z.infer<typeof formSchema>

function FaqMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  currentRow?: Faq
}) {
  const isUpdate = !!currentRow
  const queryClient = useQueryClient()

  const form = useForm<FaqForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: currentRow?.question ?? '',
      answer: currentRow?.answer ?? '',
    },
  })

  const mutation = useMutation({
    mutationFn: (d: FaqForm) =>
      isUpdate
        ? updateFaq(currentRow!.id, d.question, d.answer)
        : addFaq(d.question, d.answer),
    onSuccess: () => {
      toast.success(isUpdate ? 'تم تحديث السؤال.' : 'تمت إضافة السؤال.')
      queryClient.invalidateQueries({ queryKey: faqsQueryKey })
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
        form.reset({
          question: currentRow?.question ?? '',
          answer: currentRow?.answer ?? '',
        })
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'تعديل' : 'إضافة'} سؤال شائع</SheetTitle>
          <SheetDescription>
            {isUpdate ? 'قم بتحديث السؤال أدناه.' : 'أضف سؤالاً شائعاً جديداً.'}{' '}
            انقر على حفظ عند الانتهاء.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='faq-form'
            onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
            className='flex-1 space-y-5 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='question'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السؤال</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='مثال: كيف أعيد تعيين كلمة المرور؟'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='answer'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الإجابة</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder='اكتب الإجابة هنا…'
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
          <Button form='faq-form' type='submit' disabled={mutation.isPending}>
            {mutation.isPending ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function FaqsPage() {
  const queryClient = useQueryClient()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState<Faq | null>(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: faqsQueryKey,
    queryFn: getAllFaqs,
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteFaq(currentRow!.id),
    onSuccess: () => {
      toast.success('تم حذف السؤال.')
      queryClient.invalidateQueries({ queryKey: faqsQueryKey })
      setDeleteOpen(false)
      setCurrentRow(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              الأسئلة الشائعة
            </h2>
            <p className='text-muted-foreground'>
              إدارة الأسئلة الشائعة التي تظهر للمستخدمين.
            </p>
          </div>
          <Button
            className='gap-1.5'
            onClick={() => {
              setCurrentRow(null)
              setDrawerOpen(true)
            }}
          >
            <Plus className='size-4' /> إضافة سؤال
          </Button>
        </div>

        {isLoading && (
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-24 w-full rounded-xl' />
            ))}
          </div>
        )}

        {isError && (
          <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-destructive dark:bg-red-950/20'>
            فشل تحميل الأسئلة الشائعة:{' '}
            {error instanceof Error ? error.message : 'خطأ غير معروف'}
          </div>
        )}

        {data && (
          <div className='flex flex-col gap-3'>
            {data.length === 0 && (
              <p className='text-sm text-muted-foreground'>
                لا توجد أسئلة شائعة بعد.
              </p>
            )}
            {data.map((faq) => (
              <Card key={faq.id}>
                <CardHeader className='flex flex-row items-start justify-between gap-2 pb-2'>
                  <CardTitle className='text-base font-medium'>
                    {faq.question}
                  </CardTitle>
                  <div className='flex shrink-0 gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => {
                        setCurrentRow(faq)
                        setDrawerOpen(true)
                      }}
                    >
                      <Pencil className='size-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-destructive hover:text-destructive'
                      onClick={() => {
                        setCurrentRow(faq)
                        setDeleteOpen(true)
                      }}
                    >
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='text-sm whitespace-pre-wrap text-muted-foreground'>
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Main>

      <FaqMutateDrawer
        key={currentRow ? `edit-${currentRow.id}` : 'create'}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        currentRow={currentRow ?? undefined}
      />

      {currentRow && (
        <ConfirmDialog
          destructive
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          handleConfirm={() => deleteMutation.mutate()}
          className='max-w-md'
          title='حذف هذا السؤال؟'
          desc={
            <>
              أنت على وشك حذف السؤال نهائياً:{' '}
              <strong>{currentRow.question}</strong>. لا يمكن التراجع عن هذا
              الإجراء.
            </>
          }
          confirmText={deleteMutation.isPending ? 'جارٍ الحذف…' : 'حذف'}
        />
      )}
    </>
  )
}
