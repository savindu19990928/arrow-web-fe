import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CircleCheckBigIcon } from 'lucide-react';
import { formatDate, formatLKR, humanize } from '../utils/format';
import { PaymentPanel } from '../components/checkout/PaymentPanel';
import type { Order } from '../types/api';

export function OrderComplete() {
  const stored = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('av_last_order');
      return raw ? JSON.parse(raw) as {order: Order;contact: string;} : null;
    } catch {
      return null;
    }
  }, []);

  if (!stored) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="headline text-4xl">No recent order</h1>
        <p className="mt-3 text-muted">Looking for an order? Track it with your order number.</p>
        <Link to="/track-order" className="btn-primary mt-6">Track an order</Link>
      </div>);

  }

  const { order, contact } = stored;

  return (
    <div className="mx-auto max-w-site px-4 py-12 md:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <CircleCheckBigIcon className="h-10 w-10 text-eco" aria-hidden="true" />
          <h1 className="headline mt-4 text-5xl">Order placed</h1>
          <p className="mt-3 text-ink-700">
            Thank you, {order.customer_name.split(' ')[0]}. Your order number is{' '}
            <strong className="font-mono">{order.order_number}</strong>. Keep it handy to track your delivery.
          </p>
          <div className="mt-8">
            <PaymentPanel orderNumber={order.order_number} method={order.payment_method} amount={order.total_amount} />
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-surface p-6" aria-label="Order details">
          <h2 className="font-display text-xl font-semibold">Order details</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Payment</dt><dd>{humanize(order.payment_method)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Estimated arrival</dt><dd>{formatDate(order.estimated_arrival_date)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Deliver to</dt><dd className="text-right">{order.shipping_recipient_name}<br />{order.shipping_city}</dd></div>
          </dl>
          <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
            {order.items.map((i) =>
            <li key={i.id} className="flex justify-between gap-3">
                <span>{i.product_name} × {i.quantity}</span>
                <span className="font-medium">{formatLKR(i.total_price)}</span>
              </li>
            )}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-semibold">
            <span>Total</span>
            <span>{formatLKR(order.total_amount)}</span>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Link to={`/track-order?order_number=${order.order_number}&contact=${encodeURIComponent(contact)}`} className="btn-outline w-full">Track this order</Link>
            <Link to="/shop" className="text-center text-sm font-medium underline underline-offset-2">Continue shopping</Link>
          </div>
        </aside>
      </div>
    </div>);

}