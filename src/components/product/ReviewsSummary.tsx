import React, { useRef } from 'react';
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react';
import { api, asList } from '../../utils/api';
import { formatDate } from '../../utils/format';
import { useApi } from '../../hooks/useApi';
import { RatingStars } from '../ui/RatingStars';
import type { Paginated, Review } from '../../types/api';

interface ReviewsSummaryProps {
  slug: string;
  average: number;
  count: number;
  onSeeAll: () => void;
}

export function ReviewsSummary({ slug, average, count, onSeeAll }: ReviewsSummaryProps) {
  const { data, loading } = useApi(() => api<Paginated<Review>>('/api/reviews/', { query: { product_slug: slug } }), [slug]);
  const reviews = asList(data);
  const trackRef = useRef<HTMLDivElement>(null);

  const total = reviews.length || 1;
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const n = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, pct: reviews.length ? Math.round(n / total * 100) : 0 };
  });

  return (
    <section className="border-t border-line pt-6" aria-labelledby="customer-reviews">
      <div className="flex items-center justify-between gap-4">
        <h2 id="customer-reviews" className="font-display text-2xl font-semibold">
          Customer Reviews
        </h2>
        <button type="button" onClick={onSeeAll} className="flex items-center gap-1.5 text-xs font-semibold hover:underline">
          See All Reviews <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[150px_220px_1fr] lg:items-center">
        <div>
          <p className="font-display text-5xl font-bold">{average.toFixed(1)}</p>
          <div className="mt-1">
            <RatingStars rating={average} size="h-4 w-4" />
          </div>
          <p className="mt-2 text-xs text-ink-700">Based on {count} reviews</p>
        </div>

        <div className="rounded-lg border border-line p-3">
          <ul className="space-y-1.5" aria-label="Rating distribution">
            {distribution.map((d) =>
            <li key={d.star} className="flex items-center gap-2 text-[11px]">
                <span className="w-9 shrink-0">{d.star} Star</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
                  <span className="block h-full rounded-full bg-amber-400" style={{ width: `${d.pct}%` }} />
                </span>
                <span className="w-8 shrink-0 text-right">{d.pct}%</span>
              </li>
            )}
          </ul>
        </div>

        <div className="relative min-w-0">
          {loading ?
          <div className="grid gap-3 sm:grid-cols-3" aria-hidden="true">
              {[0, 1, 2].map((i) =>
            <div key={i} className="h-[118px] animate-pulse rounded-lg bg-surface" />
            )}
            </div> :
          reviews.length === 0 ?
          <p className="rounded-lg bg-surface px-5 py-8 text-center text-sm text-muted">No reviews yet — be the first to share your experience.</p> :

          <>
              <div ref={trackRef} className="no-scrollbar flex snap-x gap-3 overflow-x-auto pr-10">
                {reviews.map((r) =>
              <article key={r.id} className="flex w-[78%] shrink-0 snap-start flex-col rounded-lg border border-line bg-surface/50 p-3.5 sm:w-[calc((100%-1.5rem)/3)]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white" aria-hidden="true">
                        {r.user_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold">{r.user_name}</p>
                        <RatingStars rating={r.rating} size="h-3 w-3" />
                      </div>
                    </div>
                    <p className="mt-2.5 line-clamp-2 text-xs leading-snug text-ink-700">“{r.review_text}”</p>
                    <p className="mt-auto pt-3 text-[11px] text-muted">{formatDate(r.created_at)}</p>
                  </article>
              )}
              </div>
              {reviews.length > 3 &&
            <button
              type="button"
              onClick={() => trackRef.current?.scrollBy({ left: 240, behavior: 'smooth' })}
              aria-label="More reviews"
              className="absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white shadow-sm transition-colors duration-150 hover:bg-surface">
              
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
            }
            </>
          }
        </div>
      </div>
    </section>);

}