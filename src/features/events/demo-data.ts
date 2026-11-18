
import type { EventComment, EventDetails } from './types';

export const DEMO_EVENTS: EventDetails[] = [
  {
    id: '1',
    title: 'Amostra Interativa de Tecnologia',
    dateLabel: '18/11',
    category: 'Tecnologia',
    institution: 'Coordenadoria IFSP',
    description:
      'Uma mostra interativa com projetos desenvolvidos pelos estudantes, apresentando novas ideias, tecnologias e experiências para toda a comunidade acadêmica.',
    location: 'Campus Caraguatatuba',
  },
  {
    id: '2',
    title: 'Festival Cultural',
    dateLabel: '19/11',
    category: 'Cultura',
    institution: 'Grêmio',
    description:
      'Um evento para celebrar a cultura, a arte e a integração entre os estudantes.',
    location: 'Auditório do campus',
  },
  {
    id: '3',
    title: 'Torneio Esportivo',
    dateLabel: '20/11',
    category: 'Esporte',
    institution: 'Coordenadoria IFSP',
    description:
      'Atividades esportivas e integração entre os estudantes do campus.',
    location: 'Quadra esportiva',
  },
  {
    id: '4',
    title: 'Semana do Meio Ambiente',
    dateLabel: '21/11',
    category: 'Meio ambiente',
    institution: 'NEABI',
    description:
      'Atividades de conscientização sobre sustentabilidade e preservação ambiental.',
    location: 'Campus Caraguatatuba',
  },
  {
    id: '5',
    title: 'Encontro de Literatura',
    dateLabel: '22/11',
    category: 'Literatura',
    institution: 'NAPNE',
    description:
      'Um encontro dedicado à leitura e à valorização da literatura.',
    location: 'Biblioteca',
  },
  {
    id: '6',
    title: 'Exposição de Arte',
    dateLabel: '23/11',
    category: 'Arte',
    institution: 'CELIN',
    description:
      'Exposição de trabalhos artísticos produzidos pela comunidade acadêmica.',
    location: 'Espaço de convivência',
  },
];

export const DEMO_INSTITUTIONS = [
  'NEABI',
  'Grêmio',
  'CELIN',
  'Coordenadoria IFSP',
  'NAPNE',
];

export const DEMO_COMMENTS: EventComment[] = [
  {
    id: '1',
    authorName: 'Júlia',
    message: 'Essa mostra vai ser incrível!',
    createdAtLabel: '18/11 • 10:20',
  },
  {
    id: '2',
    authorName: 'Amanda',
    message: 'Ansiosa para ver meu primeiro projeto!',
    createdAtLabel: '18/11 • 11:05',
  },
  {
    id: '3',
    authorName: 'Reinan',
    message: 'Aí sim, estou dentro!',
    createdAtLabel: '18/11 • 12:30',
  },
];
