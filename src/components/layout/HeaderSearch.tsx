import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircleIcon, ArrowRightIcon, Loader2Icon, SearchIcon, XIcon } from 'lucide-react';
import { useProductSearch } from '../../hooks/useProductSearch';
import { useCategories } from '../../hooks/useCatalogMeta';
import { formatLKR } from '../../utils/format';

type HeaderSearchProps = {
  onClose: () => void;
};

const ease = [0.23, 1, 0.32, 1] as const;

export function HeaderSearch({ onClose }: HeaderSearchProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const { term, ready, results, total, loading, error, retry } = useProductSearch(query);
  const { topLevel: categories } = useCategories();

  useEffect(() => setActive(-1), [term, results.length]);

  const goToAll = () => {
    if (!term) return;
    navigate(`/shop?search=${encodeURIComponent(term)}`);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown' && results.length) {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp' && results.length) {
      e.preventDefault();
      setActive((i) => i <= 0 ? results.length - 1 : i - 1);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && results[active]) {
      navigate(`/product/${results[active].slug}`);
      onClose();
    } else {
      goToAll();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, pointerEvents: 'none' }}
      transition={{ duration: 0.18, ease }}
      className="absolute inset-x-0 top-full border-b border-line bg-white text-ink shadow-[0_16px_32px_rgba(0,0,0,0.08)]">
      
      <form onSubmit={submit} className="mx-auto flex max-w-site items-center gap-3 px-4 py-3 md:px-6" role="search">
        {loading ?
        <Loader2Icon className="h-5 w-5 shrink-0 animate-spin text-muted" aria-hidden="true" /> :

        <SearchIcon className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
        }
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search e-bikes, batteries, parts…"
          className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none"
          role="combobox"
          aria-label="Search products"
          aria-expanded={ready}
          aria-controls="header-search-results"
          aria-activedescendant={active >= 0 ? `search-result-${results[active]?.id}` : undefined}
          aria-autocomplete="list" />
        
        {query &&
        <button type="button" onClick={() => setQuery('')} className="rounded-full p-1.5 text-muted hover:bg-surface hover:text-ink" aria-label="Clear search">
            <XIcon className="h-4 w-4" />
          </button>
        }
        <button type="button" onClick={onClose} className="hidden rounded-full px-3 py-1.5 text-sm font-semibold text-muted hover:bg-surface hover:text-ink sm:block">
          Close
        </button>
      </form>

      <div className="mx-auto max-w-site border-t border-line px-4 pb-5 pt-4 md:px-6" aria-live="polite">
        {!ready ?
        <div>
            <p className="text-xs font-semibold text-muted">Popular categories</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.slice(0, 8).map((c) =>
            <Link
              key={c.id}
              to={`/shop?category=${c.slug}`}
              onClick={onClose}
              className="rounded-full border border-line px-3.5 py-1.5 text-sm transition-colors duration-150 hover:border-ink">
              
                  {c.name}
                </Link>
            )}
              {categories.length === 0 && <p className="text-sm text-muted">Start typing to see matching products.</p>}
            </div>
          </div> :
        error ?
        <div className="flex items-center gap-3 py-2 text-sm">
            <AlertCircleIcon className="h-5 w-5 text-sale" aria-hidden="true" />
            <span className="text-ink-700">{error}</span>
            <button type="button" onClick={retry} className="font-semibold underline underline-offset-2">
              Try again
            </button>
          </div> :
        loading && results.length === 0 ?
        <ul className="grid gap-2 md:grid-cols-2" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) =>
          <li key={i} className="flex items-center gap-3 p-2">
                <span className="h-14 w-14 animate-pulse rounded-lg bg-surface" />
                <span className="flex-1 space-y-2">
                  <span className="block h-3 w-3/4 animate-pulse rounded bg-surface" />
                  <span className="block h-3 w-1/3 animate-pulse rounded bg-surface" />
                </span>
              </li>
          )}
          </ul> :
        results.length === 0 ?
        <div className="py-2">
            <p className="text-sm font-semibold">No products match “{term}”</p>
            <p className="mt-1 text-sm text-muted">Check the spelling, or try a brand, model or SKU.</p>
          </div> :

        <>
            <ul id="header-search-results" role="listbox" className={`grid gap-1 md:grid-cols-2 ${loading ? 'opacity-60' : ''} transition-opacity duration-150`}>
              {results.map((p, i) =>
            <li key={p.id} id={`search-result-${p.id}`} role="option" aria-selected={i === active}>
                  <Link
                to={`/product/${p.slug}`}
                onClick={onClose}
                onMouseEnter={() => setActive(i)}
                className={`flex items-center gap-3 rounded-xl p-2 transition-colors duration-150 ${i === active ? 'bg-surface' : ''}`}>
                
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface">
                      {p.primary_image && <img src={p.primary_image} alt="" className="h-full w-full object-contain p-1 mix-blend-multiply" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        <Highlight text={p.name} term={term} />
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {[p.category?.name, p.brand?.name].filter(Boolean).join(' · ')}
                        {!p.in_stock && ' · Out of stock'}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-semibold">{formatLKR(p.price)}</span>
                      {p.compare_at_price && <span className="block text-xs text-muted line-through">{formatLKR(p.compare_at_price)}</span>}
                    </span>
                  </Link>
                </li>
            )}
            </ul>
            <button type="button" onClick={goToAll} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover">
              View all {total} result{total === 1 ? '' : 's'} for “{term}”
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        }
      </div>
    </motion.div>);

}

function Highlight({ text, term }: {text: string;term: string;}) {
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (!term || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-brand-soft text-ink">{text.slice(i, i + term.length)}</mark>
      {text.slice(i + term.length)}
    </>);

}