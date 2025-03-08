export function formatDatePeriod(timestamp: number): number {
  const date = new Date(timestamp);
  return Number(date.toISOString().slice(0, 16));
}
