import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { createURL } from 'expo-linking';
import { Share } from 'react-native';

import {
  setTributeLike,
  setTributeReaction,
} from '../../../services/api/ifsp-content-service';
import { ifspContentKeys } from '../../../services/query/ifsp-content-keys';
import type { Tribute } from '../../../types/ifsp-content';
import { withLike, withReaction } from '../../../utils/tribute-interactions';

type Snapshot = { previousList?: Tribute[]; previousDetail?: Tribute };

function patchTribute(
  queryClient: QueryClient,
  id: string,
  patch: (tribute: Tribute) => Tribute,
): Snapshot {
  const listKey = ifspContentKeys.tributes();
  const detailKey = ifspContentKeys.tribute(id);
  const snapshot: Snapshot = {
    previousList: queryClient.getQueryData<Tribute[]>(listKey),
    previousDetail: queryClient.getQueryData<Tribute>(detailKey),
  };

  queryClient.setQueryData<Tribute[]>(listKey, (list) =>
    list?.map((tribute) => (tribute.id === id ? patch(tribute) : tribute)),
  );
  queryClient.setQueryData<Tribute>(detailKey, (detail) =>
    detail ? patch(detail) : detail,
  );
  return snapshot;
}

function restoreTribute(queryClient: QueryClient, id: string, snapshot?: Snapshot) {
  if (snapshot?.previousList) {
    queryClient.setQueryData(ifspContentKeys.tributes(), snapshot.previousList);
  }
  if (snapshot?.previousDetail) {
    queryClient.setQueryData(ifspContentKeys.tribute(id), snapshot.previousDetail);
  }
}

export function useToggleTributeLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, liked }: { id: string; liked: boolean }) =>
      setTributeLike(id, liked),
    onMutate: async ({ id, liked }) => {
      await queryClient.cancelQueries({ queryKey: ifspContentKeys.tributes() });
      return patchTribute(queryClient, id, (tribute) => withLike(tribute, liked));
    },
    onError: (_error, { id }, snapshot) => restoreTribute(queryClient, id, snapshot),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ifspContentKeys.tributes() }),
  });
}

export function useToggleTributeReaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, emoji, active }: { id: string; emoji: string; active: boolean }) =>
      setTributeReaction(id, emoji, active),
    onMutate: async ({ id, emoji, active }) => {
      await queryClient.cancelQueries({ queryKey: ifspContentKeys.tributes() });
      return patchTribute(queryClient, id, (tribute) =>
        withReaction(tribute, emoji, active),
      );
    },
    onError: (_error, { id }, snapshot) => restoreTribute(queryClient, id, snapshot),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ifspContentKeys.tributes() }),
  });
}

/** Junta curtir, reagir e compartilhar para as telas de homenagens. */
export function useTributeActions() {
  const like = useToggleTributeLike();
  const reaction = useToggleTributeReaction();

  return {
    toggleLike: (tribute: Tribute) =>
      like.mutate({ id: tribute.id, liked: !tribute.likedByMe }),

    toggleReaction: (tribute: Tribute, emoji: string) => {
      const reacted =
        tribute.reactions.find((item) => item.emoji === emoji)?.reactedByMe ?? false;
      reaction.mutate({ id: tribute.id, emoji, active: !reacted });
    },

    share: async (tribute: Tribute) => {
      try {
        await Share.share({
          message: `Homenagem a ${tribute.name}: ${tribute.summary}\n${createURL(
            `/panorama/homenagens/${tribute.id}`,
          )}`,
        });
      } catch {
        // compartilhamento cancelado ou indisponível neste dispositivo
      }
    },
  };
}