
import { useQuery } from '@tanstack/react-query';

import { eventService } from '../../../services/api/event.services';

export function useEvents() {
  return useQuery({
    queryKey: ['events', 'list'],
    queryFn: () => eventService.getAll(),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', 'detail', id],
    queryFn: () => eventService.getById(id),
    enabled: Boolean(id),
  });
}
