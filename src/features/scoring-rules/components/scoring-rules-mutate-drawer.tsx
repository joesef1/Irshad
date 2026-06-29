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
import { Textarea } from '@/components/ui/textarea'
import {
  createScoringRule,
  scoringRulesQueryKey,
  updateScoringRule,
} from '../api/scoring-rules-api'
import { type ScoringRule } from '../data/schema'

const formSchema = z.object({
  minScore: z
    .string()
    .min(1, 'أدنى درجة مطلوبة.')
    .refine((v) => !isNaN(Number(v)), 'يجب أن يكون رقماً.'),
  maxScore: z
    .string()
    .min(1, 'أعلى درجة مطلوبة.')
    .refine((v) => !isNaN(Number(v)), 'يجب أن يكون رقماً.'),
  reportDetails: z.string().min(1, 'تفاصيل التقرير مطلوبة.'),
})

type RuleForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  testId: number
  currentRow?: ScoringRule
}

export function ScoringRulesMutateDrawer({
  open,
  onOpenChange,
  testId,
  currentRow,
}: Props) {
  const isUpdate = !!currentRow
  const queryClient = useQueryClient()

  const form = useForm<RuleForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minScore: currentRow?.minScore != null ? String(currentRow.minScore) : '',
      maxScore: currentRow?.maxScore != null ? String(currentRow.maxScore) : '',
      reportDetails: currentRow?.reportDetails ?? '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: RuleForm) => {
      if (isUpdate) {
        return updateScoringRule({
          id: currentRow!.id,
          minScore: Number(data.minScore),
          maxScore: Number(data.maxScore),
          reportDetails: data.reportDetails,
        })
      }
      return createScoringRule({
        psychologyTestId: testId,
        minScore: Number(data.minScore),
        maxScore: Number(data.maxScore),
        reportDetails: data.reportDetails,
      })
    },
    onSuccess: () => {
      toast.success(
        isUpdate ? 'تم تحديث قاعدة التقييم.' : 'تم إنشاء قاعدة التقييم.'
      )
      queryClient.invalidateQueries({ queryKey: scoringRulesQueryKey(testId) })
      onOpenChange(false)
      form.reset()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const onSubmit = (data: RuleForm) => mutation.mutate(data)

  const resetForm = () => {
    form.reset({
      minScore: currentRow?.minScore != null ? String(currentRow.minScore) : '',
      maxScore: currentRow?.maxScore != null ? String(currentRow.maxScore) : '',
      reportDetails: currentRow?.reportDetails ?? '',
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        resetForm()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'تعديل' : 'إنشاء'} قاعدة تقييم</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'قم بتحديث تفاصيل قاعدة التقييم أدناه.'
              : 'أضف قاعدة تقييم جديدة لهذا الاختبار.'}{' '}
            انقر على حفظ عند الانتهاء.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='scoring-rule-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-5 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='minScore'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>أدنى درجة</FormLabel>
                  <FormControl>
                    <Input {...field} type='number' placeholder='مثال: 0' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='maxScore'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>أعلى درجة</FormLabel>
                  <FormControl>
                    <Input {...field} type='number' placeholder='مثال: 30' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='reportDetails'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تفاصيل التقرير</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder='صف تفسير النتيجة…'
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
            form='scoring-rule-form'
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
