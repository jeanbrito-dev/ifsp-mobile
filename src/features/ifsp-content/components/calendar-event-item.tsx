
import { Text, View } from 'react-native';

import type { CalendarCategory, CalendarEvent } from '../../../types/ifsp-content';
import { formatShortDate } from '../../../utils/format-date';
import { CALENDAR_CATEGORY_STYLES } from '../constants';

const CARD_THEME: Record<
  CalendarCategory,
  { card: string; circle: string; title: string; sub: string }
> = {
  aula: {
    card: 'bg-brand',
    circle: 'bg-white/20',
    title: 'text-white',
    sub: 'text-white/80',
  },
  prova: {
    card: 'bg-accent',
    circle: 'bg-black/10',
    title: 'text-gray-900',
    sub: 'text-gray-900/70',
  },
  prazo: {
    card: 'bg-accent',
    circle: 'bg-black/10',
    title: 'text-gray-900',
    sub: 'text-gray-900/70',
  },
  feriado: {
    card: 'bg-red-700',
    circle: 'bg-white/20',
    title: 'text-white',
    sub: 'text-white/80',
  },
  recesso: {
    card: 'bg-gray-500',
    circle: 'bg-white/20',
    title: 'text-white',
    sub: 'text-white/80',
  },
  outro: {
    card: 'bg-gray-500',
    circle: 'bg-white/20',
    title: 'text-white',
    sub: 'text-white/80',
  },
};

export function CalendarEventItem({ event }: { event: CalendarEvent }) {
  const style = CALENDAR_CATEGORY_STYLES[event.category];
  const theme = CARD_THEME[event.category];

  const day = Number(event.startDate.slice(8, 10));
  const period =
    event.endDate && event.endDate !== event.startDate
      ? `${formatShortDate(event.startDate)} – ${formatShortDate(event.endDate)}`
      : formatShortDate(event.startDate);

  return (
    <View
      accessible
      accessibilityLabel={`${style.label}: ${event.title}, ${period}`}
     className={`flex-row items-center gap-4 rounded-2xl px-4 py-3 mb-3 ${theme.card}`}
    >
      <View
        className={`h-10 w-10 items-center justify-center rounded-full ${theme.circle}`}
      >
        <Text className={`text-base font-bold ${theme.title}`}>
          {day}
        </Text>
      </View>

      <View className="flex-1 gap-0.5">
        <Text
          numberOfLines={2}
          className={`text-base font-semibold ${theme.title}`}
        >
          {event.title}
        </Text>

        <Text className={`text-sm ${theme.sub}`}>
          {style.label} · {period}
        </Text>

        {event.description ? (
          <Text numberOfLines={2} className={`text-sm ${theme.sub}`}>
            {event.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
