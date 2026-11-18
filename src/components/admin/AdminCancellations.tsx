import React, { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../utils/api';
import { errorMessage } from '../../utils/apiError';
import { formatLKR, humanize } from '../../utils/format';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import { StatusBadge } from '../ui/StatusBadge';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import type { ReportPayload } from '../../types/api';

type StatusCount = {status: string;count: number;};

export function AdminCancellations() {
  const { data, loading, error, reload } = useApi(() => api<ReportPayload>('/api/admin/reports/cancellations-refunds/'));
  const { items: alerts } = useAdminNotifications();
  const requestAlerts = alerts.filter((a) => /CANCEL|RETURN|REFUND/i.test(a.notification_type) || /cancel|return|refund/i.test(a.title)).slice(0, 6);

  const [cancelForm, setCancelForm] = useState({ id: '', note: '' });
  const [returnForm, setReturnForm] = useState({ id: '', status: 'APPROVED', note: '' });
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<unknown>, success: string, reset: () => void) => {
    setBusy(true);
    try {
      await fn();
      toast.success(success);
      reset();
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const decideCancel = (action: 'approve' | 'reject') => {
    if (!cancelForm.id) return toast.error('Enter the cancellation request ID.');
    run(
      () => api(`/api/admin/cancellations/${cancelForm.id}/${action}/`, { method: 'POST', body: action === 'reject' ? { admin_note: cancelForm.note } : undefined }),
      action === 'approve' ? 'Cancellation approved — stock restored.' : 'Cancellation rejected.',
      () => setCancelForm({ id: '', note: '' })
    );
  };

  const resolveReturn = (e: React.FormEvent) => {
    e.preventDefault();
    run(
      () => api(`/api/admin/returns-refunds/${returnForm.id}/resolve/`, { method: 'POST', body: { status: returnForm.status, admin_note: returnForm.note } }),
      `Return request marked ${humanize(returnForm.status).toLowerCase()}.`,
      () => setReturnForm({ id: '', status: 'APPROVED', note: '' })
    );
  };

  const summary = data?.summary ?? {};
  const cancellations = data?.cancellations_by_status as StatusCount[] | undefined ?? [];
  const returns = data?.returns_by_status as StatusCount[] | undefined ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <section aria-labelledby="cr-h">
        <h2 id="cr-h" className="text-xl font-bold">This period</h2>
        {loading ?
        <Spinner /> :
        error ?
        <ErrorState message={error} onRetry={reload} /> :

        <>
            <dl className="mt-4 grid grid-cols-3 gap-4 border-y border-line py-5">
              <div><dt className="text-xs text-muted">Cancellation requests</dt><dd className="text-3xl font-extrabold">{String(summary.total_cancellation_requests ?? 0)}</dd></div>
              <div><dt className="text-xs text-muted">Return / refund requests</dt><dd className="text-3xl font-extrabold">{String(summary.total_return_refund_requests ?? 0)}</dd></div>
              <div><dt className="text-xs text-muted">Refunded</dt><dd className="text-xl font-extrabold">{formatLKR(Number(summary.total_completed_refund_amount ?? 0))}</dd></div>
            </dl>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {[{ label: 'Cancellations', rows: cancellations }, { label: 'Returns', rows: returns }].map((g) =>
            <div key={g.label}>
                  <h3 className="text-sm font-semibold">{g.label} by status</h3>
                  {g.rows.length === 0 ?
              <p className="mt-2 text-sm text-muted">None yet.</p> :

              <ul className="mt-2 space-y-2 text-sm">
                      {g.rows.map((r) =>
                <li key={r.status} className="flex items-center justify-between"><StatusBadge status={r.status} /><span className="font-semibold">{r.count}</span></li>
                )}
                    </ul>
              }
                </div>
            )}
            </div>
          </>
        }
        {requestAlerts.length > 0 &&
        <div className="mt-8">
            <h3 className="text-sm font-semibold">Latest requests</h3>
            <ul className="mt-2 divide-y divide-line border-y border-line text-sm">
              {requestAlerts.map((a) =>
            <li key={a.id} className="py-3">
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-muted">{a.message}</p>
                </li>
            )}
            </ul>
          </div>
        }
      </section>

      <div className="space-y-6">
        <section className="rounded-3xl bg-surface p-6" aria-labelledby="cx-h">
          <h2 id="cx-h" className="text-lg font-bold">Cancellation request</h2>
          <p className="mt-1 text-xs text-muted">Approving cancels the order and returns reserved stock.</p>
          <div className="mt-4 grid gap-3">
            <input className="input" inputMode="numeric" placeholder="Request ID" value={cancelForm.id} onChange={(e) => setCancelForm((f) => ({ ...f, id: e.target.value.replace(/\D/g, '') }))} aria-label="Cancellation request ID" />
            <input className="input" placeholder="Note (required to reject)" value={cancelForm.note} onChange={(e) => setCancelForm((f) => ({ ...f, note: e.target.value }))} aria-label="Admin note" />
            <div className="flex gap-2">
              <button type="button" className="btn-primary" disabled={busy} onClick={() => decideCancel('approve')}>Approve</button>
              <button type="button" className="btn-outline" disabled={busy} onClick={() => decideCancel('reject')}>Reject</button>
            </div>
          </div>
        </section>

        <form onSubmit={resolveReturn} className="rounded-3xl bg-surface p-6" aria-labelledby="rr-h">
          <h2 id="rr-h" className="text-lg font-bold">Return / refund request</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className="input" inputMode="numeric" required placeholder="Request ID" value={returnForm.id} onChange={(e) => setReturnForm((f) => ({ ...f, id: e.target.value.replace(/\D/g, '') }))} aria-label="Return request ID" />
            <select className="input" value={returnForm.status} onChange={(e) => setReturnForm((f) => ({ ...f, status: e.target.value }))} aria-label="Resolution">
              <option value="APPROVED">Approve</option>
              <option value="REJECTED">Reject</option>
              <option value="COMPLETED">Refund completed</option>
            </select>
            <input className="input sm:col-span-2" placeholder="Note for the customer" value={returnForm.note} onChange={(e) => setReturnForm((f) => ({ ...f, note: e.target.value }))} aria-label="Admin note" />
          </div>
          <button type="submit" className="btn-primary mt-3" disabled={busy}>Save resolution</button>
        </form>
      </div>
    </div>);

}