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
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  getSecurityAndPrivacy,
  privacyQueryKey,
  updateSecurityAndPrivacy,
} from '../api/settings-api'

const formSchema = z.object({
  content: z.string().min(1, 'Content is required.'),
})
type PrivacyForm = z.infer<typeof formSchema>

export function PrivacyPage() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: privacyQueryKey,
    queryFn: getSecurityAndPrivacy,
  })

  const form = useForm<PrivacyForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: '' },
  })

  useEffect(() => {
    if (data) form.reset({ content: data.content ?? '' })
  }, [data, form])

  const mutation = useMutation({
    mutationFn: (d: PrivacyForm) => updateSecurityAndPrivacy(d.content),
    onSuccess: () => {
      toast.success('Privacy policy updated.')
      queryClient.invalidateQueries({ queryKey: privacyQueryKey })
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
          <h2 className='text-2xl font-bold tracking-tight'>
            Security & Privacy
          </h2>
          <p className='text-muted-foreground'>
            Update the privacy and security policy shown to users.
          </p>
        </div>

        {isLoading && <Skeleton className='h-64 w-full rounded-xl' />}

        {isError && (
          <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-destructive dark:bg-red-950/20'>
            Failed to load privacy policy:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        )}

        {!isLoading && !isError && (
          <Card className='max-w-3xl'>
            <CardHeader>
              <CardTitle className='text-base'>Policy Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  id='privacy-form'
                  onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
                  className='flex flex-col gap-5'
                >
                  <FormField
                    control={form.control}
                    name='content'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={16}
                            placeholder='Write the privacy & security policy…'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='submit'
                    form='privacy-form'
                    disabled={mutation.isPending}
                    className='self-end'
                  >
                    {mutation.isPending ? 'Saving…' : 'Save changes'}
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
