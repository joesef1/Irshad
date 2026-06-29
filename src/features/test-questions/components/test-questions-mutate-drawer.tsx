import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { standardSchemaResolver as zodResolver } from '@hookform/resolvers/standard-schema'
import { Plus, Trash2 } from 'lucide-react'
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
import {
  createTestQuestion,
  testQuestionsQueryKey,
  updateTestQuestion,
} from '../api/test-questions-api'
import { type TestQuestion } from '../data/schema'

const optionSchema = z.object({
  id: z.number().optional(),
  optionText: z.string().min(1, 'نص الخيار مطلوب.'),
  scoreValue: z
    .string()
    .min(1, 'الدرجة مطلوبة.')
    .refine((v) => !isNaN(Number(v)), 'يجب أن يكون رقماً.'),
  testQuestionId: z.number().optional(),
})

const formSchema = z.object({
  questionText: z.string().min(1, 'نص السؤال مطلوب.'),
  testSectionId: z
    .string()
    .min(1, 'معرّف القسم مطلوب.')
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      'يجب أن يكون معرّفاً صالحاً.'
    ),
  options: z.array(optionSchema).min(1, 'أضف خياراً واحداً على الأقل.'),
})

type QuestionForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  testId: number
  currentRow?: TestQuestion
}

export function TestQuestionsMutateDrawer({
  open,
  onOpenChange,
  testId,
  currentRow,
}: Props) {
  const isUpdate = !!currentRow
  const queryClient = useQueryClient()

  const buildDefaults = (): QuestionForm => ({
    questionText: currentRow?.questionText ?? '',
    testSectionId:
      currentRow?.testSectionId != null ? String(currentRow.testSectionId) : '',
    options: currentRow?.options?.length
      ? currentRow.options.map((o) => ({
          id: o.id,
          optionText: o.optionText,
          scoreValue: String(o.scoreValue),
          testQuestionId: o.testQuestionId,
        }))
      : [{ optionText: '', scoreValue: '' }],
  })

  const form = useForm<QuestionForm>({
    resolver: zodResolver(formSchema),
    defaultValues: buildDefaults(),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  })

  const mutation = useMutation({
    mutationFn: (data: QuestionForm) => {
      if (isUpdate) {
        return updateTestQuestion({
          id: currentRow!.id,
          questionText: data.questionText,
          testSectionId: Number(data.testSectionId),
          options: data.options.map((o) => ({
            id: o.id ?? 0,
            optionText: o.optionText,
            scoreValue: Number(o.scoreValue),
            testQuestionId: o.testQuestionId ?? currentRow!.id,
          })),
        })
      }
      return createTestQuestion({
        questionText: data.questionText,
        psychologyTestId: testId,
        testSectionId: Number(data.testSectionId),
        options: data.options.map((o) => ({
          optionText: o.optionText,
          scoreValue: Number(o.scoreValue),
        })),
      })
    },
    onSuccess: () => {
      toast.success(isUpdate ? 'تم تحديث السؤال.' : 'تم إنشاء السؤال.')
      queryClient.invalidateQueries({ queryKey: testQuestionsQueryKey(testId) })
      onOpenChange(false)
      form.reset(buildDefaults())
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) form.reset(buildDefaults())
      }}
    >
      <SheetContent className='flex flex-col sm:max-w-lg'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'تعديل' : 'إنشاء'} سؤال</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'قم بتحديث السؤال وخيارات الإجابة الخاصة به.'
              : 'أضف سؤالاً جديداً مع خيارات الإجابة.'}{' '}
            انقر على حفظ عند الانتهاء.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='test-question-form'
            onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
            className='flex-1 space-y-5 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='questionText'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نص السؤال</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='مثال: كم مرة تشعر بالقلق؟' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='testSectionId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>معرّف القسم</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      min='1'
                      placeholder='مثال: 1'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className='flex flex-col gap-3'>
              <div className='flex items-center justify-between'>
                <FormLabel>خيارات الإجابة</FormLabel>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='gap-1.5'
                  onClick={() => append({ optionText: '', scoreValue: '' })}
                >
                  <Plus size={14} /> إضافة خيار
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className='flex items-start gap-2 rounded-md border p-3'
                >
                  <div className='flex flex-1 flex-col gap-3'>
                    <FormField
                      control={form.control}
                      name={`options.${index}.optionText`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className='text-xs'>نص الخيار</FormLabel>
                          <FormControl>
                            <Input
                              {...f}
                              placeholder='مثال: أبداً'
                              className='h-8 text-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`options.${index}.scoreValue`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className='text-xs'>قيمة الدرجة</FormLabel>
                          <FormControl>
                            <Input
                              {...f}
                              type='number'
                              placeholder='مثال: 0'
                              className='h-8 text-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='mt-5 h-8 w-8 shrink-0 text-destructive hover:text-destructive'
                      onClick={() => remove(index)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))}

              {form.formState.errors.options?.root && (
                <p className='text-sm text-destructive'>
                  {form.formState.errors.options.root.message}
                </p>
              )}
            </div>
          </form>
        </Form>

        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>إغلاق</Button>
          </SheetClose>
          <Button
            form='test-question-form'
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
