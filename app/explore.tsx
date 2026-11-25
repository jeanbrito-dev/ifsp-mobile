
import React from 'react';
import { useRouter } from 'expo-router';

import { ExploreScreen } from '../src/features/events/ExploreScreen';

import { useEvents } from '../src/features/events/hooks/use-events';

import { useInstituicoes } from '../src/features/instituicoes/hooks/use-instituicoes';

export default function ExploreRoute() {
  const router = useRouter();

  const eventsQuery = useEvents();
  const institutionsQuery = useInstituicoes();

  const events = eventsQuery.data ?? [];

  const institutions =
    institutionsQuery.data?.map((item) => item.nome) ?? [];

  const categories = Array.from(
    new Set(
      events
        .map((event) => event.category)
        .filter((category) => category !== 'Sem categoria'),
    ),
  );

  const loading =
    eventsQuery.isLoading || institutionsQuery.isLoading;

  const hasError =
    eventsQuery.isError || institutionsQuery.isError;

  return (
    <ExploreScreen
      events={events}
      institutions={institutions}
      categories={categories}
      loading={loading}
      errorMessage={
        hasError
          ? 'Não foi possível carregar os dados. Verifique sua conexão.'
          : null
      }
      onRetry={() => {
        void eventsQuery.refetch();
        void institutionsQuery.refetch();
      }}
      onOpenEvent={(eventId) => {
        router.push({
          pathname: '/eventos/[id]',
          params: {
            id: eventId,
          },
        });
      }}
    />
  );
}
