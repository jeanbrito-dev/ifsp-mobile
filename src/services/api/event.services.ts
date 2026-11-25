
import { apiClient } from './client';

import type {
  EventDetails,
  ExploreEvent,
} from '../../features/events/types';

interface ApiEvento {
  id: string;
  titulo: string;
  descricao: string;
  local: string | null;
  imagemUrl: string | null;
  inicioEm: string;
  finalEm: string;

  categoria?: {
    id: string;
    nome: string;
  } | null;

  instituicao?: {
    id: string;
    nome: string;
    logoUrl?: string | null;
  } | null;
}

interface ApiEventosResponse {
  data: ApiEvento[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

function formatarData(data: string): string {
  const date = new Date(data);

  if (Number.isNaN(date.getTime())) {
    return 'Data não informada';
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

function mapearEvento(evento: ApiEvento): EventDetails {
  return {
    id: evento.id,
    title: evento.titulo,
    dateLabel: formatarData(evento.inicioEm),
    category: evento.categoria?.nome ?? 'Sem categoria',
    institution: evento.instituicao?.nome ?? 'Instituição não informada',
    imageUrl: evento.imagemUrl,
    description: evento.descricao,
    location: evento.local ?? 'Local não informado',
    startDateTime: evento.inicioEm,
    endDateTime: evento.finalEm,
  };
}

export const eventService = {
  async getAll(): Promise<ExploreEvent[]> {
    const response = await apiClient.get<ApiEventosResponse>(
      '/events',
      {
        params: {
          page: 1,
          limit: 50,
          status: 'PUBLICADO',
        },
      },
    );

    return response.data.data.map(mapearEvento);
  },

  async getById(id: string): Promise<EventDetails> {
    const response = await apiClient.get<ApiEvento>(
      `/events/${id}`,
    );

    return mapearEvento(response.data);
  },
};
