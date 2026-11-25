import { useRouter } from 'expo-router';
import React from 'react';

import { ExploreScreen } from '../../src/features/events/ExploreScreen';

import {
  DEMO_EVENTS,
  DEMO_INSTITUTIONS,
} from '../../src/features/events/demo-data';

export default function ExploreRoute() {
  const router = useRouter();

  return (
    <ExploreScreen
      events={DEMO_EVENTS}
      institutions={DEMO_INSTITUTIONS}
      loading={false}
      onOpenEvent={(eventId) => {
        router.push({
          pathname: '/eventos/[id]',
          params: { id: String(eventId) },
        } as any);
      }}
    />
  );
}