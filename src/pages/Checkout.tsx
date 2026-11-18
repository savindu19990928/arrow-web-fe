import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckIcon, Loader2Icon, LockIcon, TagIcon } from 'lucide-react';
import { toast } from 'sonner';
import { api, getGuestToken } from '../utils/api';
import { errorMessage } from '../utils/apiError';
import { formatLKR } from '../utils/format';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from '../components/ui/Spinner';
import type { Address, CouponResult, Order, PaymentMethod } from '../types/api';

const paymentOptions: {value: PaymentMethod;label: string;text: string;}[] = [
{ value: 'KOKO', label: 'Koko', text: 'Buy now, pay later in 3 interest-free instalments.' },
{ value: 'MINTPAY', label: 'Mintpay', text: 'Split into 3 payments with Mintpay.' },
{ value: 'BANK_TRANSFER', label: 'Direct bank transfer', text: 'Transfer to our account and upload your slip. Confirmed after verification.' }];


const emptyShipping = {
  shipping_recipient_name: '',
  shipping_phone: '',
  shipping_address_line1: '',
  shipping_address_line2: '',
  shipping_city: '',
  shipping_state: '',
  shipping_postal_code: '',
  shipping_country: 'Sri Lanka'
};

export function Checkout() {
  const { cart, loading, refresh } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [guest, setGuest] = useState({ guest_name: '', guest_email: '', guest_phone: '' });
  const [shipping, setShipping] = useState(emptyShipping);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | 'new'>('new');
  const [saveAddress, setSaveAddress] = useState(true);
  const [notes, setNotes] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('KOKO');
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [agree, setAgree] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) return;
    api<Address[]>('/api/addresses/').
    then((list) => {
      setAddresses(list);
      const def = list.find((a) => a.is_default) ?? list[0];
      if (def) setSelectedAddress(def.id);
    }).
    catch(() => undefined);
  }, [user]);

  useEffect(() => {
    if (selectedAddress === 'new') {
      setShipping({ ...emptyShipping, shipping_recipient_name: user ? `${user.first_name} ${user.last_name}`.trim() : '', shipping_phone: user?.phone_number ?? '' });
      return;
    }
    const a = addresses.find((x) => x.id === selectedAddress);
    if (a) {
      setShipping({
        shipping_recipient_name: a.recipient_name,
        shipping_phone: a.phone_number,
        shipping_address_line1: a.address_line1,
        shipping_address_line2: a.address_line2 ?? '',
        shipping_city: a.city,
        shipping_state: a.state_or_province ?? '',
        shipping_postal_code: a.postal_code,
        shipping_country: a.country
      });
      setNotes(a.delivery_notes ?? '');
    }
  }, [selectedAddress, addresses, user]);

  const subtotal = parseFloat(cart?.subtotal ?? '0');
  const delivery = parseFloat(cart?.estimated_delivery_fee ?? '0');
  const discount = coupon?.discount_amount ?? 0;
  const total = subtotal - discount + delivery;

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCheckingCoupon(true);
    try {
      const res = await api<CouponResult>('/api/promotions/coupons/validate/', { method: 'POST', body: { code: couponInput.trim(), subtotal } });
      if (!res.valid) throw new Error(res.message);
      setCoupon(res);
      toast.success(res.message);
    } catch (err) {
      setCoupon(null);
      toast.error(errorMessage(err, 'This coupon could not be applied.'));
    } finally {
      setCheckingCoupon(false);
    }
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      toast.error('Please accept the Terms & Conditions and Refund Policy.');
      return;
    }
    setPlacing(true);
    try {
      if (user && selectedAddress === 'new' && saveAddress) {
        await api('/api/addresses/', {
          method: 'POST',
          body: {
            recipient_name: shipping.shipping_recipient_name,
            phone_number: shipping.shipping_phone,
            address_line1: shipping.shipping_address_line1,
            address_line2: shipping.shipping_address_line2,
            city: shipping.shipping_city,
            state_or_province: shipping.shipping_state,
            postal_code: shipping.shipping_postal_code,
            country: shipping.shipping_country,
            is_default: addresses.length === 0,
            delivery_notes: notes
          }
        }).catch(() => undefined);
      }
      const order = await api<Order>('/api/orders/checkout/', {
        method: 'POST',
        body: {
          ...shipping,
          ...(user ? {} : { ...guest, guest_token: getGuestToken() }),
          payment_method: method,
          coupon_code: coupon?.code,
          delivery_notes: notes
        }
      });
      sessionStorage.setItem('av_last_order', JSON.stringify({ order, contact: user?.email ?? guest.guest_email }));
      await refresh();
      navigate('/checkout/complete');
    } catch (err) {
      toast.error(errorMessage(err, 'We could not place your order.'));
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <Spinner label="Preparing checkout…" className="min-h-[50vh]" />;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="headline text-4xl">Nothing to check out</h1>
        <p className="mt-3 text-muted">Your cart is empty.</p>
        <Link to="/shop" className="btn-primary mt-6">Browse products</Link>
      </div>);

  }

  const field = (key: keyof typeof shipping, label: string, opts: {required?: boolean;type?: string;autoComplete?: string;} = {}) =>
  <div>
      <label htmlFor={key} className="label">{label}{opts.required && ' *'}</label>
      <input id={key} type={opts.type ?? 'text'} className="input" required={opts.required} autoComplete={opts.autoComplete} value={shipping[key]} onChange={(e) => setShipping((s) => ({ ...s, [key]: e.target.value }))} />
    </div>;


  return (
    <div className="mx-auto max-w-site px-4 py-10 md:px-6">
      <h1 className="headline text-5xl md:text-6xl">Checkout</h1>
      <form onSubmit={placeOrder} className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          <section aria-labelledby="contact-h">
            <div className="flex items-baseline justify-between">
              <h2 id="contact-h" className="font-display text-2xl font-semibold">Contact</h2>
              {!user &&
              <p className="text-sm text-muted">
                  Have an account? <Link to="/login?next=/checkout" className="font-semibold text-ink underline underline-offset-2">Sign in</Link>
                </p>
              }
            </div>
            {user ?
            <p className="mt-3 text-sm text-ink-700">Ordering as <strong>{user.email}</strong></p> :

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="g-name" className="label">Full name *</label>
                  <input id="g-name" className="input" required autoComplete="name" value={guest.guest_name} onChange={(e) => setGuest((g) => ({ ...g, guest_name: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="g-email" className="label">Email *</label>
                  <input id="g-email" type="email" className="input" required autoComplete="email" value={guest.guest_email} onChange={(e) => setGuest((g) => ({ ...g, guest_email: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="g-phone" className="label">Phone *</label>
                  <input id="g-phone" type="tel" className="input" required autoComplete="tel" placeholder="+94 7X XXX XXXX" value={guest.guest_phone} onChange={(e) => setGuest((g) => ({ ...g, guest_phone: e.target.value }))} />
                </div>
              </div>
            }
          </section>

          <section aria-labelledby="ship-h">
            <h2 id="ship-h" className="font-display text-2xl font-semibold">Delivery address</h2>
            {user && addresses.length > 0 &&
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {addresses.map((a) =>
              <label key={a.id} className={`cursor-pointer rounded-xl border p-4 text-sm transition-colors duration-150 ${selectedAddress === a.id ? 'border-ink bg-surface' : 'border-line hover:border-ink'}`}>
                    <input type="radio" name="addr" className="sr-only" checked={selectedAddress === a.id} onChange={() => setSelectedAddress(a.id)} />
                    <span className="font-semibold">{a.recipient_name}</span>
                    {a.is_default && <span className="ml-2 rounded bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white">Default</span>}
                    <span className="mt-1 block text-muted">{a.address_line1}, {a.city}</span>
                    <span className="block text-muted">{a.phone_number}</span>
                  </label>
              )}
                <label className={`flex cursor-pointer items-center justify-center rounded-xl border border-dashed p-4 text-sm font-semibold ${selectedAddress === 'new' ? 'border-ink bg-surface' : 'border-line hover:border-ink'}`}>
                  <input type="radio" name="addr" className="sr-only" checked={selectedAddress === 'new'} onChange={() => setSelectedAddress('new')} />
                  + Use a new address
                </label>
              </div>
            }
            {selectedAddress === 'new' &&
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {field('shipping_recipient_name', 'Recipient name', { required: true, autoComplete: 'name' })}
                {field('shipping_phone', 'Phone', { required: true, type: 'tel', autoComplete: 'tel' })}
                <div className="sm:col-span-2">{field('shipping_address_line1', 'Address line 1', { required: true, autoComplete: 'address-line1' })}</div>
                <div className="sm:col-span-2">{field('shipping_address_line2', 'Address line 2', { autoComplete: 'address-line2' })}</div>
                {field('shipping_city', 'City', { required: true, autoComplete: 'address-level2' })}
                {field('shipping_state', 'Province', { autoComplete: 'address-level1' })}
                {field('shipping_postal_code', 'Postal code', { autoComplete: 'postal-code' })}
                {field('shipping_country', 'Country', { required: true, autoComplete: 'country-name' })}
                {user &&
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input type="checkbox" className="h-4 w-4 accent-ink" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                    Save this address to my account
                  </label>
              }
              </div>
            }
            <div className="mt-4">
              <label htmlFor="notes" className="label">Delivery notes</label>
              <textarea id="notes" className="input min-h-[80px]" placeholder="e.g. Call before delivery" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </section>

          <section aria-labelledby="pay-h">
            <h2 id="pay-h" className="font-display text-2xl font-semibold">Payment method</h2>
            <div className="mt-4 space-y-3">
              {paymentOptions.map((p) =>
              <label key={p.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors duration-150 ${method === p.value ? 'border-ink bg-surface' : 'border-line hover:border-ink'}`}>
                  <input type="radio" name="payment" className="mt-1 h-4 w-4 accent-ink" checked={method === p.value} onChange={() => setMethod(p.value)} />
                  <span>
                    <span className="block font-semibold">{p.label}</span>
                    <span className="block text-sm text-muted">{p.text}</span>
                  </span>
                </label>
              )}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl bg-surface p-6 lg:sticky lg:top-24" aria-label="Order summary">
          <h2 className="font-display text-xl font-semibold">Order Summary</h2>
          <ul className="mt-4 space-y-3">
            {cart.items.map((i) =>
            <li key={i.id} className="flex items-center gap-3">
                <span className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                  <img src={i.product_image ?? ''} alt="" className="h-full w-full object-cover mix-blend-multiply" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white">{i.quantity}</span>
                </span>
                <span className="flex-1 text-sm">
                  <span className="block font-medium leading-snug">{i.product_name}</span>
                  {i.variant_name && <span className="block text-xs text-muted">{i.variant_name}</span>}
                </span>
                <span className="text-sm font-semibold">{formatLKR(i.line_total)}</span>
              </li>
            )}
          </ul>

          <div className="mt-5 border-t border-line pt-5">
            <label htmlFor="coupon" className="label">Coupon code</label>
            {coupon ?
            <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2.5 text-sm">
                <span className="flex items-center gap-2 font-semibold"><CheckIcon className="h-4 w-4 text-eco" aria-hidden="true" />{coupon.code}</span>
                <button type="button" className="text-xs underline" onClick={() => {setCoupon(null);setCouponInput('');}}>Remove</button>
              </div> :

            <div className="flex gap-2">
                <div className="relative flex-1">
                  <TagIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input id="coupon" className="input pl-9 uppercase" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="ARROW10" />
                </div>
                <button type="button" onClick={applyCoupon} className="btn-outline" disabled={checkingCoupon}>
                  {checkingCoupon ? <Loader2Icon className="h-4 w-4 animate-spin" /> : 'Apply'}
                </button>
              </div>
            }
          </div>

          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatLKR(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-eco"><dt>Discount</dt><dd>− {formatLKR(discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{delivery === 0 ? 'Free' : formatLKR(delivery)}</dd></div>
            <div className="flex justify-between border-t border-line pt-3 text-base"><dt className="font-semibold">Total</dt><dd className="font-bold">{formatLKR(total)}</dd></div>
          </dl>

          <label className="mt-5 flex items-start gap-2 text-xs text-ink-700">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-ink" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>
              I agree to the <Link to="/terms-and-conditions" className="underline" target="_blank">Terms & Conditions</Link> and <Link to="/refund-policy" className="underline" target="_blank">Refund Policy</Link>.
            </span>
          </label>
          <button type="submit" className="btn-primary mt-5 w-full" disabled={placing}>
            {placing ? <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LockIcon className="h-4 w-4" aria-hidden="true" />}
            {placing ? 'Placing order…' : `Place Order · ${formatLKR(total)}`}
          </button>
        </aside>
      </form>
    </div>);

}