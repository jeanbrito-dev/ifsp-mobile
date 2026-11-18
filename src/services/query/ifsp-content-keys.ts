import type { CalendarMonth, DocumentsFilters } from '../../types/ifsp-content';

const root = ['ifsp-content'] as const;

export const ifspContentKeys = {
  all: root,
  tributes: () => [...root, 'tributes'] as const,
  tribute: (id: string) => [...root, 'tributes', id] as const,
  calendar: (month: CalendarMonth) => [...root, 'calendar', month] as const,
  documents: (filters: DocumentsFilters) => [...root, 'documents', filters] as const,
  document: (id: string) => [...root, 'documents', 'detail', id] as const,
};
