import React from 'react';
import { CheckIcon, XCircleIcon } from 'lucide-react';
import type { OrderStatus } from '../../types/api';

const steps: {status: OrderStatus;label: string;}[] = [
{ status: 'PENDING', label: 'Placed' },
{ status: 'CONFIRMED', label: 'Confirmed' },
{ status: 'PROCESSING', label: 'Processing' },
{ status: 'PACKED', label: 'Packed' },
{ status: 'IN_TRANSIT', label: 'In transit' },
{ status: 'DELIVERED', label: 'Delivered' }];


export function OrderTimeline({ status }: {status: OrderStatus;}) {
  if (['CANCELLED', 'RETURNED', 'REFUNDED'].includes(status)) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-surface p-4 text-sm font-medium">
        <XCircleIcon className="h-5 w-5 text-muted" aria-hidden="true" />
        This order was {status.toLowerCase()}.
      </div>);

  }
  const current = steps.findIndex((s) => s.status === status);

  return (
    <ol className="grid grid-cols-6 gap-1" aria-label="Order progress">
      {steps.map((s, i) => {
        const done = i <= current;
        return (
          <li key={s.status} className="flex flex-col items-center text-center" aria-current={i === current ? 'step' : undefined}>
            <div className="flex w-full items-center">
              <span className={`h-0.5 flex-1 ${i === 0 ? 'opacity-0' : done ? 'bg-ink' : 'bg-line'}`} />
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${done ? 'border-ink bg-ink text-white' : 'border-line bg-white text-muted'}`}>
                {done ? <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> : <span className="text-[11px] font-semibold">{i + 1}</span>}
              </span>
              <span className={`h-0.5 flex-1 ${i === steps.length - 1 ? 'opacity-0' : i < current ? 'bg-ink' : 'bg-line'}`} />
            </div>
            <span className={`mt-2 text-[11px] font-medium leading-tight sm:text-xs ${done ? 'text-ink' : 'text-muted'}`}>{s.label}</span>
          </li>);

      })}
    </ol>);

}