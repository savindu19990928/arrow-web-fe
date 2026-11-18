import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, Trash2Icon } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { formatLKR } from '../../utils/format';
import { Spinner } from '../ui/Spinner';
import { EmptyState } from '../ui/EmptyState';

export function WishlistPanel() {
  const { items, loading, toggle } = useWishlist();
  const { add } = useCart();

  return (
    <section aria-labelledby="wl-h">
      <h2 id="wl-h" className="font-display text-2xl font-semibold">Wishlist</h2>
      <div className="mt-5">
        {loading ?
        <Spinner /> :
        items.length === 0 ?
        <EmptyState icon={HeartIcon} title="Your wishlist is empty" text="Tap the heart on any product to save it for later." action={<Link to="/shop" className="btn-primary">Browse products</Link>} /> :

        <ul className="grid gap-4 sm:grid-cols-2">
            {items.map((w) =>
          <li key={w.id} className="flex gap-4 rounded-2xl bg-surface p-4">
                <Link to={`/product/${w.product.slug}`} className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-white">
                  <img src={w.product.primary_image ?? ''} alt={w.product.name} className="h-full w-full object-cover mix-blend-multiply" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <Link to={`/product/${w.product.slug}`} className="font-semibold leading-snug hover:underline">{w.product.name}</Link>
                  <p className="text-sm font-bold">{formatLKR(w.product.price)}</p>
                  <div className="mt-auto flex items-center gap-2 pt-2">
                    <button type="button" className="btn-primary px-4 py-2 text-xs" disabled={!w.product.in_stock} onClick={() => add(w.product.id, null, 1, w.product.name)}>
                      {w.product.in_stock ? 'Add to cart' : 'Out of stock'}
                    </button>
                    <button type="button" onClick={() => toggle(w.product.id)} className="rounded-full p-2 text-muted hover:bg-white hover:text-sale" aria-label={`Remove ${w.product.name}`}>
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
          )}
          </ul>
        }
      </div>
    </section>);

}