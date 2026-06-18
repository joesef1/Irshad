import { z } from 'zod'

export const psychologyTestSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  isFree: z.boolean(),
  reportRequiresPurchase: z.boolean(),
  price: z.number().nullable(),
  urlImage: z.string().nullable(),
  createdDate: z.string().nullable(),
})

export type PsychologyTest = z.infer<typeof psychologyTestSchema>
