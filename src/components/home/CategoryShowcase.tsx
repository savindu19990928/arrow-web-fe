import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon, PackageSearchIcon } from 'lucide-react';
import { api, asList } from '../../utils/api';
import { useApi } from '../../hooks/useApi';
import { useCategories } from '../../hooks/useCatalogMeta';
import { ProductCard } from '../product/ProductCard';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import { SectionHeading } from './SectionHeading';
import type { Paginated, ProductSummary } from '../../types/api';

export function CategoryShowcase() {
  const { topLevel, loading: catLoading, error: catError, reload: reloadCats } = useCategories();
  const tabs = topLevel.filter((c) => (c.product_count ?? 1) > 0);
  const [slug, setSlug] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug && tabs.length) setSlug(tabs[0].slug);
  }, [slug, tabs]);

  const active = tabs.find((c) => c.slug === slug);
  const { data, loading, error, reload } = useApi(
    () => api<Paginated<ProductSummary>>('/api/catalog/products/', { query: { category: slug, page_size: 8 } }),
    [slug],
    Boolean(slug)
  );
  const products = asList(data);

  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  if (catLoading) return <Spinner label="Loading categories…" className="py-16" />;
  if (catError) return <div className="px-4 py-12"><ErrorState message={catError} onRetry={reloadCats} /></div>;
  if (tabs.length === 0) return null;

  return (
    <section aria-labelledby="showcase-heading">
      <div className="sticky top-14 z-20 border-b border-line bg-white md:top-16">
        <div className="mx-auto flex max-w-site items-center gap-6 px-4 md:px-6">
          <p className="hidden shrink-0 py-4 text-base font-bold md:block">Shop by category</p>
          <div role="tablist" aria-label="Product categories" className="no-scrollbar -mx-4 flex flex-1 gap-6 overflow-x-auto px-4 md:mx-0 md:justify-end md:gap-10 md:px-0">
            {tabs.map((c) =>
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={c.slug === slug}
              onClick={() => setSlug(c.slug)}
              className={`relative shrink-0 whitespace-nowrap py-4 text-[15px] transition-colors duration-150 ${
              c.slug === slug ? 'font-bold text-ink' : 'text-muted hover:text-ink'}`
              }>
              
                {c.name}
                {c.slug === slug && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-ink" aria-hidden="true" />}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-surface py-12 md:py-20">
        <div className="mx-auto max-w-site px-4 md:px-6">
          <SectionHeading
            id="showcase-heading"
            title={active?.name ?? 'Products'}
            description={active?.description || `${active?.product_count ?? products.length} products, delivered islandwide.`} />
          

          <div className="mt-8 md:mt-10">
            {loading ?
            <Spinner label="Loading products…" /> :
            error ?
            <ErrorState message={error} onRetry={reload} /> :
            products.length === 0 ?
            <div className="flex flex-col items-center py-12 text-center text-muted">
                <PackageSearchIcon className="h-8 w-8" aria-hidden="true" />
                <p className="mt-3 text-sm">No products in this category yet.</p>
              </div> :

            <div ref={trackRef} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:gap-6 md:px-0">
                {products.map((p) =>
              <div key={p.id} className="w-[74%] shrink-0 snap-start rounded-3xl bg-white p-3 sm:w-[44%] sm:p-4 lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]">
                    <ProductCard product={p} />
                  </div>
              )}
              </div>
            }
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Link to={slug ? `/shop?category=${slug}` : '/shop'} className="btn-primary w-full sm:w-auto">
              View all {active?.name ?? 'products'}
            </Link>
            {products.length > 3 &&
            <div className="hidden gap-2 md:flex">
                <button type="button" onClick={() => scroll(-1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white transition-colors duration-150 hover:bg-line" aria-label="Scroll products left">
                  <ArrowLeftIcon className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => scroll(1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white transition-colors duration-150 hover:bg-line" aria-label="Scroll products right">
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </section>);

}