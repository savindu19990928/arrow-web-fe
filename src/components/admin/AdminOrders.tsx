import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { api, asList } from '../../utils/api';
import { errorMessage } from '../../utils/apiError';
import { formatDate, formatLKR, humanize } from '../../utils/format';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import { StatusBadge } from '../ui/StatusBadge';
import { Pager } from '../ui/Pager';
import type { OrderStatus, OrderSummary, Paginated } from '../../types/api';

const statuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'HANDED_OVER', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'RETURNED'];
const PAGE_SIZE = 20;

export function AdminOrders() {
  const [filters, setFilters] = useState({ status: '', payment_status: '', payment_method: '', search: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useApi(
    () => api<Paginated<OrderSummary>>('/api/admin/orders/', { query: { ...filters, ordering: '-placed_at', page, page_size: PAGE_SIZE } }),
    [filters.status, filters.payment_status, filters.payment_method, filters.search, page]
  );
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ status: 'PROCESSING' as OrderStatus, courier_name: '', tracking_number: '', note: '' });
  const [busy, setBusy] = useState(false);
  const orders = asList(data);

  const setFilter = (k: keyof typeof filters, v: string) => {
    setFilters((f) => ({ ...f, [k]: v }));
    setPage(1);
  };

  const open = (o: OrderSummary) => {
    setEditing(o.id);
    setForm({ status: o.status, courier_name: '', tracking_number: '', note: '' });
  };

  const save = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api(`/api/admin/orders/${id}/update-status/`, { method: 'POST', body: form });
      toast.success('Order status updated — customer notified.');
      setEditing(null);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setFilter('search', search.trim());
          }}
          className="flex items-center gap-2 rounded-xl border border-line px-3 focus-within:border-ink sm:col-span-2 lg:col-span-1">
          
          <SearchIcon className="h-4 w-4 text-muted" aria-hidden="true" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Order number, name, email…" className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none" aria-label="Search orders" />
        </form>
        <select className="input" value={filters.status} onChange={(e) => setFilter('status', e.target.value)} aria-label="Order status">
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
        </select>
        <select className="input" value={filters.payment_status} onChange={(e) => setFilter('payment_status', e.target.value)} aria-label="Payment status">
          <option value="">All payments</option>
          {['PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED'].map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
        </select>
        <select className="input" value={filters.payment_method} onChange={(e) => setFilter('payment_method', e.target.value)} aria-label="Payment method">
          <option value="">All methods</option>
          {['BANK_TRANSFER', 'KOKO', 'MINTPAY', 'CARD_ONLINE'].map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
        </select>
      </div>

      <div className="mt-6">
        {loading ?
        <Spinner /> :
        error ?
        <ErrorState message={error} onRetry={reload} /> :
        orders.length === 0 ?
        <p className="rounded-2xl bg-surface p-8 text-center text-sm text-muted">No orders match these filters.</p> :

        <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-ink text-left">
                  <th scope="col" className="py-3 font-semibold">Order</th>
                  <th scope="col" className="py-3 font-semibold">Customer</th>
                  <th scope="col" className="py-3 font-semibold">Status</th>
                  <th scope="col" className="py-3 font-semibold">Payment</th>
                  <th scope="col" className="py-3 text-right font-semibold">Total</th>
                  <th scope="col" className="py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((o) =>
              <React.Fragment key={o.id}>
                    <tr>
                      <td className="py-3">
                        <Link to={`/account/orders/${o.id}`} className="font-mono font-semibold hover:underline">{o.order_number}</Link>
                        <p className="text-xs text-muted">{formatDate(o.placed_at)}</p>
                      </td>
                      <td className="py-3">{o.customer_name}</td>
                      <td className="py-3"><StatusBadge status={o.status} /></td>
                      <td className="py-3"><span className="mr-2 text-xs text-muted">{humanize(o.payment_method)}</span><StatusBadge status={o.payment_status} /></td>
                      <td className="py-3 text-right font-semibold">{formatLKR(o.total_amount)}</td>
                      <td className="py-3 text-right">
                        <button type="button" className="text-xs font-semibold underline underline-offset-2" onClick={() => editing === o.id ? setEditing(null) : open(o)}>
                          {editing === o.id ? 'Close' : 'Update'}
                        </button>
                      </td>
                    </tr>
                    {editing === o.id &&
                <tr>
                        <td colSpan={6} className="bg-surface p-4">
                          <form onSubmit={(e) => save(e, o.id)} className="grid gap-3 md:grid-cols-5">
                            <select className="input" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as OrderStatus }))} aria-label="New status">
                              {statuses.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
                            </select>
                            <input className="input" placeholder="Courier name" value={form.courier_name} onChange={(e) => setForm((f) => ({ ...f, courier_name: e.target.value }))} aria-label="Courier name" />
                            <input className="input" placeholder="Tracking number" value={form.tracking_number} onChange={(e) => setForm((f) => ({ ...f, tracking_number: e.target.value }))} aria-label="Tracking number" />
                            <input className="input" placeholder="Note for customer" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} aria-label="Note" />
                            <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
                          </form>
                        </td>
                      </tr>
                }
                  </React.Fragment>
              )}
              </tbody>
            </table>
          </div>
        }
        <Pager page={page} total={data?.count ?? 0} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>
    </div>);

}