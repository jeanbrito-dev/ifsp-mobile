import { useQuery } from '@tanstack/react-query';

import { fetchTribute } from '../../../services/api/ifsp-content-service';
import { ifspContentKeys } from '../../../services/query/ifsp-content-keys';

export function useTribute(id: string) {
  return useQuery({
    queryKey: ifspContentKeys.tribute(id),
    queryFn: () => fetchTribute(id),
    enabled: Boolean(id),
  });
}
