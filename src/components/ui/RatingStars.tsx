import React from 'react';
import { StarIcon } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: string;
}

export function RatingStars({ rating, size = 'h-3.5 w-3.5' }: RatingStarsProps) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((i) =>
      <StarIcon
        key={i}
        className={`${size} ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-line text-line'}`}
        aria-hidden="true" />

      )}
    </span>);

}