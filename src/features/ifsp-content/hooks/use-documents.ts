import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { fetchDocuments } from '../../../services/api/ifsp-content-service';
import { ifspContentKeys } from '../../../services/query/ifsp-content-keys';
import type { DocumentsFilters } from '../../../types/ifsp-content';

export function useDocuments(filters: DocumentsFilters) {
  return useQuery({
    queryKey: ifspContentKeys.documents(filters),
    queryFn: () => fetchDocuments(filters),
    placeholderData: keepPreviousData,
  });
}
