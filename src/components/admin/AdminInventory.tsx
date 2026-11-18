import React, { useState } from 'react';
import { toast } from 'sonner';
import { api, asList } from '../../utils/api';
import { errorMessage } from '../../utils/apiError';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import { StockMovements } from './StockMovements';
import type { Paginated, StockLevel } from '../../types/api';

const movementTypes = ['RESTOCK', 'DAMAGE', 'CORRECTION', 'SALE'];

export function AdminInventory() {
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const { data, loading, error, reload } = useApi(
    () => api<Paginated<StockLevel>>('/api/admin/inventory/stock-levels/', { query: { low_stock: filter === 'low' ? true : undefined, out_of_stock: filter === 'out' ? true : undefined } }),
    [filter]
  );
  const [adjusting, setAdjusting] = useState<StockLevel | null>(null);
  const [form, setForm] = useState({ quantity: '', movement_type: 'RESTOCK', reason: '' });
  const [busy, setBusy] = useState(false);
  const levels = asList(data);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjusting) return;
    setBusy(true);
    try {
      await api('/api/admin/inventory/adjust/', { method: 'POST', body: { product_id: adjusting.id, quantity: Number(form.quantity), movement_type: form.movement_type, reason: form.reason } });
      toast.success(`Stock updated for ${adjusting.name}`);
      setAdjusting(null);
      setForm({ quantity: '', movement_type: 'RESTOCK', reason: '' });
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <section aria-labelledby="inv-h">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="inv-h" className="font-display text-xl font-semibold">Stock levels</h2>
          <div className="flex gap-1 rounded-full bg-surface p-1 text-xs font-semibold" role="group" aria-label="Filter stock">
            {(['all', 'low', 'out'] as const).map((f) =>
            <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f} className={`rounded-full px-3 py-1.5 ${filter === f ? 'bg-ink text-white' : ''}`}>
                {f === 'all' ? 'All' : f === 'low' ? 'Low stock' : 'Out of stock'}
              </button>
            )}
          </div>
        </div>
        <div className="mt-4">
          {loading ?
          <Spinner /> :
          error ?
          <ErrorState message={error} onRetry={reload} /> :

          <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink text-left">
                  <th scope="col" className="py-3 font-semibold">Product</th>
                  <th scope="col" className="py-3 text-right font-semibold">Stock</th>
                  <th scope="col" className="py-3"><span className="sr-only">Adjust</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {levels.map((l) =>
              <tr key={l.id} className={adjusting?.id === l.id ? 'bg-surface' : ''}>
                    <td className="py-3">
                      <p className="font-medium">{l.name}</p>
                      <p className="text-xs text-muted">{l.sku} · {l.category_name}</p>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`font-display text-lg font-bold ${l.is_out_of_stock ? 'text-sale' : l.is_low_stock ? 'text-amber-700' : ''}`}>{l.stock_quantity}</span>
                      <p className="text-[11px] text-muted">min {l.low_stock_threshold}</p>
                    </td>
                    <td className="py-3 text-right">
                      <button type="button" className="text-xs font-semibold underline underline-offset-2" onClick={() => setAdjusting(l)}>Adjust</button>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          }
        </div>
      </section>

      <form onSubmit={submit} className="h-fit space-y-4 rounded-2xl bg-surface p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-semibold">Adjust stock</h2>
        {adjusting ?
        <>
            <p className="text-sm">{adjusting.name} <span className="text-muted">· currently {adjusting.stock_quantity}</span></p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="adj-type" className="label">Movement</label>
                <select id="adj-type" className="input" value={form.movement_type} onChange={(e) => setForm((f) => ({ ...f, movement_type: e.target.value }))}>
                  {movementTypes.map((m) => <option key={m} value={m}>{m.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="adj-qty" className="label">Quantity</label>
                <input id="adj-qty" className="input" inputMode="numeric" required value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value.replace(/\D/g, '') }))} />
              </div>
            </div>
            <div>
              <label htmlFor="adj-reason" className="label">Reason</label>
              <input id="adj-reason" className="input" required placeholder="Container shipment batch #…" value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save adjustment'}</button>
              <button type="button" className="btn-outline" onClick={() => setAdjusting(null)}>Cancel</button>
            </div>
          </> :

        <p className="text-sm text-muted">Choose “Adjust” on a product to restock or correct its quantity. Every change is recorded in the stock ledger.</p>
        }
        {adjusting && <StockMovements productId={adjusting.id} />}
      </form>
    </div>);

}