import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { fetchAcademicCalendar } from '../../../services/api/ifsp-content-service';
import { ifspContentKeys } from '../../../services/query/ifsp-content-keys';
import type { CalendarMonth } from '../../../types/ifsp-content';

export function useAcademicCalendar(month: CalendarMonth) {
  return useQuery({
    queryKey: ifspContentKeys.calendar(month),
    queryFn: () => fetchAcademicCalendar(month),
    placeholderData: keepPreviousData,
  });
}
