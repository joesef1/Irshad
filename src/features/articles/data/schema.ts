import { z } from 'zod'

export const articleSchema = z.object({
  id: z.number(),
  title: z.string(),
  imageUrl: z.string().nullable(),
  categoryId: z.number().nullable(),
  categoryName: z.string().nullable(),
})

export type Article = z.infer<typeof articleSchema>

export const articleSectionSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
})

export type ArticleSection = z.infer<typeof articleSectionSchema>

export const articleDetailsSchema = z.object({
  id: z.number(),
  title: z.string(),
  imageUrl: z.string().nullable(),
  categoryId: z.number().nullable(),
  categoryName: z.string().nullable(),
  sections: z.array(articleSectionSchema).nullable(),
})

export type ArticleDetails = z.infer<typeof articleDetailsSchema>
