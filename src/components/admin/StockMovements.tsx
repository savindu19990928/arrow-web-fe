import React from 'react';
import { api, asList } from '../../utils/api';
import { formatDate, humanize } from '../../utils/format';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../ui/Spinner';
import type { Paginated } from '../../types/api';

interface Movement {
  id: number;
  movement_type: string;
  quantity: number;
  before_stock?: number;
  after_stock?: number;
  reason?: string;
  created_at: string;
}

export function StockMovements({ productId }: {productId: number;}) {
  const { data, loading, error } = useApi(
    () => api<Paginated<Movement> | Movement[]>('/api/admin/inventory/movements/', { query: { product_id: productId } }),
    [productId]
  );
  const rows = asList(data).slice(0, 8);

  return (
    <div className="border-t border-line pt-4">
      <h3 className="text-sm font-semibold">Recent movements</h3>
      {loading ?
      <Spinner className="py-4" /> :
      error ?
      <p className="mt-2 text-xs text-muted">{error}</p> :
      rows.length === 0 ?
      <p className="mt-2 text-xs text-muted">No stock movements recorded yet.</p> :

      <ul className="mt-2 divide-y divide-line text-xs">
          {rows.map((m) =>
        <li key={m.id} className="flex items-start justify-between gap-3 py-2">
              <div>
                <p className="font-semibold">{humanize(m.movement_type)}</p>
                {m.reason && <p className="text-muted">{m.reason}</p>}
                <p className="text-muted">{formatDate(m.created_at, true)}</p>
              </div>
              <p className="whitespace-nowrap font-mono">
                {m.before_stock ?? '—'} → {m.after_stock ?? '—'}
              </p>
            </li>
        )}
        </ul>
      }
    </div>);

}