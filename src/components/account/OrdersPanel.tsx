import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, PackageIcon } from 'lucide-react';
import { api, asList } from '../../utils/api';
import { formatDate, formatLKR } from '../../utils/format';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { StatusBadge } from '../ui/StatusBadge';
import type { OrderSummary, Paginated } from '../../types/api';

export function OrdersPanel() {
  const { data, loading, error, reload } = useApi(() => api<Paginated<OrderSummary>>('/api/orders/'));
  const orders = asList(data);

  return (
    <section aria-labelledby="orders-h">
      <h2 id="orders-h" className="font-display text-2xl font-semibold">Order history</h2>
      <div className="mt-5">
        {loading ?
        <Spinner label="Loading orders…" /> :
        error ?
        <ErrorState message={error} onRetry={reload} /> :
        orders.length === 0 ?
        <EmptyState icon={PackageIcon} title="No orders yet" text="When you place an order, it will appear here." action={<Link to="/shop" className="btn-primary">Start shopping</Link>} /> :

        <ul className="divide-y divide-line border-y border-line">
            {orders.map((o) =>
          <li key={o.id}>
                <Link to={`/account/orders/${o.id}`} className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4 hover:bg-surface/60 sm:px-2">
                  <div className="min-w-[180px] flex-1">
                    <p className="font-mono text-sm font-semibold">{o.order_number}</p>
                    <p className="text-xs text-muted">{formatDate(o.placed_at)} · {o.items_count} item{o.items_count === 1 ? '' : 's'}</p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={o.status} />
                    <StatusBadge status={o.payment_status} />
                  </div>
                  <p className="w-28 text-right font-semibold">{formatLKR(o.total_amount)}</p>
                  <ChevronRightIcon className="h-4 w-4 text-muted" aria-hidden="true" />
                </Link>
              </li>
          )}
          </ul>
        }
      </div>
    </section>);

}