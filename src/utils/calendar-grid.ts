const pad = (value: number) => String(value).padStart(2, '0');

// Aulas e provas não acontecem no sábado nem no domingo
const NO_WEEKEND_CATEGORIES = ['aula', 'prova'];

export function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function isWeekend(dateKey: string): boolean {
  const [year, month, day] = dateKey.slice(0, 10).split('-').map(Number);
  const weekday = new Date(year, month - 1, day).getDay();
  return weekday === 0 || weekday === 6;
}

/** Semanas (domingo a sábado) de um mês; células fora do mês são null. month: 1-12. */
export function buildMonthGrid(year: number, month: number): (string | null)[][] {
  const leading = new Date(year, month - 1, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => toDateKey(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

type EventRange = {
  startDate: string;
  endDate?: string | null;
  category?: string;
};

export function eventCoversDate(event: EventRange, dateKey: string): boolean {
  const inRange =
    event.startDate <= dateKey && dateKey <= (event.endDate ?? event.startDate);
  if (!inRange) return false;

  if (
    event.category &&
    NO_WEEKEND_CATEGORIES.includes(event.category) &&
    isWeekend(dateKey)
  ) {
    return false;
  }
  return true;
}

/** false quando o evento só cairia em dias em que ele não pode acontecer (ex.: prova num sábado). */
export function eventHasValidDay(event: EventRange): boolean {
  const start = event.startDate.slice(0, 10);
  const end = (event.endDate ?? event.startDate).slice(0, 10);
  const [sy, sm, sd] = start.split('-').map(Number);
  const [ey, em, ed] = end.split('-').map(Number);
  const cursor = new Date(sy, sm - 1, sd);
  const last = new Date(ey, em - 1, ed);

  for (let i = 0; i < 400 && cursor <= last; i++) {
    const key = toDateKey(cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate());
    if (eventCoversDate(event, key)) return true;
    cursor.setDate(cursor.getDate() + 1);
  }
  return false;
}

export function shiftMonth(year: number, month: number, delta: number) {
  const date = new Date(year, month - 1 + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}