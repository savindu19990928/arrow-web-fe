import React from 'react';
import { Link } from 'react-router-dom';
import { useBrands } from '../../hooks/useCatalogMeta';

export function BrandStrip() {
  const { items, loading, error } = useBrands();
  if (loading || error || items.length === 0) return null;

  return (
    <section className="mx-auto max-w-site px-4 py-14 md:px-6 md:py-16" aria-labelledby="brands-heading">
      <h2 id="brands-heading" className="text-center text-sm font-semibold text-muted">
        Brands we carry
      </h2>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 md:mt-8 md:gap-x-12">
        {items.map((b) =>
        <li key={b.id}>
            <Link to={`/shop?brand=${b.slug}`} className="flex h-12 items-center opacity-70 transition-opacity duration-150 hover:opacity-100" title={b.name}>
              {b.logo ?
            <img src={b.logo} alt={b.name} className="h-10 w-auto max-w-[140px] object-contain grayscale" loading="lazy" /> :

            <span className="text-lg font-extrabold tracking-tight">{b.name}</span>
            }
            </Link>
          </li>
        )}
      </ul>
    </section>);

}