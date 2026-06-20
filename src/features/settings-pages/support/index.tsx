import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { Skeleton } from '@/components/ui/skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  getTechnicalSupport,
  technicalSupportQueryKey,
  updateTechnicalSupport,
} from '../api/settings-api'

const formSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
})
type SupportForm = z.infer<typeof formSchema>

export function SupportPage() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: technicalSupportQueryKey,
    queryFn: getTechnicalSupport,
  })

  const form = useForm<SupportForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', phone: '', whatsapp: '' },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        email: data.email ?? '',
        phone: data.phone ?? '',
        whatsapp: data.whatsapp ?? '',
      })
    }
  }, [data, form])

  const mutation = useMutation({
    mutationFn: (d: SupportForm) => updateTechnicalSupport({ ...data, ...d }),
    onSuccess: () => {
      toast.success('تم تحديث معلومات الدعم الفني.')
      queryClient.invalidateQueries({ queryKey: technicalSupportQueryKey })
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
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>الدعم الفني</h2>
          <p className='text-muted-foreground'>
            تحديث بيانات التواصل مع الدعم الفني التي تظهر للمستخدمين.
          </p>
        </div>

        {isLoading && (
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full rounded' />
            ))}
          </div>
        )}

        {isError && (
          <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-destructive dark:bg-red-950/20'>
            فشل تحميل بيانات الدعم الفني:{' '}
            {error instanceof Error ? error.message : 'خطأ غير معروف'}
          </div>
        )}

        {!isLoading && !isError && (
          <Card className='max-w-lg'>
            <CardHeader>
              <CardTitle className='text-base'>بيانات التواصل</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  id='support-form'
                  onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
                  className='flex flex-col gap-5'
                >
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder='support@example.com' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder='+966 5xx xxx xxx' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='whatsapp'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>واتساب</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder='+966 5xx xxx xxx' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='submit'
                    form='support-form'
                    disabled={mutation.isPending}
                    className='self-end'
                  >
                    {mutation.isPending ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  )
}
