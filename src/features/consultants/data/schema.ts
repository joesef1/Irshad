import { z } from 'zod'

export const consultantSchema = z.object({
  id: z.string(),
  userName: z.string(),
  fullName: z.string().nullable(),
  email: z.string(),
  phoneNumber: z.string().nullable(),
  whatsAppNumber: z.string().nullable(),
  nationality: z.string().nullable(),
  gender: z.string().nullable(),
  maritalStatus: z.string().nullable(),
  qualification: z.string().nullable(),
  experienceYears: z.string().nullable(),
  identityNumber: z.string().nullable(),
  specialization: z.array(z.string()).nullable(),
  identityFileUrl: z.string().nullable(),
  qualificationFileUrl: z.string().nullable(),
  addressFileUrl: z.string().nullable(),
  personalFileUrl: z.string().nullable(),
  createdDate: z.string().nullable(),
  userContactTimes: z
    .array(
      z.object({
        start: z.string(),
        end: z.string(),
      })
    )
    .nullable(),
})

export type Consultant = z.infer<typeof consultantSchema>

export const apiResponseSchema = z.object({
  succeeded: z.boolean(),
  status: z.string(),
  message: z.string().nullable(),
  data: z.array(consultantSchema).nullable(),
  error: z.unknown().nullable(),
})
