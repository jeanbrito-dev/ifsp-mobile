
import type { CalendarCategory, DocumentCategory } from '../../types/ifsp-content';

export const CALENDAR_CATEGORY_STYLES: Record<
  CalendarCategory,
  { label: string; badge: string; text: string; dot: string }
> = {
  aula: {
    label: 'Aulas',
    badge: 'bg-brand/10',
    text: 'text-brand',
    dot: 'bg-brand',
  },
  prova: {
    label: 'Provas',
    badge: 'bg-accent/40',
    text: 'text-gray-900',
    dot: 'bg-accent',
  },
  prazo: {
    label: 'Prazos',
    badge: 'bg-accent/40',
    text: 'text-gray-900',
    dot: 'bg-accent',
  },
  feriado: {
    label: 'Feriado',
    badge: 'bg-red-700/10',
    text: 'text-red-700',
    dot: 'bg-red-700',
  },
  recesso: {
    label: 'Recesso',
    badge: 'bg-gray-100',
    text: 'text-gray-500',
    dot: 'bg-gray-500',
  },
  outro: {
    label: 'Outro',
    badge: 'bg-gray-100',
    text: 'text-gray-500',
    dot: 'bg-gray-500',
  },
};

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  edital: 'Editais',
  resolucao: 'Resoluções',
  portaria: 'Portarias',
  outro: 'Outros',
};

// Interações das homenagens
export const TRIBUTE_INTERACTIONS_ENABLED = true;

export const TRIBUTE_REACTIONS = [
  { emoji: '👏', label: 'Aplauso' },
  { emoji: '🙏', label: 'Gratidão' },
  { emoji: '❤️', label: 'Coração' },
  { emoji: '😢', label: 'Saudade' },
  { emoji: '🎉', label: 'Celebração' },
] as const;
