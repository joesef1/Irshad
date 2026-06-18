import { useRef } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  createPsychologyTest,
  psychologyTestsQueryKey,
  updatePsychologyTest,
} from '../api/psychology-tests-api'
import { type PsychologyTest } from '../data/schema'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  isFree: z.enum(['true', 'false']),
  reportRequiresPurchase: z.enum(['true', 'false']),
  price: z.string().optional(),
})

type TestForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: PsychologyTest
}

export function PsychologyTestsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const isUpdate = !!currentRow
  const queryClient = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const form = useForm<TestForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: currentRow?.title ?? '',
      description: currentRow?.description ?? '',
      isFree: currentRow?.isFree ? 'true' : 'false',
      reportRequiresPurchase: currentRow?.reportRequiresPurchase
        ? 'true'
        : 'false',
      price: currentRow?.price != null ? String(currentRow.price) : '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: TestForm) => {
      const file = fileRef.current?.files?.[0] ?? null
      const price =
        data.price && data.price.trim() !== ''
          ? parseFloat(data.price)
          : undefined

      if (isUpdate) {
        return updatePsychologyTest({
          Id: currentRow!.id,
          Title: data.title,
          Description: data.description,
          IsFree: data.isFree === 'true',
          ReportRequiresPurchase: data.reportRequiresPurchase === 'true',
          Price: price ?? null,
          URLImage: file,
        })
      }
      return createPsychologyTest({
        Title: data.title,
        Description: data.description,
        IsFree: data.isFree === 'true',
        ReportRequiresPurchase: data.reportRequiresPurchase === 'true',
        Price: price ?? null,
        URLImage: file,
      })
    },
    onSuccess: () => {
      toast.success(
        isUpdate ? 'Psychology test updated.' : 'Psychology test created.'
      )
      queryClient.invalidateQueries({ queryKey: psychologyTestsQueryKey })
      onOpenChange(false)
      form.reset()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const onSubmit = (data: TestForm) => mutation.mutate(data)

  const resetForm = () => {
    form.reset({
      title: currentRow?.title ?? '',
      description: currentRow?.description ?? '',
      isFree: currentRow?.isFree ? 'true' : 'false',
      reportRequiresPurchase: currentRow?.reportRequiresPurchase
        ? 'true'
        : 'false',
      price: currentRow?.price != null ? String(currentRow.price) : '',
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
          <SheetTitle>
            {isUpdate ? 'Edit' : 'Create'} Psychology Test
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the psychology test details below.'
              : 'Add a new psychology test.'}{' '}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='psychology-test-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-5 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g. Anxiety Assessment' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder='Describe the test…'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isFree'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Free?</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select…' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='true'>Yes</SelectItem>
                      <SelectItem value='false'>No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='reportRequiresPurchase'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Requires Purchase?</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select…' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='true'>Yes</SelectItem>
                      <SelectItem value='false'>No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      step='0.01'
                      min='0'
                      placeholder='e.g. 9.99'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Image (optional)</FormLabel>
              <FormControl>
                <Input ref={fileRef} type='file' accept='image/*' />
              </FormControl>
            </FormItem>
          </form>
        </Form>

        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button
            form='psychology-test-form'
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
