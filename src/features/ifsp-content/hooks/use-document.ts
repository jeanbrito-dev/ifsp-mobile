import { useQuery } from '@tanstack/react-query';

import { fetchDocument } from '../../../services/api/ifsp-content-service';
import { ifspContentKeys } from '../../../services/query/ifsp-content-keys';

export function useDocument(id: string) {
  return useQuery({
    queryKey: ifspContentKeys.document(id),
    queryFn: () => fetchDocument(id),
    enabled: Boolean(id),
  });
}
