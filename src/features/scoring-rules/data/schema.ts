import { z } from 'zod'

export const scoringRuleSchema = z.object({
  id: z.number(),
  psychologyTestId: z.number(),
  psychologyTest: z.string().nullable(),
  minScore: z.number(),
  maxScore: z.number(),
  reportDetails: z.string(),
})

export type ScoringRule = z.infer<typeof scoringRuleSchema>
