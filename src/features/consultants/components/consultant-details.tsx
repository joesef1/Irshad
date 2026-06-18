import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  ShieldOff,
  Trash2,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  approveConsultant,
  blockConsultant,
  consultantDetailQueryKey,
  consultantsQueryKey,
  deleteConsultant,
  getConsultantById,
} from '../api/consultants-api'

type Props = {
  consultantId: string
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  return (
    <div className='flex flex-col gap-0.5'>
      <span className='text-xs text-muted-foreground'>{label}</span>
      <span className='text-sm font-medium'>{value ?? '—'}</span>
    </div>
  )
}

function FileLink({
  label,
  url,
}: {
  label: string
  url: string | null | undefined
}) {
  if (!url) return null
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted'
    >
      <FileText className='size-4 text-muted-foreground' />
      {label}
    </a>
  )
}

export function ConsultantDetails({ consultantId }: Props) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const {
    data: consultant,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: consultantDetailQueryKey(consultantId),
    queryFn: () => getConsultantById(consultantId),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: consultantsQueryKey })
    queryClient.invalidateQueries({
      queryKey: consultantDetailQueryKey(consultantId),
    })
  }

  const approveMutation = useMutation({
    mutationFn: () => approveConsultant(consultantId),
    onSuccess: () => {
      toast.success('Consultant approval status updated')
      invalidate()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const blockMutation = useMutation({
    mutationFn: () => blockConsultant(consultantId),
    onSuccess: () => {
      toast.success('Consultant block status updated')
      invalidate()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteConsultant(consultantId),
    onSuccess: () => {
      toast.success('Consultant deleted')
      queryClient.invalidateQueries({ queryKey: consultantsQueryKey })
      navigate({ to: '/Consultant' })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const isBusy =
    approveMutation.isPending ||
    blockMutation.isPending ||
    deleteMutation.isPending

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4'>
        <Skeleton className='h-10 w-32' />
        <Skeleton className='h-48 w-full rounded-xl' />
        <Skeleton className='h-48 w-full rounded-xl' />
      </div>
    )
  }

  if (isError || !consultant) {
    return (
      <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-destructive dark:bg-red-950/20'>
        Failed to load consultant:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    )
  }

  const initials = (consultant.fullName ?? consultant.userName)
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const hasFiles =
    consultant.identityFileUrl ||
    consultant.qualificationFileUrl ||
    consultant.addressFileUrl ||
    consultant.personalFileUrl

  return (
    <div className='flex flex-col gap-6'>
      {/* Back + Actions */}
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => navigate({ to: '/Consultant' })}
          className='gap-1.5'
        >
          <ArrowLeft className='size-4' />
          Back to Consultants
        </Button>

        <div className='flex flex-wrap gap-2'>
          <Button
            variant='outline'
            size='sm'
            disabled={isBusy}
            onClick={() => approveMutation.mutate()}
            className='gap-1.5'
          >
            <ShieldCheck className='size-4' />
            {approveMutation.isPending ? 'Updating…' : 'Toggle Approve'}
          </Button>

          <Button
            variant='outline'
            size='sm'
            disabled={isBusy}
            onClick={() => blockMutation.mutate()}
            className='gap-1.5 text-amber-600 hover:text-amber-600'
          >
            <ShieldOff className='size-4' />
            {blockMutation.isPending ? 'Updating…' : 'Toggle Block'}
          </Button>

          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant='destructive'
                size='sm'
                disabled={isBusy}
                className='gap-1.5'
              >
                <Trash2 className='size-4' />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete consultant?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete{' '}
                  <strong>{consultant.fullName ?? consultant.userName}</strong>.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate()}
                  className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                >
                  {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Profile header */}
      <Card>
        <CardContent className='flex flex-wrap items-center gap-4 pt-6'>
          <Avatar className='size-16'>
            <AvatarFallback className='text-lg'>{initials}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-1'>
            <h2 className='text-xl font-semibold'>
              {consultant.fullName ?? consultant.userName}
            </h2>
            <span className='text-sm text-muted-foreground'>
              @{consultant.userName}
            </span>
            <div className='mt-1 flex flex-wrap gap-1'>
              {consultant.specialization?.map((s) => (
                <Badge key={s} variant='secondary' className='text-xs'>
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal info */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-base'>
            <User className='size-4' />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3'>
            <InfoRow label='Email' value={consultant.email} />
            <InfoRow label='Phone' value={consultant.phoneNumber} />
            <InfoRow label='WhatsApp' value={consultant.whatsAppNumber} />
            <InfoRow label='Nationality' value={consultant.nationality} />
            <InfoRow label='Gender' value={consultant.gender} />
            <InfoRow label='Marital Status' value={consultant.maritalStatus} />
            <InfoRow
              label='Identity Number'
              value={consultant.identityNumber}
            />
            <InfoRow label='Qualification' value={consultant.qualification} />
            <InfoRow
              label='Experience'
              value={
                consultant.experienceYears
                  ? `${consultant.experienceYears} years`
                  : null
              }
            />
            <InfoRow
              label='Joined'
              value={
                consultant.createdDate
                  ? new Date(consultant.createdDate).toLocaleDateString()
                  : null
              }
            />
          </div>

          {consultant.userContactTimes &&
            consultant.userContactTimes.length > 0 && (
              <>
                <Separator className='my-4' />
                <div className='flex flex-col gap-2'>
                  <span className='text-xs text-muted-foreground'>
                    Contact Times
                  </span>
                  <div className='flex flex-wrap gap-2'>
                    {consultant.userContactTimes.map((t, i) => (
                      <Badge key={i} variant='outline'>
                        {t.start} – {t.end}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
        </CardContent>
      </Card>

      {/* Uploaded files */}
      {hasFiles && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <FileText className='size-4' />
              Uploaded Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
              <FileLink
                label='Identity Document'
                url={consultant.identityFileUrl}
              />
              <FileLink
                label='Qualification Certificate'
                url={consultant.qualificationFileUrl}
              />
              <FileLink label='Address Proof' url={consultant.addressFileUrl} />
              <FileLink
                label='Personal / CV'
                url={consultant.personalFileUrl}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
