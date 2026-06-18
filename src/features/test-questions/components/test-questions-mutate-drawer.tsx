import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
  optionText: z.string().min(1, 'Option text is required.'),
  scoreValue: z
    .string()
    .min(1, 'Score is required.')
    .refine((v) => !isNaN(Number(v)), 'Must be a number.'),
  testQuestionId: z.number().optional(),
})

const formSchema = z.object({
  questionText: z.string().min(1, 'Question text is required.'),
  testSectionId: z
    .string()
    .min(1, 'Section ID is required.')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Must be a valid ID.'),
  options: z.array(optionSchema).min(1, 'At least one option is required.'),
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
      toast.success(isUpdate ? 'Question updated.' : 'Question created.')
      queryClient.invalidateQueries({ queryKey: testQuestionsQueryKey(testId) })
      onOpenChange(false)
      form.reset(buildDefaults())
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const onSubmit = (data: QuestionForm) => mutation.mutate(data)

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
          <SheetTitle>{isUpdate ? 'Edit' : 'Create'} Question</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the question and its answer options.'
              : 'Add a new question with answer options.'}{' '}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='test-question-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-5 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='questionText'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='e.g. How often do you feel anxious?'
                    />
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
                  <FormLabel>Section ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      min='1'
                      placeholder='e.g. 1'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className='flex flex-col gap-3'>
              <div className='flex items-center justify-between'>
                <FormLabel>Answer Options</FormLabel>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='gap-1.5'
                  onClick={() => append({ optionText: '', scoreValue: '' })}
                >
                  <Plus size={14} /> Add Option
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
                          <FormLabel className='text-xs'>Option Text</FormLabel>
                          <FormControl>
                            <Input
                              {...f}
                              placeholder='e.g. Never'
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
                          <FormLabel className='text-xs'>Score Value</FormLabel>
                          <FormControl>
                            <Input
                              {...f}
                              type='number'
                              placeholder='e.g. 0'
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
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button
            form='test-question-form'
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
