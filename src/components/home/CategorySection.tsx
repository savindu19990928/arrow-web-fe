import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { api, asList } from '../../utils/api';
import { useApi } from '../../hooks/useApi';
import { ProductCard } from '../product/ProductCard';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import { Reveal } from '../ui/Reveal';
import type { Category, Paginated, ProductSummary } from '../../types/api';

const ease = [0.23, 1, 0.32, 1] as const;

export function CategorySection({ category }: {category: Category;}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const { data, loading, error, reload } = useApi(
    () => api<Paginated<ProductSummary>>('/api/catalog/products/', { query: { category: category.slug, page_size: 8 } }),
    [category.slug]
  );
  const products = asList(data);

  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <section id={`cat-${category.slug}`} aria-labelledby={`cat-${category.slug}-heading`} className="py-14 md:py-20">
      <div className="mx-auto max-w-site px-4 md:px-6">
        <Reveal className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h2 id={`cat-${category.slug}-heading`} className="text-[2.1rem] font-bold leading-tight tracking-tight md:text-[2.6rem]">
            {category.name}
          </h2>
          <p className="max-w-md text-base font-light text-muted md:pb-2 md:text-right md:text-[17px]">
            {category.description || `${category.product_count ?? products.length} models, delivered islandwide.`}
          </p>
        </Reveal>

        <div className="mt-8 md:mt-10">
          {loading ?
          <Spinner label="Loading products…" className="py-16" /> :
          error ?
          <ErrorState message={error} onRetry={reload} /> :
          products.length === 0 ?
          <p className="py-12 text-center text-sm text-muted">New models arriving soon.</p> :

          <ul ref={trackRef} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 md:mx-0 md:gap-6 md:px-0">
              {products.map((p, i) =>
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, ease, delay: Math.min(i, 3) * 0.05 }}
              className="w-[82%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/3)]">
              
                  <ProductCard product={p} />
                </motion.li>
            )}
            </ul>
          }
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <Link to={`/shop?category=${category.slug}`} className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
            View all {category.name} <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
          {products.length > 3 &&
          <div className="hidden gap-2 md:flex">
              <button type="button" onClick={() => scroll(-1)} className={arrowBtn} aria-label={`Previous ${category.name}`}>
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => scroll(1)} className={arrowBtn} aria-label={`Next ${category.name}`}>
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          }
        </div>
      </div>
    </section>);

}

const arrowBtn =
'flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white transition-colors duration-150 ease-snappy hover:border-ink hover:bg-ink hover:text-white';