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
  getAllScoringRulesForTest,
  scoringRulesQueryKey,
} from './api/scoring-rules-api'
import { ScoringRulesDialogs } from './components/scoring-rules-dialogs'
import { ScoringRulesPrimaryButtons } from './components/scoring-rules-primary-buttons'
import { ScoringRulesProvider } from './components/scoring-rules-provider'
import { ScoringRulesTable } from './components/scoring-rules-table'

type Props = { testId: number; testName?: string }

export function ScoringRules({ testId, testName }: Props) {
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: scoringRulesQueryKey(testId),
    queryFn: () => getAllScoringRulesForTest(testId),
  })

  return (
    <ScoringRulesProvider>
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
              <ArrowLeft className='size-4' /> Back to Psychology Tests
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Scoring Rules{testName ? ` — ${testName}` : ''}
              </h2>
              <p className='text-muted-foreground'>
                Manage scoring rules for this psychology test.
              </p>
            </div>
          </div>
          <ScoringRulesPrimaryButtons />
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
            Failed to load scoring rules:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        )}

        {data && <ScoringRulesTable data={data} />}
      </Main>

      <ScoringRulesDialogs testId={testId} />
    </ScoringRulesProvider>
  )
}
