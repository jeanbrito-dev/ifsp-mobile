
import { apiClient } from './client';

import type { EventComment } from '../../features/events/types';

interface ApiComentario {
  id: string;
  conteudo: string;
  criadoEm: string;

  usuario: {
    id: string;
    nome: string;
  };
}

function mapearComentario(
  comentario: ApiComentario,
): EventComment {
  const data = new Date(comentario.criadoEm);

  const createdAtLabel = Number.isNaN(data.getTime())
    ? ''
    : `${data.toLocaleDateString('pt-BR')} • ${data.toLocaleTimeString(
        'pt-BR',
        {
          hour: '2-digit',
          minute: '2-digit',
        },
      )}`;

  return {
    id: comentario.id,
    authorName: comentario.usuario.nome,
    message: comentario.conteudo,
    createdAtLabel,
  };
}

export const comentarioService = {
  async getByEvent(eventoId: string): Promise<EventComment[]> {
    const response = await apiClient.get<ApiComentario[]>(
      `/eventos/${eventoId}/comentarios`,
    );

    return response.data.map(mapearComentario);
  },

  async create(
    eventoId: string,
    conteudo: string,
  ): Promise<EventComment> {
    const response = await apiClient.post<ApiComentario>(
      `/eventos/${eventoId}/comentarios`,
      {
        conteudo,
      },
    );

    return mapearComentario(response.data);
  },

  async delete(
    eventoId: string,
    comentarioId: string,
  ): Promise<void> {
    await apiClient.delete(
      `/eventos/${eventoId}/comentarios/${comentarioId}`,
    );
  },
};
