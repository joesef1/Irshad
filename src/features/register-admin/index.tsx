import { useState } from 'react'
import { z } from 'zod'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { standardSchemaResolver as zodResolver } from '@hookform/resolvers/standard-schema'
import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PasswordInput } from '@/components/password-input'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

const formSchema = z.object({
  fullName: z.string().optional(),
  email: z.email({ error: () => 'يرجى إدخال بريد إلكتروني صالح.' }),
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة.')
    .min(8, 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.'),
})

type RegisterAdminForm = z.infer<typeof formSchema>

interface ApiResponse {
  succeeded: boolean
  status: string
  message: string | null
  data: {
    token: string
    userId: string
    userName: string
  } | null
  error: unknown
}

export function RegisterAdmin() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterAdminForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  })

  async function onSubmit(data: RegisterAdminForm) {
    setIsLoading(true)
    try {
      const response = await api.post<ApiResponse>('/api/Auth/RegisterAdmin', {
        fullName: data.fullName || undefined,
        email: data.email,
        password: data.password,
      })

      const { succeeded, message } = response.data

      if (!succeeded) {
        toast.error(message ?? 'فشل التسجيل.')
        return
      }

      toast.success('تم تسجيل المشرف بنجاح.')
      form.reset()
    } catch (err) {
      if (err instanceof AxiosError) {
        const msg =
          err.response?.data?.message ??
          err.response?.data?.title ??
          'فشل التسجيل. يرجى المحاولة مرة أخرى.'
        toast.error(msg)
      } else {
        toast.error('حدث خطأ غير متوقع.')
      }
    } finally {
      setIsLoading(false)
    }
  }

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
          <h2 className='text-2xl font-bold tracking-tight'>تسجيل مشرف جديد</h2>
          <p className='text-muted-foreground'>
            تسجيل حساب مشرف جديد بالبيانات المطلوبة.
          </p>
        </div>

        <Card className='max-w-md'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <UserPlus className='size-4' /> بيانات المشرف
            </CardTitle>
            <CardDescription>
              سيحصل جميع المشرفين المسجلين على صلاحيات مستوى المشرف.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id='register-admin-form'
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col gap-5'
              >
                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        الاسم الكامل{' '}
                        <span className='text-xs text-muted-foreground'>
                          (اختياري)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='مثال: أحمد الرشيدي' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='email'
                          placeholder='admin@example.com'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} placeholder='••••••••' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type='submit'
                  form='register-admin-form'
                  disabled={isLoading}
                  className='gap-1.5 self-end'
                >
                  {isLoading ? (
                    'جاري التسجيل…'
                  ) : (
                    <>
                      <UserPlus className='size-4' /> تسجيل مشرف
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
