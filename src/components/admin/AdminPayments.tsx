import React, { useState } from 'react';
import { ExternalLinkIcon, SearchIcon } from 'lucide-react';
import { api, asList } from '../../utils/api';
import { formatDate, formatLKR, humanize } from '../../utils/format';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import { StatusBadge } from '../ui/StatusBadge';
import { Pager } from '../ui/Pager';
import type { AdminPayment, Paginated } from '../../types/api';

const PAGE_SIZE = 20;

export function AdminPayments() {
  const [filters, setFilters] = useState({ payment_method: '', status: '', submitted: '', search: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useApi(
    () => api<Paginated<AdminPayment>>('/api/admin/payments/', { query: { ...filters, ordering: '-created_at', page, page_size: PAGE_SIZE } }),
    [filters.payment_method, filters.status, filters.submitted, filters.search, page]
  );
  const rows = asList(data);

  const setFilter = (k: keyof typeof filters, v: string) => {
    setFilters((f) => ({ ...f, [k]: v }));
    setPage(1);
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Order, bank ref or transaction ID" className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none" aria-label="Search payments" />
        </form>
        <select className="input" value={filters.payment_method} onChange={(e) => setFilter('payment_method', e.target.value)} aria-label="Method">
          <option value="">All methods</option>
          {['BANK_TRANSFER', 'KOKO', 'MINTPAY', 'CARD_ONLINE'].map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
        </select>
        <select className="input" value={filters.status} onChange={(e) => setFilter('status', e.target.value)} aria-label="Status">
          <option value="">All statuses</option>
          {['PENDING', 'SUCCESSFUL', 'FAILED', 'CANCELLED', 'REFUNDED'].map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
        </select>
        <select className="input" value={filters.submitted} onChange={(e) => setFilter('submitted', e.target.value)} aria-label="Slip submitted">
          <option value="">Any slip state</option>
          <option value="true">Slip uploaded</option>
          <option value="false">Awaiting slip</option>
        </select>
      </div>

      <div className="mt-6">
        {loading ?
        <Spinner /> :
        error ?
        <ErrorState message={error} onRetry={reload} /> :
        rows.length === 0 ?
        <p className="rounded-2xl bg-surface p-8 text-center text-sm text-muted">No payments match these filters.</p> :

        <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-ink text-left">
                  <th scope="col" className="py-3 font-semibold">Order</th>
                  <th scope="col" className="py-3 font-semibold">Method</th>
                  <th scope="col" className="py-3 font-semibold">Reference</th>
                  <th scope="col" className="py-3 font-semibold">Status</th>
                  <th scope="col" className="py-3 font-semibold">Verified</th>
                  <th scope="col" className="py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((p) =>
              <tr key={p.id}>
                    <td className="py-3">
                      <p className="font-mono font-semibold">{p.order_number}</p>
                      <p className="text-xs text-muted">#{p.id} · {formatDate(p.created_at)}</p>
                    </td>
                    <td className="py-3">{humanize(p.payment_method)}</td>
                    <td className="py-3">
                      <p className="font-mono text-xs">{p.customer_bank_reference ?? p.transaction_id ?? '—'}</p>
                      {p.bank_slip_image &&
                  <a href={p.bank_slip_image} target="_blank" rel="noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-2">
                          View slip <ExternalLinkIcon className="h-3 w-3" aria-hidden="true" />
                        </a>
                  }
                    </td>
                    <td className="py-3"><StatusBadge status={p.status} /></td>
                    <td className="py-3 text-xs text-muted">{p.is_verified ? `${p.verified_by_email ?? 'Staff'} · ${p.verified_at ? formatDate(p.verified_at) : ''}` : '—'}</td>
                    <td className="py-3 text-right font-semibold">{formatLKR(p.amount)}</td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        }
        <Pager page={page} total={data?.count ?? 0} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>
    </div>);

}