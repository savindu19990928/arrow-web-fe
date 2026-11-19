import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BoxIcon, HeartIcon, Loader2Icon, StarIcon } from 'lucide-react';
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
  const price = parseFloat(product.price);
  const compare = product.compare_at_price ? parseFloat(product.compare_at_price) : 0;
  const onSale = compare > price;
  const rating = parseFloat(product.average_rating || '0');
  const url = `/product/${product.slug}`;

  const handleAdd = async () => {
    setAdding(true);
    await add(product.id, null, 1, product.name);
    setAdding(false);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative bg-[#F2F2F2]">
        <Link to={url} className="block" aria-label={product.name}>
          {product.primary_image ?
          <img
            src={product.primary_image}
            alt={product.name}
            className="aspect-[4/3] w-full object-contain p-6 mix-blend-multiply transition-transform duration-300 ease-snappy group-hover:scale-[1.04]"
            loading="lazy" /> :


          <span className="flex aspect-[4/3] w-full items-center justify-center text-xs text-muted">No image</span>
          }
        </Link>
        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
          {!product.in_stock ?
          <span className="rounded bg-ink-600 px-2 py-1 text-xs font-medium text-white">Sold out</span> :
          onSale ?
          <span className="rounded bg-brand px-2 py-1 text-xs font-medium text-white">
              {product.discount_percentage ? `Save ${Math.round(product.discount_percentage)}%` : 'Sale'}
            </span> :
          product.is_featured ?
          <span className="rounded bg-black px-2 py-1 text-xs font-medium text-white">Best Seller</span> :
          null}
          {product.has_3d_model &&
          <span className="flex items-center gap-1 rounded bg-white px-2 py-1 text-xs font-medium text-ink">
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
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white transition-transform duration-150 ease-snappy active:scale-90">
          
            <HeartIcon className={`h-4 w-4 ${saved ? 'fill-sale text-sale' : 'text-ink'}`} />
          </button>
        }
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-xl font-semibold tracking-tight">
            <Link to={url} className="hover:underline">
              {product.name}
            </Link>
          </h3>
          {product.review_count > 0 &&
          <p className="mt-1 flex shrink-0 items-center gap-1 text-sm text-muted">
              <StarIcon className="h-3.5 w-3.5 fill-ink text-ink" aria-hidden="true" />
              <span className="font-medium text-ink">{rating.toFixed(1)}</span>
              <span>({product.review_count})</span>
            </p>
          }
        </div>
        <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-muted">{product.short_description || product.category?.name}</p>

        <div className="mt-4 flex flex-wrap items-baseline gap-x-2">
          <span className={`text-lg font-semibold ${onSale ? 'text-sale' : ''}`}>{formatLKR(product.price)}</span>
          {onSale && <span className="text-sm text-muted line-through">{formatLKR(product.compare_at_price)}</span>}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <Link
            to={url}
            className="flex h-10 items-center justify-center whitespace-nowrap rounded-full border border-ink text-sm font-medium transition-colors duration-150 ease-snappy hover:bg-ink hover:text-white">
            
            Learn More
          </Link>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.in_stock || adding}
            className="flex h-10 items-center justify-center whitespace-nowrap rounded-full bg-black text-sm font-medium text-white transition-[background-color,transform] duration-150 ease-snappy hover:bg-brand active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-line disabled:text-muted">
            
            {adding ? <Loader2Icon className="h-4 w-4 animate-spin" aria-label="Adding" /> : product.in_stock ? 'Buy Now' : 'Sold Out'}
          </button>
        </div>
      </div>
    </article>);

}