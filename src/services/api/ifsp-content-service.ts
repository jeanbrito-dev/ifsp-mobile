import { z } from 'zod';

import {
  type CalendarEvent,
  type CalendarMonth,
  type DocumentsFilters,
  type IfspDocument,
  type Tribute,
} from '../../types/ifsp-content';
import { withLike, withReaction } from '../../utils/tribute-interactions';
import { apiClient } from './client';
import {
  DOCUMENT_CATEGORY_TO_ENUM,
  documentoWireSchema,
  eventoCalendarioWireSchema,
  homenagemWireSchema,
} from './ifsp-content-mappers';
import {
  mockCalendar,
  mockDocuments,
  mockTributes,
  mockUpdateTribute,
} from './ifsp-content-mocks';

// Rotas ASSUMIDAS (seguem os @@map do schema Prisma). Ajuste aqui se o backend usar outros caminhos.
const ENDPOINTS = {
  tributes: '/homenagens',
  calendar: '/eventos-calendario',
  documents: '/documentos',
} as const;

// Só para desenvolvimento: EXPO_PUBLIC_USE_MOCKS=true no .env
const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS === 'true';

/** Aceita resposta direta ou embrulhada em { data | items | results }. */
function unwrap(payload: unknown): unknown {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;
    for (const key of ['data', 'items', 'results']) {
      if (key in record) return record[key];
    }
  }
  return payload;
}

const pad = (value: number) => String(value).padStart(2, '0');

// ---------- Homenagens ----------
export async function fetchTributes(): Promise<Tribute[]> {
  if (USE_MOCKS) return [...mockTributes];
  const { data } = await apiClient.get<unknown>(ENDPOINTS.tributes);
  return z.array(homenagemWireSchema).parse(unwrap(data));
}

export async function fetchTribute(id: string): Promise<Tribute> {
  if (USE_MOCKS) {
    const found = mockTributes.find((item) => item.id === id);
    if (!found) throw new Error('Homenagem não encontrada');
    return found;
  }
  const { data } = await apiClient.get<unknown>(`${ENDPOINTS.tributes}/${id}`);
  return homenagemWireSchema.parse(unwrap(data));
}

// Curtidas/reações: o backend ainda não tem esses endpoints (UI desligada por
// TRIBUTE_INTERACTIONS_ENABLED). Mantidos para quando existirem.
export async function setTributeLike(id: string, liked: boolean): Promise<void> {
  if (USE_MOCKS) {
    mockUpdateTribute(id, (tribute) => withLike(tribute, liked));
    return;
  }
  if (liked) await apiClient.post(`${ENDPOINTS.tributes}/${id}/like`);
  else await apiClient.delete(`${ENDPOINTS.tributes}/${id}/like`);
}

export async function setTributeReaction(
  id: string,
  emoji: string,
  active: boolean,
): Promise<void> {
  if (USE_MOCKS) {
    mockUpdateTribute(id, (tribute) => withReaction(tribute, emoji, active));
    return;
  }
  if (active) {
    await apiClient.post(`${ENDPOINTS.tributes}/${id}/reactions`, { emoji });
  } else {
    await apiClient.delete(
      `${ENDPOINTS.tributes}/${id}/reactions/${encodeURIComponent(emoji)}`,
    );
  }
}

// ---------- Calendário acadêmico ----------
export async function fetchAcademicCalendar({
  year,
  month,
}: CalendarMonth): Promise<CalendarEvent[]> {
  if (USE_MOCKS) return mockCalendar({ year, month });
  const { data } = await apiClient.get<unknown>(ENDPOINTS.calendar, {
    params: { anoLetivo: year },
  });
  const events = z.array(eventoCalendarioWireSchema).parse(unwrap(data));

  // Garante só o mês pedido, mesmo se o backend devolver o ano inteiro.
  // Comparação de strings AAAA-MM-DD funciona de forma lexicográfica.
  const first = `${year}-${pad(month)}-01`;
  const last = `${year}-${pad(month)}-31`;
  return events.filter(
    (event) => event.startDate <= last && (event.endDate ?? event.startDate) >= first,
  );
}

// ---------- Documentos e editais ----------
export async function fetchDocuments(filters: DocumentsFilters): Promise<IfspDocument[]> {
  if (USE_MOCKS) {
    const term = filters.search?.toLowerCase();
    return mockDocuments.filter(
      (item) =>
        (!filters.category || item.category === filters.category) &&
        (!term || item.title.toLowerCase().includes(term)),
    );
  }
  const { data } = await apiClient.get<unknown>(ENDPOINTS.documents, {
    params: {
      categoria: filters.category ? DOCUMENT_CATEGORY_TO_ENUM[filters.category] : undefined,
    },
  });
  const term = filters.search?.trim().toLowerCase();

  // Filtros também no app, caso o backend não os aplique.
  return z
    .array(documentoWireSchema)
    .parse(unwrap(data))
    .filter(({ ativo }) => ativo)
    .map(({ document }) => document)
    .filter(
      (item) =>
        (!filters.category || item.category === filters.category) &&
        (!term ||
          item.title.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term)),
    )
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function fetchDocument(id: string): Promise<IfspDocument> {
  if (USE_MOCKS) {
    const found = mockDocuments.find((item) => item.id === id);
    if (!found) throw new Error('Documento não encontrado');
    return found;
  }
  const { data } = await apiClient.get<unknown>(`${ENDPOINTS.documents}/${id}`);
  return documentoWireSchema.parse(unwrap(data)).document;
}