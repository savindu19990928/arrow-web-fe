import React from 'react';
import { Link } from 'react-router-dom';
import { MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon, TruckIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatLKR } from '../utils/format';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';

const FREE_DELIVERY_THRESHOLD = 100000;

export function Cart() {
  const { cart, loading, update, remove, clear } = useCart();

  if (loading) return <Spinner label="Loading your cart…" className="min-h-[50vh]" />;

  const items = cart?.items ?? [];
  const subtotal = parseFloat(cart?.subtotal ?? '0');
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progress = Math.min(100, subtotal / FREE_DELIVERY_THRESHOLD * 100);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-site px-4 py-10 md:px-6 md:py-14">
        <div className="flex items-end justify-between gap-4">
          <h1 className="headline text-4xl md:text-5xl">Your Cart</h1>
          {items.length > 0 &&
          <button type="button" onClick={() => clear()} className="text-sm font-semibold text-muted underline underline-offset-4 hover:text-ink">
              Clear cart
            </button>
          }
        </div>

        {items.length === 0 ?
        <div className="mt-8">
            <EmptyState
            icon={ShoppingBagIcon}
            title="Your cart is empty"
            text="Find your next ride or the parts to keep it running."
            action={<Link to="/shop" className="btn-primary">Start shopping</Link>} />
          
          </div> :

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
            <div>
              <div className="rounded-2xl bg-surface p-4 text-sm">
                <p className="flex items-center gap-2 font-medium">
                  <TruckIcon className="h-4 w-4" aria-hidden="true" />
                  {remaining > 0 ? <>Add <strong>{formatLKR(remaining)}</strong> more for free islandwide delivery</> : 'You’ve unlocked free islandwide delivery'}
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to free delivery">
                  <div className="h-full rounded-full bg-ink transition-[width] duration-300 ease-snappy" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <ul className="mt-6 divide-y divide-line border-y border-line">
                {items.map((item) =>
              <li key={item.id} className="flex gap-4 py-5">
                    <Link to={`/product/${item.product_slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface sm:w-32">
                      {item.product_image && <img src={item.product_image} alt={item.product_name} className="h-full w-full object-contain p-2 mix-blend-multiply" />}
                    </Link>
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <Link to={`/product/${item.product_slug}`} className="font-bold hover:underline">{item.product_name}</Link>
                        {item.variant_name && <p className="text-sm text-muted">{item.variant_name}</p>}
                        <p className="mt-1 text-sm text-muted">{formatLKR(item.unit_price)} each</p>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <p className="font-bold">{formatLKR(item.line_total)}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center rounded-full border border-line">
                            <button type="button" className="p-2.5 disabled:opacity-40" onClick={() => update(item.id, item.quantity - 1)} aria-label={`Decrease quantity of ${item.product_name}`} disabled={item.quantity <= 1}>
                              <MinusIcon className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                            <button type="button" className="p-2.5" onClick={() => update(item.id, item.quantity + 1)} aria-label={`Increase quantity of ${item.product_name}`}>
                              <PlusIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button type="button" onClick={() => remove(item.id)} className="rounded-full p-2 text-muted hover:bg-surface hover:text-sale" aria-label={`Remove ${item.product_name}`}>
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
              )}
              </ul>
            </div>

            <aside className="h-fit rounded-3xl bg-surface p-6 lg:sticky lg:top-24" aria-label="Order summary">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal ({cart?.total_items_count} items)</dt>
                  <dd className="font-medium">{formatLKR(cart?.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Delivery</dt>
                  <dd className="font-medium">{parseFloat(cart?.estimated_delivery_fee ?? '0') === 0 ? 'Free' : formatLKR(cart?.estimated_delivery_fee)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-bold">{formatLKR(cart?.grand_total)}</dd>
                </div>
              </dl>
              {cart?.max_lead_time_days ?
            <p className="mt-4 flex items-center gap-2 text-xs text-muted">
                  <TruckIcon className="h-4 w-4" aria-hidden="true" />
                  Estimated arrival within {cart.max_lead_time_days} days
                </p> :
            null}
              <Link to="/checkout" className="btn-accent mt-6 w-full">Proceed to Checkout</Link>
              <p className="mt-3 text-center text-xs text-muted">Coupons can be applied at checkout. Final totals are confirmed by our system.</p>
              <Link to="/shop" className="mt-4 block text-center text-sm font-medium underline underline-offset-2">Continue shopping</Link>
            </aside>
          </div>
        }
      </div>
    </div>);

}