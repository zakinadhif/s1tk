import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const topics = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200),
    subject: z.string(),
    courseCode: z.string(),
    semester: z.number().int().min(1).max(8),
    week: z.number().int().optional(),
    order: z.number().int(),
    type: z.enum(['aktivitas', 'materi', 'kuis', 'praktikum', 'referensi']),
    renderMode: z.enum(['standard', 'video-sync']).default('standard'),
    tags: z.array(z.string()).default([]),
    prereq: z.array(z.string()).default([]),
    learningObjectives: z.array(z.string()).optional(),
    estimatedMinutes: z.number().int().optional(),
    videoId: z.string().optional(),
    videoSectionMap: z.array(z.object({
      id: z.string(),
      start: z.number(),
      end: z.number(),
    })).optional(),
  }),
});

export const collections = { topics };
