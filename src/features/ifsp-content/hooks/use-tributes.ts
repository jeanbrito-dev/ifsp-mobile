import { useQuery } from '@tanstack/react-query';

import { fetchTributes } from '../../../services/api/ifsp-content-service';
import { ifspContentKeys } from '../../../services/query/ifsp-content-keys';

export function useTributes() {
  return useQuery({ queryKey: ifspContentKeys.tributes(), queryFn: fetchTributes });
}
