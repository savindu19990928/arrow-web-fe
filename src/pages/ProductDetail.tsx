import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  CircleXIcon,
  GitCompareArrowsIcon,
  HeartIcon,
  HomeIcon,
  MinusIcon,
  PlusIcon,
  Share2Icon,
  ShoppingCartIcon,
  ZapIcon } from
'lucide-react';
import { toast } from 'sonner';
import { api, asList } from '../utils/api';
import { formatCompact, formatLKR } from '../utils/format';
import { buildHighlights } from '../utils/productHighlights';
import { useApi } from '../hooks/useApi';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { faqs } from '../data/site';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductReviews } from '../components/product/ProductReviews';
import { ProductOverview } from '../components/product/ProductOverview';
import { ReviewsSummary } from '../components/product/ReviewsSummary';
import { SpecIcon } from '../components/product/SpecIcon';
import { ProductCard } from '../components/product/ProductCard';
import { RatingStars } from '../components/ui/RatingStars';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import type { Paginated, ProductDetail as Product, ProductSummary } from '../types/api';

type Tab = 'overview' | 'specifications' | 'features' | 'reviews' | 'faqs';

const tabs: {id: Tab;label: string;}[] = [
{ id: 'overview', label: 'Overview' },
{ id: 'specifications', label: 'Specifications' },
{ id: 'features', label: 'Features' },
{ id: 'reviews', label: 'Reviews' },
{ id: 'faqs', label: 'FAQs' }];


export function ProductDetail() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const tabsRef = useRef<HTMLDivElement>(null);
  const { data: product, loading, error, reload } = useApi(() => api<Product>(`/api/catalog/products/${slug}/`), [slug]);
  const { data: related } = useApi(
    () => api<Paginated<ProductSummary>>('/api/catalog/products/', { query: { category: product?.category.slug, page_size: 5 } }),
    [product?.category.slug],
    Boolean(product)
  );
  const [variantId, setVariantId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState<'photos' | '3d'>('photos');
  const [tab, setTab] = useState<Tab>('overview');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!product) return;
    const firstInStock = product.variants.find((v) => v.is_active && v.in_stock) ?? product.variants[0];
    setVariantId(firstInStock?.id ?? null);
    setQty(1);
    setMode('photos');
    setTab('overview');
  }, [product]);

  const specs = useMemo(() => [...(product?.specifications ?? [])].sort((a, b) => a.display_order - b.display_order), [product]);
  const specGroups = useMemo(() => {
    const groups = new Map<string, typeof specs>();
    specs.forEach((s) => groups.set(s.group, [...(groups.get(s.group) ?? []), s]));
    return Array.from(groups.entries());
  }, [specs]);

  if (loading) return <Spinner label="Loading product…" className="min-h-[60vh]" />;
  if (error || !product)
  return (
    <div className="mx-auto max-w-site px-4 py-16 md:px-6">
        <ErrorState message={error ?? 'Product not found.'} onRetry={reload} />
      </div>);


  const variant = product.variants.find((v) => v.id === variantId);
  const price = variant?.final_price ?? product.price;
  const stock = variant ? variant.stock_quantity : product.stock_quantity;
  const inStock = variant ? variant.in_stock : product.in_stock;
  const compare = product.compare_at_price && parseFloat(product.compare_at_price) > parseFloat(price) ? product.compare_at_price : null;
  const discount = compare ? Math.round((1 - parseFloat(price) / parseFloat(compare)) * 100) : 0;
  const saved = has(product.id);
  const isCycle = product.category.slug === 'electric-bicycles';
  const highlights = buildHighlights(specs, product.warranty_information);
  const relatedList = asList(related).filter((p) => p.id !== product.id).slice(0, 4);
  const badge = compare ? null : product.is_featured ? 'Best Seller' : null;

  const handleAdd = async (buyNow = false) => {
    setBusy(true);
    const ok = await add(product.id, variantId, qty, product.name);
    setBusy(false);
    if (ok && buyNow) navigate('/checkout');
  };

  const openTab = (t: Tab) => {
    setTab(t);
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.name, url });else
      {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard.');
      }
    } catch {

      /* user dismissed the share sheet */}
  };

  return (
    <div className="mx-auto max-w-site px-4 pb-8 pt-4 md:px-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs">
        <Link to="/" aria-label="Home" className="hover:text-muted">
          <HomeIcon className="h-3.5 w-3.5" />
        </Link>
        <Link to="/shop" className="hover:underline">Shop</Link>
        <ChevronRightIcon className="h-3 w-3" aria-hidden="true" />
        <Link to={`/shop?category=${product.category.slug}`} className="hover:underline">{product.category.name}</Link>
        <ChevronRightIcon className="h-3 w-3" aria-hidden="true" />
        <span aria-current="page" className="text-ink-700">{product.name}</span>
      </nav>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1.12fr_1fr]">
        <ProductGallery product={product} mode={mode} onModeChange={setMode} />

        <div>
          {badge && <span className="inline-block rounded-md bg-ink px-2.5 py-1 text-xs font-semibold text-white">{badge}</span>}
          {compare && <span className="inline-block rounded-md bg-sale px-2.5 py-1 text-xs font-semibold text-white">Sale</span>}
          <h1 className="headline mt-3 text-4xl md:text-[44px]">{product.name}</h1>
          <p className="mt-3 text-lg italic text-ink-700">{isCycle ? 'Ride Further. Live Greener.' : product.short_description}</p>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <RatingStars rating={parseFloat(product.average_rating)} size="h-4 w-4" />
            <span>{parseFloat(product.average_rating).toFixed(1)}</span>
            <button type="button" onClick={() => openTab('reviews')} className="text-ink-700 hover:underline">
              ({formatCompact(product.review_count)} reviews)
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold">{formatLKR(price)}</span>
            {compare && <span className="text-lg text-muted line-through">{formatLKR(compare)}</span>}
            {discount > 0 && <span className="rounded-md bg-sale px-2 py-0.5 text-xs font-semibold text-white">{discount}% OFF</span>}
          </div>

          <p className="mt-3 flex items-center gap-2 text-sm font-medium">
            {inStock ?
            <>
                <CircleCheckIcon className="h-[18px] w-[18px] fill-eco text-white" aria-hidden="true" />
                {stock <= 5 ? `Only ${stock} left – Ready for Delivery` : 'In Stock – Ready for Delivery'}
              </> :

            <>
                <CircleXIcon className="h-[18px] w-[18px] fill-sale text-white" aria-hidden="true" />
                Out of Stock
              </>
            }
          </p>

          <ul className="mt-4 grid grid-cols-2 border-t border-line pt-4 sm:grid-cols-4 sm:[&>*+*]:border-l sm:[&>*+*]:border-line">
            {highlights.map((h) =>
            <li key={h.label} className="flex flex-col items-center gap-1.5 px-2 py-1 text-center text-xs font-medium leading-tight">
                <SpecIcon icon={h.icon} className="h-6 w-6" />
                <span className="max-w-[90px]">{h.label}</span>
              </li>
            )}
          </ul>

          {product.variants.filter((v) => v.is_active).length > 1 &&
          <fieldset className="mt-5">
              <legend className="mb-2 text-sm font-medium">Option</legend>
              <div className="flex flex-wrap gap-2">
                {product.variants.
              filter((v) => v.is_active).
              map((v) =>
              <button
                key={v.id}
                type="button"
                disabled={!v.in_stock}
                onClick={() => setVariantId(v.id)}
                aria-pressed={variantId === v.id}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${
                variantId === v.id ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink'}`
                }>
                
                      {v.name}
                    </button>
              )}
              </div>
            </fieldset>
          }

          <div className="mt-5 flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center rounded-md border border-line">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1.5" aria-label="Decrease quantity">
                <MinusIcon className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-medium" aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(stock || 1, q + 1))} className="px-3 py-1.5" aria-label="Increase quantity">
                <PlusIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <button type="button" className="btn-primary mt-5 w-full py-3 text-base" disabled={!inStock || busy} onClick={() => handleAdd(false)}>
            <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
            {inStock ? busy ? 'Adding…' : 'Add to Cart' : 'Out of Stock'}
          </button>
          <button type="button" className="btn-outline mt-3 w-full py-3 text-base" disabled={!inStock || busy} onClick={() => handleAdd(true)}>
            <ZapIcon className="h-5 w-5 fill-current" aria-hidden="true" />
            Buy Now
          </button>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs">
            <button type="button" onClick={() => toggle(product.id)} aria-pressed={saved} className="flex items-center gap-1.5 hover:underline">
              <HeartIcon className={`h-4 w-4 ${saved ? 'fill-sale text-sale' : ''}`} aria-hidden="true" />
              {saved ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>
            <button type="button" onClick={share} className="flex items-center gap-1.5 hover:underline">
              <Share2Icon className="h-4 w-4" aria-hidden="true" />
              Share
            </button>
            <Link to={`/shop?category=${product.category.slug}`} className="flex items-center gap-1.5 hover:underline">
              <GitCompareArrowsIcon className="h-4 w-4" aria-hidden="true" />
              Compare
            </Link>
          </div>
        </div>
      </div>

      <section ref={tabsRef} className="mt-8 scroll-mt-24" aria-label="Product information">
        <div className="no-scrollbar inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-surface p-1" role="tablist">
          {tabs.map((t) =>
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-full px-6 py-1.5 text-xs font-semibold transition-colors duration-150 md:px-8 ${
            tab === t.id ? 'bg-ink text-white' : 'text-ink hover:bg-white'}`
            }>
            
              {t.label}
            </button>
          )}
        </div>

        <div className="py-7" role="tabpanel">
          {tab === 'overview' && <ProductOverview product={product} onExplore={() => setTab('features')} />}
          {tab === 'specifications' &&
          <div className="grid gap-8 md:grid-cols-2">
              {specGroups.map(([group, list]) =>
            <div key={group}>
                  <h3 className="font-display text-lg font-semibold">{group}</h3>
                  <dl className="mt-3 divide-y divide-line border-t border-line text-sm">
                    {list.map((s) =>
                <div key={s.id} className="grid grid-cols-2 gap-4 py-2.5">
                        <dt className="text-muted">{s.key}</dt>
                        <dd className="font-medium">{s.value}</dd>
                      </div>
                )}
                  </dl>
                </div>
            )}
            </div>
          }
          {tab === 'features' &&
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((h) =>
            <div key={h.label} className="flex flex-col items-center rounded-lg bg-surface px-5 py-6 text-center">
                  <SpecIcon icon={h.icon} className="h-8 w-8" />
                  <p className="mt-3 text-sm font-semibold">{h.label}</p>
                </div>
            )}
              <p className="text-sm leading-relaxed text-ink-700 sm:col-span-2 lg:col-span-4">
                <strong className="text-ink">Warranty:</strong> {product.warranty_information} —{' '}
                <Link to="/warranty" className="font-semibold text-ink underline underline-offset-2">see warranty details</Link>. Servicing and repairs by our team —{' '}
                <Link to="/maintenance" className="font-semibold text-ink underline underline-offset-2">Maintenance & Repairs</Link>.
              </p>
            </div>
          }
          {tab === 'reviews' &&
          <ProductReviews productId={product.id} slug={product.slug} average={parseFloat(product.average_rating)} count={product.review_count} />
          }
          {tab === 'faqs' &&
          <div className="max-w-3xl divide-y divide-line border-y border-line">
              {faqs.map((f) =>
            <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                    {f.q}
                    <ChevronDownIcon className="h-4 w-4 shrink-0 transition-transform duration-200 ease-snappy group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{f.a}</p>
                </details>
            )}
            </div>
          }
        </div>
      </section>

      <ReviewsSummary slug={product.slug} average={parseFloat(product.average_rating)} count={product.review_count} onSeeAll={() => openTab('reviews')} />

      {relatedList.length > 0 &&
      <section className="mt-8" aria-labelledby="related">
          <div className="flex items-center justify-between gap-4">
            <h2 id="related" className="font-display text-2xl font-semibold">You May Also Like</h2>
            <Link to="/shop" className="flex items-center gap-1.5 text-xs font-semibold hover:underline">
              View All Products <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedList.map((p) =>
          <ProductCard key={p.id} product={p} />
          )}
          </div>
        </section>
      }
    </div>);

}