import React, { useState } from 'react';
import { CheckCircle2Icon, ExternalLinkIcon, FileTextIcon } from 'lucide-react';
import { toast } from 'sonner';
import { api, asList } from '../../utils/api';
import { errorMessage } from '../../utils/apiError';
import { formatDate, formatLKR } from '../../utils/format';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import type { AdminPayment, Paginated } from '../../types/api';

export function AdminVerifications() {
  const { data, loading, error, reload } = useApi(() => api<Paginated<AdminPayment>>('/api/admin/payments/pending-verifications/'));
  const queue = asList(data);
  const [selected, setSelected] = useState<AdminPayment | null>(null);
  const [form, setForm] = useState({ transaction_id: '', admin_notes: '', confirm_without_slip: false });
  const [busy, setBusy] = useState(false);

  const current = selected ?? queue[0] ?? null;
  const isPdf = current?.bank_slip_image?.toLowerCase().endsWith('.pdf');

  const verify = async (action: 'APPROVE' | 'REJECT') => {
    if (!current) return;
    if (action === 'REJECT' && !form.admin_notes.trim()) {
      toast.error('Add a note so the customer knows why the slip was rejected.');
      return;
    }
    setBusy(true);
    try {
      await api(`/api/admin/payments/${current.id}/verify/`, {
        method: 'POST',
        body: {
          action,
          admin_notes: form.admin_notes || undefined,
          transaction_id: form.transaction_id || undefined,
          confirm_without_slip: form.confirm_without_slip || undefined
        }
      });
      toast.success(action === 'APPROVE' ? `${current.order_number} approved — order confirmed.` : `${current.order_number} rejected — customer notified.`);
      setSelected(null);
      setForm({ transaction_id: '', admin_notes: '', confirm_without_slip: false });
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!current) return <EmptyState icon={CheckCircle2Icon} title="Queue is clear" text="No bank transfer slips are waiting for verification." />;

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <section aria-labelledby="vq-h">
        <h2 id="vq-h" className="text-sm font-semibold text-muted">{data?.count ?? queue.length} awaiting verification · oldest first</h2>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {queue.map((p) =>
          <li key={p.id}>
              <button
              type="button"
              onClick={() => setSelected(p)}
              aria-current={current.id === p.id}
              className={`w-full px-3 py-4 text-left text-sm transition-colors duration-150 ${current.id === p.id ? 'bg-surface' : 'hover:bg-surface/60'}`}>
              
                <p className="font-mono font-semibold">{p.order_number}</p>
                <p className="mt-0.5 flex justify-between text-xs text-muted">
                  <span>{p.bank_name ?? 'Bank'} · {p.customer_bank_reference ?? '—'}</span>
                  <span className="font-semibold text-ink">{formatLKR(p.amount)}</span>
                </p>
              </button>
            </li>
          )}
        </ul>
      </section>

      <section className="rounded-3xl border border-line p-5 md:p-8" aria-labelledby="vd-h">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="vd-h" className="font-mono text-xl font-bold">{current.order_number}</h2>
            <p className="text-sm text-muted">Submitted {current.bank_transfer_submitted_at ? formatDate(current.bank_transfer_submitted_at, true) : '—'}</p>
          </div>
          <p className="text-3xl font-extrabold tracking-tight">{formatLKR(current.amount)}</p>
        </div>

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
          <div><dt className="text-muted">Bank</dt><dd className="font-semibold">{current.bank_name ?? '—'}</dd></div>
          <div><dt className="text-muted">Customer reference</dt><dd className="font-mono font-semibold">{current.customer_bank_reference ?? '—'}</dd></div>
          <div><dt className="text-muted">Deposit date</dt><dd className="font-semibold">{current.deposit_date ? formatDate(current.deposit_date) : '—'}</dd></div>
        </dl>

        <div className="mt-6 overflow-hidden rounded-2xl bg-surface">
          {current.bank_slip_image ?
          isPdf ?
          <a href={current.bank_slip_image} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-5 text-sm font-semibold">
                <FileTextIcon className="h-6 w-6" aria-hidden="true" /> Open PDF slip <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
              </a> :

          <a href={current.bank_slip_image} target="_blank" rel="noreferrer" aria-label="Open slip in a new tab">
                <img src={current.bank_slip_image} alt={`Deposit slip for ${current.order_number}`} className="max-h-[420px] w-full object-contain" />
              </a> :


          <p className="p-5 text-sm text-muted">No slip image attached.</p>
          }
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="vf-txn" className="label">Bank transaction ID</label>
            <input id="vf-txn" className="input" value={form.transaction_id} onChange={(e) => setForm((f) => ({ ...f, transaction_id: e.target.value }))} placeholder="From bank statement" />
          </div>
          <div>
            <label htmlFor="vf-notes" className="label">Admin notes</label>
            <input id="vf-notes" className="input" value={form.admin_notes} onChange={(e) => setForm((f) => ({ ...f, admin_notes: e.target.value }))} placeholder="Matched with statement narration…" />
          </div>
          {!current.bank_slip_image &&
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" className="h-4 w-4 accent-ink" checked={form.confirm_without_slip} onChange={(e) => setForm((f) => ({ ...f, confirm_without_slip: e.target.checked }))} />
              Confirm without a slip (funds verified on statement)
            </label>
          }
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" disabled={busy} onClick={() => verify('APPROVE')}>
            {busy ? 'Saving…' : 'Approve & confirm order'}
          </button>
          <button type="button" className="btn-outline" disabled={busy} onClick={() => verify('REJECT')}>
            Reject slip
          </button>
        </div>
      </section>
    </div>);

}