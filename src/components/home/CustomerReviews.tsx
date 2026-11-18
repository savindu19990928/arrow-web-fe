import React from 'react';
import { BadgeCheckIcon } from 'lucide-react';
import { api, asList } from '../../utils/api';
import { useApi } from '../../hooks/useApi';
import { formatDate } from '../../utils/format';
import { RatingStars } from '../ui/RatingStars';
import { images } from '../../data/site';
import type { Paginated, Review } from '../../types/api';

export function CustomerReviews() {
  const { data, loading, error } = useApi(() => api<Paginated<Review> | Review[]>('/api/reviews/', { query: { page_size: 9 } }));
  const reviews = asList(data).
  filter((r) => r.rating >= 4).
  slice(0, 6);

  if (loading || error || reviews.length === 0) return null;

  const average = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <section id="reviews" className="bg-surface py-16 md:py-24" aria-labelledby="reviews-heading">
      <div className="mx-auto grid max-w-site gap-10 px-4 md:px-6 lg:grid-cols-[360px_1fr]">
        <div className="flex flex-col">
          <h2 id="reviews-heading" className="headline text-[2rem] sm:text-4xl md:text-5xl">
            Riders say it best
          </h2>
          <div className="mt-6 flex items-center gap-3">
            <span className="text-5xl font-extrabold tracking-tight">{average.toFixed(1)}</span>
            <div>
              <RatingStars rating={average} />
              <p className="mt-1 text-xs text-muted">From verified Arrow Ventures customers</p>
            </div>
          </div>
          <img src={images.commuter} alt="An Arrow rider beside his e-bike on a Colombo street" className="mt-8 hidden aspect-[4/5] w-full rounded-3xl object-cover lg:block" loading="lazy" />
        </div>

        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0">
          {reviews.map((r) =>
          <li key={r.id} className="flex w-[84%] shrink-0 snap-start flex-col rounded-3xl bg-white p-6 sm:w-auto">
              <RatingStars rating={r.rating} />
              <p className="mt-4 text-base font-bold leading-snug">{r.title}</p>
              <p className="mt-2 line-clamp-5 text-sm text-ink-700">{r.review_text}</p>
              <p className="mt-auto flex flex-wrap items-center gap-2 pt-5 text-xs text-muted">
                <span className="font-semibold text-ink">{r.user_name}</span>
                {r.verified_purchase &&
              <span className="flex items-center gap-1 text-eco">
                    <BadgeCheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> Verified purchase
                  </span>
              }
                <span>· {formatDate(r.created_at)}</span>
              </p>
            </li>
          )}
        </ul>
      </div>
    </section>);

}