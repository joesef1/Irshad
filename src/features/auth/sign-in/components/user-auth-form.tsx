import { useState } from 'react'
import { z } from 'zod'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { standardSchemaResolver as zodResolver } from '@hookform/resolvers/standard-schema'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
// import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { useAuthStore } from '@/stores/auth-store'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
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
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === '' ? 'يرجى إدخال بريدك الإلكتروني.' : undefined,
  }),
  password: z
    .string()
    .min(1, 'يرجى إدخال كلمة المرور.')
    .min(7, 'يجب أن تتكون كلمة المرور من 7 أحرف على الأقل.'),
})

interface LoginResponse {
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

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await api.post<LoginResponse>('/api/Auth/login', {
        email: data.email,
        password: data.password,
      })

      const { succeeded, data: payload, message } = response.data

      if (!succeeded || !payload) {
        toast.error(message ?? 'بيانات الاعتماد غير صحيحة')
        return
      }

      // Store the JWT token
      auth.setAccessToken(payload.token)

      // Build a user object from the response
      auth.setUser({
        accountNo: payload.userId,
        email: data.email,
        role: ['user'],
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hrs — replace with decoded JWT exp if needed
      })

      toast.success(`مرحباً بعودتك، ${payload.userName}!`)
      navigate({ to: redirectTo ?? '/', replace: true })
    } catch (err) {
      if (err instanceof AxiosError) {
        const msg =
          err.response?.data?.message ??
          err.response?.data?.title ??
          'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.'
        toast.error(msg)
      } else {
        toast.error('حدث خطأ غير متوقع.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='absolute inset-e-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
              >
                نسيت كلمة المرور؟
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          تسجيل الدخول
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            {/* <span className='bg-background px-2 text-muted-foreground'>
              أو تابع باستخدام
            </span> */}
          </div>
        </div>

        {/* <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div> */}
      </form>
    </Form>
  )
}
