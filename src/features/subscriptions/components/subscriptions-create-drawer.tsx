import { z } from 'zod'
import { useForm, useFieldArray, type Resolver } from 'react-hook-form'
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
  addSubscription,
  subscriptionsQueryKey,
} from '../api/subscriptions-api'

const formSchema = z.object({
  name: z.string().min(1, 'Plan name is required.'),
  durationInDays: z.coerce
    .number()
    .int('Enter a valid whole number.')
    .positive('Duration must be positive.'),
  price: z.coerce.number().nonnegative('Price must be 0 or more.'),
  benefits: z
    .array(
      z.object({ description: z.string().min(1, 'Benefit cannot be empty.') })
    )
    .min(1, 'Add at least one benefit.'),
})

type SubscriptionForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubscriptionsCreateDrawer({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient()

  const form = useForm<SubscriptionForm>({
    resolver: zodResolver(formSchema) as ReturnType<
      typeof zodResolver<typeof formSchema>
    >,
    defaultValues: {
      name: '',
      durationInDays: 30,
      price: 0,
      benefits: [{ description: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray<SubscriptionForm>({
    control: form.control,
    name: 'benefits',
  })

  const mutation = useMutation({
    mutationFn: (data: SubscriptionForm) =>
      addSubscription({
        name: data.name,
        durationInDays: data.durationInDays,
        price: data.price,
        benefits: data.benefits.map((b) => b.description),
      }),
    onSuccess: () => {
      toast.success('Subscription plan created.')
      queryClient.invalidateQueries({ queryKey: subscriptionsQueryKey })
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
        if (!v) form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>Create Subscription Plan</SheetTitle>
          <SheetDescription>
            Add a new subscription plan with benefits. Click save when
            you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='subscription-form'
            onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
            className='flex-1 space-y-5 overflow-y-auto px-4'
          >
            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g. Pro Monthly' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name='durationInDays'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (days)</FormLabel>
                  <FormControl>
                    <Input {...field} type='number' min={1} placeholder='30' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      min={0}
                      step='0.01'
                      placeholder='9.99'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Benefits */}
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <FormLabel>Benefits</FormLabel>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='gap-1'
                  onClick={() => append({ description: '' })}
                >
                  <Plus className='size-3.5' /> Add
                </Button>
              </div>

              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`benefits.${index}.description`}
                  render={({ field: f }) => (
                    <FormItem>
                      <div className='flex gap-2'>
                        <FormControl>
                          <Input {...f} placeholder={`Benefit ${index + 1}`} />
                        </FormControl>
                        {fields.length > 1 && (
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-9 w-9 shrink-0 text-destructive hover:text-destructive'
                            onClick={() => remove(index)}
                          >
                            <Trash2 className='size-4' />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {form.formState.errors.benefits?.root && (
                <p className='text-sm text-destructive'>
                  {form.formState.errors.benefits.root.message}
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
            form='subscription-form'
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
