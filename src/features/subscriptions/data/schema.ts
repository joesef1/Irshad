import { z } from 'zod'

// Benefits can come back as strings or as objects with a description field
export const subscriptionBenefitSchema = z.union([
  z.string(),
  z.object({
    id: z.number().optional(),
    description: z.string(),
    benefit: z.string().optional(),
    name: z.string().optional(),
    [Symbol.iterator]: z.never().optional(),
  }),
])

export const subscriptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  // Accept both field name variants the API might return
  durationInDays: z.number().nullable().optional(),
  duration: z.number().nullable().optional(),
  price: z.number().nullable().optional(),
  benefits: z.array(z.unknown()).nullable().optional(),
})

export type SubscriptionBenefit = z.infer<typeof subscriptionBenefitSchema>
export type Subscription = z.infer<typeof subscriptionSchema>
