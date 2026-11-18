import { Pressable, Text, View } from 'react-native';

import type { CalendarEvent } from '../../../types/ifsp-content';
import { buildMonthGrid, eventCoversDate } from '../../../utils/calendar-grid';
import { CALENDAR_CATEGORY_STYLES } from '../constants';

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// Categorias que anulam o dia letivo.
const NON_SCHOOL_CATEGORIES = ['feriado', 'recesso'];

// Dia letivo = segunda a sexta, sem feriado/recesso (ou dia marcado como "aula").
function isSchoolDay(dateKey: string, dayEvents: CalendarEvent[]): boolean {
  if (dayEvents.some((event) => NON_SCHOOL_CATEGORIES.includes(event.category))) {
    return false;
  }
  if (dayEvents.some((event) => event.category === 'aula')) return true;
  const weekday = new Date(`${dateKey}T12:00:00`).getDay();
  return weekday >= 1 && weekday <= 5;
}

type MonthGridProps = {
  year: number;
  month: number;
  events: CalendarEvent[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
};

export function MonthGrid({
  year,
  month,
  events,
  selectedDate,
  onSelectDate,
}: MonthGridProps) {
  const weeks = buildMonthGrid(year, month);

  return (
    <View className="rounded-2xl border border-gray-200 bg-white p-2">
      <View className="flex-row">
        {WEEKDAYS.map((label, index) => (
          <Text
            key={`${label}-${index}`}
            className="flex-1 py-1 text-center text-xs font-semibold text-gray-500"
            accessibilityElementsHidden
            importantForAccessibility="no"
          >
            {label}
          </Text>
        ))}
      </View>
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className="flex-row">
          {week.map((dateKey, dayIndex) => {
            if (!dateKey) return <View key={dayIndex} className="m-0.5 h-11 flex-1" />;

            const dayEvents = events.filter((event) => eventCoversDate(event, dateKey));
            const selected = selectedDate === dateKey;
            const day = Number(dateKey.slice(8));
            const firstCategory = dayEvents[0]?.category;

            // Dia com evento: círculo preenchido com a cor da categoria.
            // Dia selecionado: contorno escuro (ou verde da marca se não tiver evento).
            const fill = firstCategory
              ? CALENDAR_CATEGORY_STYLES[firstCategory].dot
              : selected
                ? 'bg-brand'
                : '';
            const ring = selected && firstCategory ? 'border-gray-900' : 'border-transparent';
            const hasColor = Boolean(firstCategory) || selected;

            // Verde bem claro, quase transparente, nos dias letivos.
            const cellBg = isSchoolDay(dateKey, dayEvents) ? 'bg-[#3A9A55]/10' : '';

            return (
              <Pressable
                key={dateKey}
                onPress={() => onSelectDate(selected ? null : dateKey)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Dia ${day}${
                  dayEvents.length ? `, ${dayEvents.length} evento(s)` : ', sem eventos'
                }`}
                className={`m-0.5 h-11 flex-1 items-center justify-center rounded-xl ${cellBg}`}
              >
                <View
                  className={`h-9 w-9 items-center justify-center rounded-full border-2 ${fill} ${ring}`}
                >
                  <Text
                    className={hasColor ? 'font-semibold text-white' : 'text-gray-900'}
                  >
                    {day}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}