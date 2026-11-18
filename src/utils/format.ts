export function formatLKR(value: string | number | null | undefined): string {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  if (Number.isNaN(n)) return 'Rs. 0';
  return `Rs. ${n.toLocaleString('en-LK', { maximumFractionDigits: n % 1 === 0 ? 0 : 2, minimumFractionDigits: 0 })}`;
}

export function formatDate(value: string | null | undefined, withTime = false): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {})
  });
}

export function humanize(value: string): string {
  return value.
  replace(/_/g, ' ').
  toLowerCase().
  replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}