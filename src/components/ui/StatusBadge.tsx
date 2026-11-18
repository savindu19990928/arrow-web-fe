import React from 'react';
import { humanize } from '../../utils/format';

const tone: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-900',
  CONFIRMED: 'bg-sky-100 text-sky-900',
  PROCESSING: 'bg-sky-100 text-sky-900',
  PACKED: 'bg-indigo-100 text-indigo-900',
  HANDED_OVER: 'bg-indigo-100 text-indigo-900',
  IN_TRANSIT: 'bg-indigo-100 text-indigo-900',
  REQUESTED: 'bg-amber-100 text-amber-900',
  APPROVED: 'bg-emerald-100 text-emerald-900',
  COMPLETED: 'bg-emerald-100 text-emerald-900',
  REJECTED: 'bg-red-100 text-red-900',
  DELIVERED: 'bg-emerald-100 text-emerald-900',
  SUCCESSFUL: 'bg-emerald-100 text-emerald-900',
  CANCELLED: 'bg-zinc-200 text-zinc-800',
  FAILED: 'bg-red-100 text-red-900',
  RETURNED: 'bg-zinc-200 text-zinc-800',
  REFUNDED: 'bg-zinc-200 text-zinc-800'
};

export function StatusBadge({ status }: {status: string;}) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone[status] ?? 'bg-surface text-ink'}`}>
      {humanize(status)}
    </span>);

}