import React, { useRef } from 'react';
import { BadgeCheckIcon, ChevronLeftIcon, ChevronRightIcon, QuoteIcon } from 'lucide-react';
import { api, asList } from '../../utils/api';
import { useApi } from '../../hooks/useApi';
import { formatDate } from '../../utils/format';
import { RatingStars } from '../ui/RatingStars';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import { Reveal, inViewOnce, staggerChild, staggerParent } from '../ui/Reveal';
import { motion } from 'framer-motion';
import type { Paginated, Review } from '../../types/api';

export function ReviewsSection() {
  const trackRef = useRef<HTMLUListElement>(null);
  const { data, loading, error, reload } = useApi(() => api<Paginated<Review> | Review[]>('/api/reviews/', { query: { page_size: 12 } }));
  const all = asList(data);
  const reviews = all.filter((r) => r.rating >= 4).slice(0, 10);
  const average = all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 0;
  const total = data && !Array.isArray(data) ? data.count : all.length;

  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <section id="reviews" className="bg-surface py-16 md:py-24" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-site px-4 md:px-6">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="reviews-heading" className="text-[2.1rem] font-bold leading-tight tracking-tight md:text-[2.6rem]">
              Loved by Riders
            </h2>
            <p className="mt-2 text-base font-light text-muted md:text-[17px]">Real words from verified Arrow customers.</p>
          </div>
          {all.length > 0 &&
          <div className="flex items-center gap-4">
              <span className="text-5xl font-bold tracking-tight">{average.toFixed(1)}</span>
              <div>
                <RatingStars rating={average} size="h-4 w-4" />
                <p className="mt-1 text-sm text-muted">Based on {total} reviews</p>
              </div>
            </div>
          }
        </Reveal>

        <div className="mt-10">
          {loading ?
          <Spinner label="Loading reviews…" className="py-12" /> :
          error ?
          <ErrorState message={error} onRetry={reload} /> :
          reviews.length === 0 ?
          <p className="py-10 text-center text-sm text-muted">Reviews will appear here once riders share their experience.</p> :

          <motion.ul
            ref={trackRef}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:mx-0 md:gap-6 md:px-0"
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={inViewOnce}>
            
              {reviews.map((r) =>
            <motion.li
              key={r.id}
              variants={staggerChild}
              className="flex w-[85%] shrink-0 snap-start flex-col rounded-2xl bg-white p-6 sm:w-[calc((100%-1rem)/2)] md:p-7 lg:w-[calc((100%-3rem)/3)]">
              
                  <div className="flex items-center justify-between">
                    <RatingStars rating={r.rating} />
                    <QuoteIcon className="h-6 w-6 text-brand-bright" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-lg font-semibold leading-snug">{r.title}</p>
                  <p className="mt-2 line-clamp-5 text-[15px] font-light leading-relaxed text-ink-700">{r.review_text}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-4 text-sm">
                    <span className="font-semibold">{r.user_name}</span>
                    {r.verified_purchase &&
                <span className="flex items-center gap-1 text-eco">
                        <BadgeCheckIcon className="h-4 w-4" aria-hidden="true" /> Verified
                      </span>
                }
                    <span className="ml-auto text-muted">{formatDate(r.created_at)}</span>
                  </div>
                </motion.li>
            )}
            </motion.ul>
          }
        </div>

        {reviews.length > 3 &&
        <div className="mt-8 hidden justify-end gap-2 md:flex">
            <button type="button" onClick={() => scroll(-1)} className={arrowBtn} aria-label="Previous reviews">
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => scroll(1)} className={arrowBtn} aria-label="Next reviews">
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        }
      </div>
    </section>);

}

const arrowBtn =
'flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white transition-colors duration-150 ease-snappy hover:border-ink hover:bg-ink hover:text-white';