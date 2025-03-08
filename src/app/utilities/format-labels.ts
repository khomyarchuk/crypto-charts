export function formatLabels(timestamps: number[], interval: string): string[] {
  return timestamps.map((timestamp) => {
    const date = new Date(timestamp);
    if (interval === '1h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (interval === '1d') {
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    } else {
      return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    }
  });
}
