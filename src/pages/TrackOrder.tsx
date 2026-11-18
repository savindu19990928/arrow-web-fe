import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DownloadIcon, Loader2Icon, PackageSearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { api, downloadInvoice } from '../utils/api';
import { errorMessage } from '../utils/apiError';
import { formatDate, formatLKR, humanize } from '../utils/format';
import { PageHero } from '../components/layout/PageHero';
import { OrderTimeline } from '../components/orders/OrderTimeline';
import { StatusBadge } from '../components/ui/StatusBadge';
import { images } from '../data/site';
import type { TrackResult } from '../types/api';

export function TrackOrder() {
  const [params] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get('order_number') ?? '');
  const [contact, setContact] = useState(params.get('contact') ?? '');
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const track = async (num = orderNumber, c = contact) => {
    if (!num.trim() || !c.trim()) return;
    setLoading(true);
    setError(null);
    try {
      setResult(await api<TrackResult>('/api/orders/track/', { query: { order_number: num.trim(), contact: c.trim() } }));
    } catch (err) {
      setResult(null);
      setError(errorMessage(err, 'We could not find that order.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.get('order_number') && params.get('contact')) track(params.get('order_number')!, params.get('contact')!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const invoice = async () => {
    if (!result) return;
    try {
      await downloadInvoice(result.id, result.order_number, contact.trim());
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <>
      <PageHero title="Track" accent="Order" subtitle="Check where your ride is, any time." image={images.aboutHero} crumbs={[{ label: 'Track Order' }]} />
      <div className="mx-auto grid max-w-site gap-10 px-4 py-12 md:px-6 lg:grid-cols-[380px_1fr]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            track();
          }}
          className="h-fit space-y-4 rounded-2xl bg-surface p-6">
          
          <h2 className="font-display text-xl font-semibold">Find your order</h2>
          <div>
            <label htmlFor="t-num" className="label">Order number</label>
            <input id="t-num" className="input font-mono uppercase" required placeholder="ARW-20261028-9F3A1B" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
          </div>
          <div>
            <label htmlFor="t-contact" className="label">Email or phone used at checkout</label>
            <input id="t-contact" className="input" required value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading && <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Track order
          </button>
        </form>

        <div aria-live="polite">
          {error && <p className="rounded-2xl bg-surface p-6 text-sm text-sale">{error}</p>}
          {!error && !result &&
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line p-8 text-center">
              <PackageSearchIcon className="h-8 w-8" aria-hidden="true" />
              <p className="text-sm text-muted">Enter your order number and contact details to see live status.</p>
            </div>
          }
          {result &&
          <div className="rounded-2xl border border-line p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted">Order</p>
                  <p className="font-mono text-lg font-semibold">{result.order_number}</p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={result.status} />
                  <StatusBadge status={result.payment_status} />
                </div>
              </div>
              <div className="mt-8">
                <OrderTimeline status={result.status} />
              </div>
              <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div><dt className="text-muted">Estimated arrival</dt><dd className="font-semibold">{formatDate(result.estimated_arrival_date)}</dd></div>
                <div><dt className="text-muted">Courier</dt><dd className="font-semibold">{result.courier_name ?? 'Assigned on dispatch'}</dd></div>
                <div><dt className="text-muted">Tracking no.</dt><dd className="font-semibold">{result.tracking_number ?? '—'}</dd></div>
                <div><dt className="text-muted">Total · {humanize(result.payment_method)}</dt><dd className="font-semibold">{formatLKR(result.total_amount)}</dd></div>
              </dl>
              <button type="button" onClick={invoice} className="btn-outline mt-6">
                <DownloadIcon className="h-4 w-4" aria-hidden="true" /> Download invoice
              </button>
            </div>
          }
        </div>
      </div>
    </>);

}