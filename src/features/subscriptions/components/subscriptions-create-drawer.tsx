import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
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
  name: z.string().min(1, 'اسم الخطة مطلوب.'),
  durationInDays: z
    .number()
    .int('أدخل عدداً صحيحاً صالحاً.')
    .positive('يجب أن تكون المدة موجبة.'),
  price: z.number().nonnegative('يجب أن يكون السعر 0 أو أكثر.'),
  benefits: z
    .array(
      z.object({
        description: z.string().min(1, 'لا يمكن أن تكون الميزة فارغة.'),
      })
    )
    .min(1, 'أضف ميزة واحدة على الأقل.'),
})

type SubscriptionForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubscriptionsCreateDrawer({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient()

  const form = useForm<SubscriptionForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      durationInDays: 30,
      price: 0,
      benefits: [{ description: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
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
      toast.success('تم إنشاء خطة الاشتراك.')
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
          <SheetTitle>إنشاء خطة اشتراك</SheetTitle>
          <SheetDescription>
            أضف خطة اشتراك جديدة مع المزايا. انقر على حفظ عند الانتهاء.
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
                  <FormLabel>اسم الخطة</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='مثال: برو شهري' />
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
                  <FormLabel>المدة (بالأيام)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      min={1}
                      placeholder='30'
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
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
                  <FormLabel>السعر ($)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      min={0}
                      step='0.01'
                      placeholder='9.99'
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Benefits */}
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <FormLabel>المزايا</FormLabel>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='gap-1'
                  onClick={() => append({ description: '' })}
                >
                  <Plus className='size-3.5' /> إضافة
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
                          <Input {...f} placeholder={`الميزة ${index + 1}`} />
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
            <Button variant='outline'>إغلاق</Button>
          </SheetClose>
          <Button
            form='subscription-form'
            type='submit'
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'جاري الحفظ…' : 'حفظ التغييرات'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
