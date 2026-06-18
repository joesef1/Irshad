import { z } from 'zod'

export const subscriptionBenefitSchema = z.object({
  id: z.number().optional(),
  description: z.string(),
})

export const subscriptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  durationInDays: z.number().nullable(),
  price: z.number().nullable(),
  benefits: z.array(subscriptionBenefitSchema).nullable(),
})

export type SubscriptionBenefit = z.infer<typeof subscriptionBenefitSchema>
export type Subscription = z.infer<typeof subscriptionSchema>
