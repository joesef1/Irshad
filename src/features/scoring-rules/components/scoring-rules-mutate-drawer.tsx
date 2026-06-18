import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
    .min(1, 'Min score is required.')
    .refine((v) => !isNaN(Number(v)), 'Must be a number.'),
  maxScore: z
    .string()
    .min(1, 'Max score is required.')
    .refine((v) => !isNaN(Number(v)), 'Must be a number.'),
  reportDetails: z.string().min(1, 'Report details are required.'),
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
        isUpdate ? 'Scoring rule updated.' : 'Scoring rule created.'
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
          <SheetTitle>{isUpdate ? 'Edit' : 'Create'} Scoring Rule</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the scoring rule details below.'
              : 'Add a new scoring rule for this test.'}{' '}
            Click save when you&apos;re done.
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
                  <FormLabel>Min Score</FormLabel>
                  <FormControl>
                    <Input {...field} type='number' placeholder='e.g. 0' />
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
                  <FormLabel>Max Score</FormLabel>
                  <FormControl>
                    <Input {...field} type='number' placeholder='e.g. 30' />
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
                  <FormLabel>Report Details</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder='Describe the result interpretation…'
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
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button
            form='scoring-rule-form'
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
