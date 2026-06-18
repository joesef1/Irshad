import { z } from 'zod'

export const testOptionSchema = z.object({
  id: z.number(),
  optionText: z.string(),
  scoreValue: z.number(),
  testQuestionId: z.number(),
})

export const testQuestionSchema = z.object({
  id: z.number(),
  questionText: z.string(),
  testSectionId: z.number(),
  testSectionTitle: z.string().nullable(),
  testSectionDescription: z.string().nullable(),
  options: z.array(testOptionSchema),
})

export type TestOption = z.infer<typeof testOptionSchema>
export type TestQuestion = z.infer<typeof testQuestionSchema>
