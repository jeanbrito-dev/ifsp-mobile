import type {
  CalendarEvent,
  CalendarMonth,
  IfspDocument,
  Tribute,
} from '../../types/ifsp-content';

export const mockTributes: Tribute[] = [
  {
    id: '1',
    name: 'Maria da Silva',
    role: 'Professora e pesquisadora',
    period: '1985 – 2020',
    summary: 'Dedicou mais de três décadas à formação de estudantes do IFSP.',
    biography: 'Texto longo da biografia, com a trajetória e as contribuições à instituição.',
    photoUrl: 'https://picsum.photos/seed/ifsp1/800/800',
    likesCount: 12,
    likedByMe: false,
    reactions: [
      { emoji: '👏', count: 5, reactedByMe: false },
      { emoji: '🙏', count: 3, reactedByMe: false },
    ],
  },
  {
    id: '2',
    name: 'João Pereira',
    role: 'Servidor técnico-administrativo',
    period: '1990 – 2018',
    summary: 'Referência em apoio aos estudantes e à comunidade acadêmica.',
    photoUrl: 'https://picsum.photos/seed/ifsp2/800/800',
    likesCount: 4,
    likedByMe: false,
    reactions: [],
  },
  {
    id: '3',
    name: 'Ana Souza',
    role: 'Ex-aluna e pesquisadora',
    period: '2004 – 2010',
    summary: 'Levou o nome do IFSP para congressos e premiações pelo país.',
    likesCount: 0,
    likedByMe: false,
    reactions: [],
  },
];

export function mockUpdateTribute(id: string, patch: (tribute: Tribute) => Tribute) {
  const index = mockTributes.findIndex((item) => item.id === id);
  if (index >= 0) mockTributes[index] = patch(mockTributes[index]);
}

export function mockCalendar({ year, month }: CalendarMonth): CalendarEvent[] {
  const key = (day: number) =>
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return [
    { id: `${year}${month}a`, title: 'Início das aulas', category: 'aula', startDate: key(3) },
    { id: `${year}${month}b`, title: 'Feriado', category: 'feriado', startDate: key(12) },
    {
      id: `${year}${month}c`,
      title: 'Semana de provas',
      category: 'prova',
      startDate: key(14),
      endDate: key(18),
    },
    { id: `${year}${month}d`, title: 'Atividade extra', category: 'prazo', startDate: key(22) },
    {
      id: `${year}${month}e`,
      title: 'Recesso escolar',
      category: 'recesso',
      startDate: key(27),
      endDate: key(28),
    },
  ];
}

export const mockDocuments: IfspDocument[] = [
  {
    id: '1',
    title: 'Edital 001/2026 – Processo seletivo',
    description: 'Abertura de inscrições para o processo seletivo.',
    category: 'edital',
    publishedAt: '2026-10-20',
    fileUrl: 'https://pdfobject.com/pdf/sample.pdf',
    mimeType: 'application/pdf',
    fileSizeBytes: 524288,
  },
  {
    id: '2',
    title: 'Resolução 15/2026 – Normas acadêmicas',
    category: 'resolucao',
    publishedAt: '2026-09-05',
    fileUrl: 'https://pdfobject.com/pdf/sample.pdf',
    mimeType: 'application/pdf',
  },
];