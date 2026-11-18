import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheckIcon, MessageSquareIcon, StarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { api, asList } from '../../utils/api';
import { errorMessage } from '../../utils/apiError';
import { formatDate } from '../../utils/format';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../contexts/AuthContext';
import { RatingStars } from '../ui/RatingStars';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import type { Paginated, Review } from '../../types/api';

interface ProductReviewsProps {
  productId: number;
  slug: string;
  average: number;
  count: number;
}

export function ProductReviews({ productId, slug, average, count }: ProductReviewsProps) {
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi(() => api<Paginated<Review>>('/api/reviews/', { query: { product_slug: slug } }), [slug]);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const reviews = asList(data);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Please select a star rating.');
      return;
    }
    setSubmitting(true);
    try {
      await api('/api/reviews/submit/', { method: 'POST', body: { product: productId, rating, title, review_text: text } });
      toast.success('Thanks! Your review has been submitted.');
      setRating(0);
      setTitle('');
      setText('');
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
      <div>
        <p className="headline text-6xl">{average.toFixed(1)}</p>
        <div className="mt-2">
          <RatingStars rating={average} size="h-5 w-5" />
        </div>
        <p className="mt-1 text-sm text-muted">Based on {count} reviews</p>

        <div className="mt-8 border-t border-line pt-6">
          <h3 className="font-semibold">Write a review</h3>
          {user ?
          <form onSubmit={submit} className="mt-4 space-y-3">
              <fieldset>
                <legend className="label">Your rating</legend>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) =>
                <button key={i} type="button" onClick={() => setRating(i)} aria-label={`${i} star${i > 1 ? 's' : ''}`} aria-pressed={rating === i}>
                      <StarIcon className={`h-7 w-7 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-line'}`} />
                    </button>
                )}
                </div>
              </fieldset>
              <div>
                <label htmlFor="rv-title" className="label">
                  Title
                </label>
                <input id="rv-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
              </div>
              <div>
                <label htmlFor="rv-text" className="label">
                  Review
                </label>
                <textarea id="rv-text" className="input min-h-[110px]" value={text} onChange={(e) => setText(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit review'}
              </button>
            </form> :

          <p className="mt-2 text-sm text-muted">
              <Link to="/login" className="font-semibold text-ink underline underline-offset-2">
                Sign in
              </Link>{' '}
              to share your experience with this product.
            </p>
          }
        </div>
      </div>

      <div>
        {loading ?
        <Spinner label="Loading reviews…" /> :
        error ?
        <ErrorState message={error} onRetry={reload} /> :
        reviews.length === 0 ?
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface py-14 text-center">
            <MessageSquareIcon className="h-6 w-6" aria-hidden="true" />
            <p className="font-semibold">No reviews yet</p>
            <p className="text-sm text-muted">Be the first to review this product.</p>
          </div> :

        <ul className="divide-y divide-line">
            {reviews.map((r) =>
          <li key={r.id} className="py-6 first:pt-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <RatingStars rating={r.rating} />
                  <span className="font-semibold">{r.title}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{r.review_text}</p>
                <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="font-medium text-ink">{r.user_name}</span>
                  {r.verified_purchase &&
              <span className="flex items-center gap-1 text-eco">
                      <BadgeCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      Verified purchase
                    </span>
              }
                  <span>· {formatDate(r.created_at)}</span>
                </p>
              </li>
          )}
          </ul>
        }
      </div>
    </div>);

}