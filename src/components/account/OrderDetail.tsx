import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { api, downloadInvoice } from '../../utils/api';
import { errorMessage } from '../../utils/apiError';
import { formatDate, formatLKR, humanize } from '../../utils/format';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import { StatusBadge } from '../ui/StatusBadge';
import { OrderTimeline } from '../orders/OrderTimeline';
import { PaymentPanel } from '../checkout/PaymentPanel';
import { OrderRequestForm } from './OrderRequestForm';
import type { Order } from '../../types/api';

export function OrderDetail() {
  const { id } = useParams();
  const { data: order, loading, error, reload } = useApi(() => api<Order>(`/api/orders/${id}/`), [id]);
  const [request, setRequest] = useState<'cancel' | 'return' | null>(null);

  if (loading) return <Spinner label="Loading order…" />;
  if (error || !order) return <ErrorState message={error ?? 'Order not found.'} onRetry={reload} />;

  const canCancel = ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status);
  const canReturn = order.status === 'DELIVERED';
  const needsPayment = order.payment_status === 'PENDING' || order.payment_status === 'FAILED';

  const invoice = async () => {
    try {
      await downloadInvoice(order.id, order.order_number);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <section aria-labelledby="od-h">
      <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" /> All orders
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="od-h" className="font-mono text-xl font-semibold">{order.order_number}</h2>
          <p className="text-sm text-muted">Placed {formatDate(order.placed_at, true)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={invoice} className="btn-outline"><DownloadIcon className="h-4 w-4" aria-hidden="true" />Invoice</button>
          {canCancel && <button type="button" onClick={() => setRequest('cancel')} className="btn-outline">Cancel order</button>}
          {canReturn && <button type="button" onClick={() => setRequest('return')} className="btn-outline">Return / refund</button>}
        </div>
      </div>

      <div className="mt-8"><OrderTimeline status={order.status} /></div>

      {request &&
      <div className="mt-8">
          <OrderRequestForm order={order} kind={request} onDone={() => {setRequest(null);reload();}} onCancel={() => setRequest(null)} />
        </div>
      }

      {needsPayment && order.status !== 'CANCELLED' &&
      <div className="mt-8">
          <PaymentPanel orderNumber={order.order_number} method={order.payment_method} amount={order.total_amount} onPaid={reload} />
        </div>
      }

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
        <div>
          <h3 className="font-semibold">Items</h3>
          <ul className="mt-3 divide-y divide-line border-y border-line text-sm">
            {order.items.map((i) =>
            <li key={i.id} className="flex justify-between gap-4 py-3">
                <div>
                  <p className="font-medium">{i.product_name} × {i.quantity}</p>
                  {i.variant_name && <p className="text-xs text-muted">{i.variant_name}</p>}
                  {i.warranty_snapshot && <p className="text-xs text-muted">Warranty: {i.warranty_snapshot}</p>}
                </div>
                <p className="font-semibold">{formatLKR(i.total_price)}</p>
              </li>
            )}
          </ul>
          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatLKR(order.subtotal)}</dd></div>
            {parseFloat(order.discount_amount) > 0 && <div className="flex justify-between"><dt className="text-muted">Discount {order.coupon_code && `(${order.coupon_code})`}</dt><dd>− {formatLKR(order.discount_amount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{parseFloat(order.delivery_charge) === 0 ? 'Free' : formatLKR(order.delivery_charge)}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 font-semibold"><dt>Total</dt><dd>{formatLKR(order.total_amount)}</dd></div>
          </dl>
        </div>
        <dl className="h-fit space-y-4 rounded-2xl bg-surface p-5 text-sm">
          <div><dt className="text-muted">Payment</dt><dd className="mt-1 flex flex-wrap items-center gap-2 font-medium">{humanize(order.payment_method)} <StatusBadge status={order.payment_status} /></dd></div>
          <div><dt className="text-muted">Delivery address</dt><dd className="mt-1 font-medium">{order.shipping_recipient_name}<br />{order.shipping_address_line1}{order.shipping_address_line2 ? `, ${order.shipping_address_line2}` : ''}<br />{order.shipping_city} {order.shipping_postal_code}<br />{order.shipping_phone}</dd></div>
          <div><dt className="text-muted">Estimated arrival</dt><dd className="mt-1 font-medium">{formatDate(order.estimated_arrival_date)}</dd></div>
          {order.tracking_number && <div><dt className="text-muted">Courier</dt><dd className="mt-1 font-medium">{order.courier_name} · {order.tracking_number}</dd></div>}
        </dl>
      </div>

      {order.status_history && order.status_history.length > 0 &&
      <div className="mt-10">
          <h3 className="font-semibold">Activity</h3>
          <ol className="mt-3 space-y-3 border-l border-line pl-5">
            {[...order.status_history].reverse().map((h) =>
          <li key={`${h.id}-${h.created_at}`} className="relative text-sm">
                <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-ink" aria-hidden="true" />
                <p className="font-medium">{h.note}</p>
                <p className="text-xs text-muted">{humanize(h.status)} · {formatDate(h.created_at, true)}</p>
              </li>
          )}
          </ol>
        </div>
      }
    </section>);

}