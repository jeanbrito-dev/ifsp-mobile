function parseDateOnly(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(value: string): string {
  return parseDateOnly(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(value: string): string {
  return parseDateOnly(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

export function formatMonthYear(year: number, month: number): string {
  const label = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
