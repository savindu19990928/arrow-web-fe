import React, { useEffect, useState } from 'react';
import { useCategories } from '../../hooks/useCatalogMeta';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import { CategorySection } from './CategorySection';

/** Tenways-style sticky "Electric Bikes" sub-nav with one product row per category, scroll-spied. */
export function CategorySections() {
  const { topLevel, loading, error, reload } = useCategories();
  const cats = topLevel.filter((c) => (c.product_count ?? 1) > 0).slice(0, 4);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!cats.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id.replace('cat-', ''));
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    cats.forEach((c) => {
      const el = document.getElementById(`cat-${c.slug}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cats.map((c) => c.slug).join()]);

  if (loading) return <Spinner label="Loading e-bikes…" className="py-20" />;
  if (error) return <div className="px-4 py-12"><ErrorState message={error} onRetry={reload} /></div>;
  if (cats.length === 0) return null;

  const current = active ?? cats[0].slug;

  return (
    <div>
      <nav aria-label="E-bike categories" className="sticky top-14 z-30 border-b border-line bg-white">
        <div className="mx-auto flex max-w-site items-center gap-8 px-4 md:px-6">
          <p className="hidden shrink-0 py-3.5 text-[17px] font-bold md:block">Electric Bikes</p>
          <ul className="no-scrollbar -mx-4 flex flex-1 gap-7 overflow-x-auto px-4 md:mx-0 md:justify-end md:gap-11 md:px-0">
            {cats.map((c) =>
            <li key={c.id}>
                <button
                type="button"
                onClick={() => document.getElementById(`cat-${c.slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                aria-current={c.slug === current ? 'true' : undefined}
                className={`whitespace-nowrap py-3.5 text-[17px] transition-colors duration-150 ${
                c.slug === current ? 'font-bold text-ink' : 'text-ink-600 hover:text-ink'}`
                }>
                
                  {c.name}
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <div className="bg-surface">
        {cats.map((c) =>
        <CategorySection key={c.id} category={c} />
        )}
      </div>
    </div>);

}