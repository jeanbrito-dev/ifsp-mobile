
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { comentarioService } from '../../../services/api/comentario.service';

export function useEventComments(eventoId: string) {
  const queryClient = useQueryClient();

  const queryKey = ['event-comments', eventoId];

  const commentsQuery = useQuery({
    queryKey,

    queryFn: () =>
      comentarioService.getByEvent(eventoId),

    enabled: Boolean(eventoId),
  });

  const createMutation = useMutation({
    mutationFn: (conteudo: string) =>
      comentarioService.create(eventoId, conteudo),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  return {
    comments: commentsQuery.data ?? [],
    isLoading: commentsQuery.isLoading,
    isError: commentsQuery.isError,
    refetch: commentsQuery.refetch,
    createComment: createMutation.mutateAsync,
  };
}
