import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BoxIcon, HeartIcon, Loader2Icon, PlusIcon, StarIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatLKR } from '../../utils/format';
import type { ProductSummary } from '../../types/api';

interface ProductCardProps {
  product: ProductSummary;
  showWishlist?: boolean;
}

export function ProductCard({ product, showWishlist = true }: ProductCardProps) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const saved = has(product.id);
  const onSale = Boolean(product.compare_at_price && parseFloat(product.compare_at_price) > parseFloat(product.price));
  const rating = parseFloat(product.average_rating || '0');

  const handleAdd = async () => {
    setAdding(true);
    await add(product.id, null, 1, product.name);
    setAdding(false);
  };

  return (
    <article className="group flex h-full flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-surface">
        <Link to={`/product/${product.slug}`} className="block" aria-label={product.name}>
          {product.primary_image ?
          <img
            src={product.primary_image}
            alt={product.name}
            className="aspect-[4/3] w-full object-contain p-4 mix-blend-multiply transition-transform duration-300 ease-snappy group-hover:scale-[1.04]"
            loading="lazy" /> :


          <span className="flex aspect-[4/3] w-full items-center justify-center text-xs text-muted">No image</span>
          }
        </Link>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {!product.in_stock ?
          <span className="rounded-full bg-ink-600 px-2.5 py-1 text-[11px] font-semibold text-white">Sold out</span> :
          onSale ?
          <span className="rounded-full bg-sale px-2.5 py-1 text-[11px] font-semibold text-white">
              {product.discount_percentage ? `-${Math.round(product.discount_percentage)}%` : 'Sale'}
            </span> :
          product.is_featured ?
          <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">Bestseller</span> :
          null}
          {product.has_3d_model &&
          <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-ink">
              <BoxIcon className="h-3 w-3" aria-hidden="true" />
              3D
            </span>
          }
        </div>
        {showWishlist && user &&
        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white transition-transform duration-150 ease-snappy active:scale-90">
          
            <HeartIcon className={`h-4 w-4 ${saved ? 'fill-sale text-sale' : 'text-ink'}`} />
          </button>
        }
      </div>

      <div className="mt-4 flex flex-1 flex-col px-1">
        <p className="text-xs text-muted">{product.category?.name}</p>
        <h3 className="mt-0.5 line-clamp-1 text-base font-bold tracking-tight md:text-lg">
          <Link to={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        {product.review_count > 0 &&
        <p className="mt-1 flex items-center gap-1 text-xs text-muted">
            <StarIcon className="h-3.5 w-3.5 fill-ink text-ink" aria-hidden="true" />
            <span className="font-semibold text-ink">{rating.toFixed(1)}</span>
            <span>({product.review_count})</span>
          </p>
        }
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-base font-bold">{formatLKR(product.price)}</span>
            {onSale && <span className="text-xs text-muted line-through">{formatLKR(product.compare_at_price)}</span>}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.in_stock || adding}
            aria-label={product.in_stock ? `Add ${product.name} to cart` : `${product.name} is sold out`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-[background-color,transform] duration-150 ease-snappy hover:bg-brand active:scale-95 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted">
            
            {adding ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <PlusIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </article>);

}