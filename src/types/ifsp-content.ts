import { z } from 'zod';

const idSchema = z.union([z.string(), z.number()]).transform(String);
const httpUrlSchema = z
  .string()
  .url()
  .refine((value) => /^https?:\/\//i.test(value), 'URL deve usar http ou https');
// Aceita "2026-03-10" ou ISO completo e mantém só a data (evita bug de fuso).
const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}/)
  .transform((value) => value.slice(0, 10));

// ---------- Homenagens ----------
export const reactionSchema = z.object({
  emoji: z.string(),
  count: z.number().int().nonnegative(),
  reactedByMe: z.boolean().default(false),
});
export type TributeReaction = z.infer<typeof reactionSchema>;

export const tributeSchema = z.object({
  id: idSchema,
  name: z.string(),
  role: z.string().nullish(),
  period: z.string().nullish(),
  summary: z.string(),
  biography: z.string().nullish(),
  photoUrl: httpUrlSchema.nullish(),
  likesCount: z.number().int().nonnegative().default(0),
  likedByMe: z.boolean().default(false),
  reactions: z.array(reactionSchema).default([]),
});
export type Tribute = z.infer<typeof tributeSchema>;

// ---------- Calendário acadêmico ----------
export const CALENDAR_CATEGORIES = [
  'aula',
  'prova',
  'prazo',
  'feriado',
  'recesso',
  'outro',
] as const;
export type CalendarCategory = (typeof CALENDAR_CATEGORIES)[number];

export const calendarEventSchema = z.object({
  id: idSchema,
  title: z.string(),
  description: z.string().nullish(),
  startDate: dateOnlySchema,
  endDate: dateOnlySchema.nullish(),
  category: z.enum(CALENDAR_CATEGORIES).catch('outro'),
});
export type CalendarEvent = z.infer<typeof calendarEventSchema>;

// ---------- Documentos e editais ----------
export const DOCUMENT_CATEGORIES = [
  'edital',
  'resolucao',
  'portaria',
  'outro',
] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export const ifspDocumentSchema = z.object({
  id: idSchema,
  title: z.string(),
  description: z.string().nullish(),
  category: z.enum(DOCUMENT_CATEGORIES).catch('outro'),
  publishedAt: z.string(),
  fileUrl: httpUrlSchema,
  mimeType: z.string().nullish(),
  fileSizeBytes: z.number().nullish(),
});
export type IfspDocument = z.infer<typeof ifspDocumentSchema>;

export type DocumentsFilters = { category?: DocumentCategory; search?: string };
export type CalendarMonth = { year: number; month: number }; // month: 1-12