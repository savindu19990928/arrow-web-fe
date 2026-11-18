import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PackageSearchIcon, SearchIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { api, asList } from '../utils/api';
import { useApi } from '../hooks/useApi';
import { ProductCard } from '../components/product/ProductCard';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { useBrands, useCategories } from '../hooks/useCatalogMeta';
import type { Paginated, ProductSummary } from '../types/api';

const PAGE_SIZE = 12;

const sortOptions = [
{ value: '', label: 'Recommended' },
{ value: '-created_at', label: 'Newest' },
{ value: 'price', label: 'Price: Low to High' },
{ value: '-price', label: 'Price: High to Low' },
{ value: '-average_rating', label: 'Top Rated' }];


export function Shop() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState(params.get('search') ?? '');
  const [minPrice, setMinPrice] = useState(params.get('min_price') ?? '');
  const [maxPrice, setMaxPrice] = useState(params.get('max_price') ?? '');
  const key = params.toString();
  const page = Math.max(1, Number(params.get('page') ?? 1) || 1);

  // Lock background scroll while the mobile filter sheet is open.
  useEffect(() => {
    if (!filtersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onResize = () => window.innerWidth >= 1024 && setFiltersOpen(false);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('resize', onResize);
    };
  }, [filtersOpen]);

  useEffect(() => {
    const fromUrl = params.get('search') ?? '';
    setSearch((prev) => prev.trim() === fromUrl ? prev : fromUrl);
    setMinPrice(params.get('min_price') ?? '');
    setMaxPrice(params.get('max_price') ?? '');
  }, [key, params]);

  // Live search: results refresh as the user types.
  useEffect(() => {
    const term = search.trim();
    if (term === (params.get('search') ?? '')) return;
    const t = window.setTimeout(() => {
      const next = new URLSearchParams(params);
      term ? next.set('search', term) : next.delete('search');
      next.delete('page');
      setParams(next, { replace: true });
    }, 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const { items: categories } = useCategories();
  const { items: brands } = useBrands();

  const { data, loading, error, reload } = useApi(
    () =>
    api<Paginated<ProductSummary>>('/api/catalog/products/', {
      query: {
        category: params.get('category'),
        brand: params.get('brand'),
        search: params.get('search'),
        min_price: params.get('min_price'),
        max_price: params.get('max_price'),
        in_stock: params.get('in_stock'),
        has_3d_model: params.get('has_3d_model'),
        is_featured: params.get('is_featured'),
        ordering: params.get('ordering'),
        page,
        page_size: PAGE_SIZE
      }
    }),
    [key]
  );
  const products = asList(data);
  const total = data?.count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activeCategory = categories.find((c) => c.slug === params.get('category'));
  const activeBrand = brands.find((b) => b.slug === params.get('brand'));

  const setParam = (k: string, v: string | null) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);else
    next.delete(k);
    if (k !== 'page') next.delete('page');
    setParams(next);
  };

  const applyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    minPrice ? next.set('min_price', minPrice) : next.delete('min_price');
    maxPrice ? next.set('max_price', maxPrice) : next.delete('max_price');
    next.delete('page');
    setParams(next);
  };

  const activeChips = [
  activeCategory && { k: 'category', label: activeCategory.name },
  activeBrand && { k: 'brand', label: activeBrand.name },
  params.get('search') && { k: 'search', label: `“${params.get('search')}”` },
  params.get('in_stock') && { k: 'in_stock', label: 'In stock' },
  params.get('has_3d_model') && { k: 'has_3d_model', label: '3D view' },
  params.get('is_featured') && { k: 'is_featured', label: 'Featured' },
  (params.get('min_price') || params.get('max_price')) && { k: 'price', label: 'Price range' }].
  filter(Boolean) as {k: string;label: string;}[];

  const filters =
  <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold">Category</h3>
        <ul className="mt-3 space-y-1">
          <li>
            <button type="button" onClick={() => setParam('category', null)} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${!params.get('category') ? 'bg-ink text-white' : 'hover:bg-surface'}`}>
              All products
            </button>
          </li>
          {categories.map((c) =>
        <li key={c.id}>
              <button
            type="button"
            onClick={() => setParam('category', c.slug)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${params.get('category') === c.slug ? 'bg-ink text-white' : 'hover:bg-surface'}`}>
            
                {c.name}
                {c.product_count !== undefined && <span className="text-xs opacity-70">{c.product_count}</span>}
              </button>
            </li>
        )}
        </ul>
      </div>
      {brands.length > 0 &&
    <div>
          <h3 className="text-sm font-semibold">Brand</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {brands.map((b) =>
        <button
          key={b.id}
          type="button"
          onClick={() => setParam('brand', params.get('brand') === b.slug ? null : b.slug)}
          aria-pressed={params.get('brand') === b.slug}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
          params.get('brand') === b.slug ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink'}`
          }>
          
                {b.name}
              </button>
        )}
          </div>
        </div>
    }
      <form onSubmit={applyPrice}>
        <h3 className="text-sm font-semibold">Price (LKR)</h3>
        <div className="mt-3 flex items-center gap-2">
          <input className="input" inputMode="numeric" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ''))} aria-label="Minimum price" />
          <span className="text-muted">–</span>
          <input className="input" inputMode="numeric" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))} aria-label="Maximum price" />
        </div>
        <button type="submit" className="btn-outline mt-3 w-full">Apply</button>
      </form>
      <div>
        <h3 className="text-sm font-semibold">Availability & features</h3>
        <div className="mt-3 space-y-2.5">
          {[
        { k: 'in_stock', label: 'In stock only' },
        { k: 'has_3d_model', label: 'Has 3D view' },
        { k: 'is_featured', label: 'Featured' }].
        map((f) =>
        <label key={f.k} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-ink" checked={params.get(f.k) === 'true'} onChange={(e) => setParam(f.k, e.target.checked ? 'true' : null)} />
              {f.label}
            </label>
        )}
        </div>
      </div>
    </div>;


  return (
    <div className="mx-auto max-w-site px-4 py-10 md:px-6 md:py-14">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="headline text-4xl md:text-6xl">{activeCategory?.name ?? activeBrand?.name ?? 'Shop All'}</h1>
          <p className="mt-2 max-w-lg text-sm text-muted md:text-base">{activeCategory?.description || activeBrand?.description || 'Electric bikes, parts, batteries and accessories — delivered islandwide.'}</p>
        </div>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setParam('search', search.trim() || null);
          }}
          className="flex w-full max-w-md items-center gap-2 rounded-full border border-line px-4 focus-within:border-ink">
          
          {loading && search.trim() ?
          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-line border-t-ink" aria-hidden="true" /> :

          <SearchIcon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          }
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, SKU or brand" className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none" aria-label="Search products" />
          {search &&
          <button type="button" onClick={() => setSearch('')} className="rounded-full p-1 text-muted hover:text-ink" aria-label="Clear search">
              <XIcon className="h-4 w-4" />
            </button>
          }
        </form>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">{filters}</aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setFiltersOpen(true)} className="btn-outline lg:hidden">
                <SlidersHorizontalIcon className="h-4 w-4" aria-hidden="true" /> Filters
              </button>
              <p className="text-sm text-muted">{loading ? 'Loading…' : `${total} products`}</p>
              {activeChips.map((c) =>
              <button
                key={c.k}
                type="button"
                onClick={() => {
                  if (c.k === 'price') {
                    const next = new URLSearchParams(params);
                    next.delete('min_price');
                    next.delete('max_price');
                    setParams(next);
                  } else setParam(c.k, null);
                }}
                className="flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-medium hover:bg-line">
                
                  {c.label} <XIcon className="h-3 w-3" aria-label="Remove filter" />
                </button>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted">Sort by</span>
              <select value={params.get('ordering') ?? ''} onChange={(e) => setParam('ordering', e.target.value || null)} className="rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink">
                {sortOptions.map((o) =>
                <option key={o.value} value={o.value}>{o.label}</option>
                )}
              </select>
            </label>
          </div>

          <div className="mt-6">
            {loading ?
            <Spinner label="Loading products…" /> :
            error ?
            <ErrorState message={error} onRetry={reload} /> :
            products.length === 0 ?
            <EmptyState
              icon={PackageSearchIcon}
              title="No products found"
              text="Try a different search or remove some filters."
              action={<button type="button" className="btn-primary" onClick={() => setParams(new URLSearchParams())}>Clear all filters</button>} /> :


            <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) =>
              <ProductCard key={p.id} product={p} />
              )}
              </div>
            }
          </div>

          {pages > 1 &&
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
            <button
              key={n}
              type="button"
              onClick={() => setParam('page', String(n))}
              aria-current={n === page ? 'page' : undefined}
              className={`h-10 w-10 rounded-full text-sm font-semibold ${n === page ? 'bg-ink text-white' : 'hover:bg-surface'}`}>
              
                  {n}
                </button>
            )}
            </nav>
          }
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen &&
        <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, pointerEvents: 'none' }} transition={{ duration: 0.2 }}>
            <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close filters" onClick={() => setFiltersOpen(false)} />
            <motion.div
            role="dialog"
            aria-label="Filters"
            className="absolute inset-y-0 left-0 w-[86%] max-w-sm overflow-y-auto bg-white p-6"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}>
            
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Filters</h2>
                <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="rounded-full p-2 hover:bg-surface">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              {filters}
              <button type="button" className="btn-primary mt-8 w-full" onClick={() => setFiltersOpen(false)}>
                Show {total} products
              </button>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}