import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  getAllTestQuestions,
  testQuestionsQueryKey,
} from './api/test-questions-api'
import { TestQuestionsDialogs } from './components/test-questions-dialogs'
import { TestQuestionsPrimaryButtons } from './components/test-questions-primary-buttons'
import { TestQuestionsProvider } from './components/test-questions-provider'
import { TestQuestionsTable } from './components/test-questions-table'

type Props = { testId: number; testName?: string }

export function TestQuestions({ testId, testName }: Props) {
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: testQuestionsQueryKey(testId),
    queryFn: () => getAllTestQuestions(testId),
  })

  return (
    <TestQuestionsProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div className='flex flex-col gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className='w-fit gap-1.5'
              onClick={() => navigate({ to: '/PsychologyTest' })}
            >
              <ArrowLeft className='size-4' /> العودة إلى الاختبارات النفسية
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                الأسئلة{testName ? ` — ${testName}` : ''}
              </h2>
              <p className='text-muted-foreground'>
                إدارة أسئلة وخيارات الإجابة لهذا الاختبار النفسي.
              </p>
            </div>
          </div>
          <TestQuestionsPrimaryButtons />
        </div>

        {isLoading && (
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full rounded-md' />
            ))}
          </div>
        )}

        {isError && (
          <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-destructive dark:bg-red-950/20'>
            فشل تحميل الأسئلة:{' '}
            {error instanceof Error ? error.message : 'خطأ غير معروف'}
          </div>
        )}

        {data && <TestQuestionsTable data={data} />}
      </Main>

      <TestQuestionsDialogs testId={testId} />
    </TestQuestionsProvider>
  )
}
