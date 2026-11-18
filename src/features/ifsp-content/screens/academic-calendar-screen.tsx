import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { EmptyState, ErrorState, LoadingState } from '../../../components/ui/state-views';
import {
  eventCoversDate,
  eventHasValidDay,
  shiftMonth,
} from '../../../utils/calendar-grid';
import { formatDate, formatMonthYear } from '../../../utils/format-date';
import { getErrorMessage } from '../../../utils/get-error-message';
import { CalendarEventItem } from '../components/calendar-event-item';
import { MonthGrid } from '../components/month-grid';
import { useAcademicCalendar } from '../hooks/use-academic-calendar';
import { neutral } from '../../../theme/neutral';

export function AcademicCalendarScreen() {
  const today = new Date();
  const [period, setPeriod] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data, isPending, isError, error, refetch, isFetching } =
    useAcademicCalendar(period);

  const visibleEvents = useMemo(() => {
    const events = (data ?? [])
      .filter(eventHasValidDay)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
    return selectedDate
      ? events.filter((event) => eventCoversDate(event, selectedDate))
      : events;
  }, [data, selectedDate]);

  const changeMonth = (delta: number) => {
    setPeriod((current) => shiftMonth(current.year, current.month, delta));
    setSelectedDate(null);
  };

  const monthLabel = formatMonthYear(period.year, period.month);

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="gap-4 p-4 pb-10">
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={() => changeMonth(-1)}
          accessibilityRole="button"
          accessibilityLabel="Mês anterior"
          className="h-11 w-11 items-center justify-center rounded-full bg-gray-100"
        >
          <Ionicons name="chevron-back" size={22} color={neutral.ink} />
        </Pressable>
        <Text
          accessibilityRole="header"
          accessibilityLiveRegion="polite"
          className="text-lg font-semibold text-gray-900"
        >
          {monthLabel}
        </Text>
        <Pressable
          onPress={() => changeMonth(1)}
          accessibilityRole="button"
          accessibilityLabel="Próximo mês"
          className="h-11 w-11 items-center justify-center rounded-full bg-gray-100"
        >
          <Ionicons name="chevron-forward" size={22} color={neutral.ink} />
        </Pressable>
      </View>

      {isPending ? (
        <View className="h-64">
          <LoadingState label="Carregando calendário…" />
        </View>
      ) : isError ? (
        <View className="h-64">
          <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
        </View>
      ) : (
        <>
          <MonthGrid
            year={period.year}
            month={period.month}
            events={data}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-900">
              {selectedDate ? formatDate(selectedDate) : `Eventos de ${monthLabel}`}
            </Text>
            {isFetching ? (
              <Text className="text-xs text-gray-500">Atualizando…</Text>
            ) : null}
          </View>

          {visibleEvents.length === 0 ? (
            <View className="h-48">
              <EmptyState
                icon="calendar-clear-outline"
                title="Sem eventos"
                description={
                  selectedDate
                    ? 'Nenhum evento neste dia.'
                    : 'Nenhum evento cadastrado neste mês.'
                }
              />
            </View>
          ) : (
            <View className="gap-2">
              {visibleEvents.map((event) => (
                <CalendarEventItem key={event.id} event={event} />
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}