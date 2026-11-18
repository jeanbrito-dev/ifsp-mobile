import { z } from 'zod';

import type {
  CalendarCategory,
  CalendarEvent,
  DocumentCategory,
  IfspDocument,
  Tribute,
} from '../../types/ifsp-content';
import { resolveAssetUrl } from './asset-url';

// Schemas no formato que o BACKEND devolve (model Prisma) -> convertidos para os tipos do app.

const idSchema = z.union([z.string(), z.number()]).transform(String);
const dateOnly = (value: string) => value.slice(0, 10);

// ---------- Homenagem ----------
export const homenagemWireSchema = z
  .object({
    id: idSchema,
    titulo: z.string(),
    homenageado: z.string(),
    descricao: z.string(),
    fotoUrl: z.string().nullish(),
    data: z.string(),
  })
  .transform(
    (item): Tribute => ({
      id: item.id,
      name: item.homenageado,
      role: item.titulo,
      period: item.data.slice(0, 4),
      summary: item.descricao,
      biography: null,
      photoUrl: resolveAssetUrl(item.fotoUrl),
      // O backend ainda não tem curtidas/reações (ver TRIBUTE_INTERACTIONS_ENABLED).
      likesCount: 0,
      likedByMe: false,
      reactions: [],
    }),
  );

// ---------- Calendário ----------
const TIPO_TO_CATEGORY: Record<string, CalendarCategory> = {
  FERIADO: 'feriado',
  PROVA: 'prova',
  RECESSO: 'recesso',
  MATRICULA: 'prazo',
  INICIO_AULAS: 'aula',
  FIM_AULAS: 'aula',
  OUTRO: 'outro',
};

export const eventoCalendarioWireSchema = z
  .object({
    id: idSchema,
    titulo: z.string(),
    descricao: z.string().nullish(),
    dataInicio: z.string(),
    dataFim: z.string().nullish(),
    tipo: z.string().default('OUTRO'),
  })
  .transform(
    (item): CalendarEvent => ({
      id: item.id,
      title: item.titulo,
      description: item.descricao,
      startDate: dateOnly(item.dataInicio),
      endDate: item.dataFim ? dateOnly(item.dataFim) : null,
      category: TIPO_TO_CATEGORY[item.tipo] ?? 'outro',
    }),
  );

// ---------- Documento ----------
const CATEGORIA_TO_CATEGORY: Record<string, DocumentCategory> = {
  EDITAL: 'edital',
  PORTARIA: 'portaria',
  RESOLUCAO: 'resolucao',
  OUTRO: 'outro',
};

export const documentoWireSchema = z
  .object({
    id: idSchema,
    titulo: z.string(),
    descricao: z.string().nullish(),
    categoria: z.string(),
    arquivoPath: z.string(),
    arquivoMimetype: z.string().nullish(),
    arquivoTamanho: z.number().nullish(),
    dataPublicacao: z.string(),
    ativo: z.boolean().default(true),
  })
  .transform((item) => ({
    ativo: item.ativo,
    document: {
      id: item.id,
      title: item.titulo,
      description: item.descricao,
      category: CATEGORIA_TO_CATEGORY[item.categoria] ?? 'outro',
      publishedAt: item.dataPublicacao,
      fileUrl: resolveAssetUrl(item.arquivoPath) ?? '',
      mimeType: item.arquivoMimetype,
      fileSizeBytes: item.arquivoTamanho,
    } satisfies IfspDocument,
  }));

export const DOCUMENT_CATEGORY_TO_ENUM: Record<DocumentCategory, string> = {
  edital: 'EDITAL',
  portaria: 'PORTARIA',
  resolucao: 'RESOLUCAO',
  outro: 'OUTRO',
};