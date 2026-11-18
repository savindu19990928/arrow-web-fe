import React from 'react';
import { ArrowRightIcon, CircleCheckIcon, PlayIcon } from 'lucide-react';
import { toast } from 'sonner';
import { images } from '../../data/site';
import { buildFeatureLines, specIcon } from '../../utils/productHighlights';
import { SpecIcon } from './SpecIcon';
import type { ProductDetail } from '../../types/api';

interface ProductOverviewProps {
  product: ProductDetail;
  onExplore: () => void;
}

export function ProductOverview({ product, onExplore }: ProductOverviewProps) {
  const specs = [...product.specifications].sort((a, b) => a.display_order - b.display_order);
  const features = buildFeatureLines(specs);
  const isCycle = product.category.slug === 'electric-bicycles';

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr_1.05fr] lg:items-start">
      <div>
        <h2 className="headline text-4xl">{isCycle ? 'Power Meets Performance' : "Why You'll Love It"}</h2>
        <p className="mt-4 text-sm leading-relaxed text-ink-700">{product.description}</p>
        {features.length > 0 &&
        <ul className="mt-4 space-y-1.5">
            {features.map((f) =>
          <li key={f} className="flex items-center gap-2.5 text-sm">
                <CircleCheckIcon className="h-[18px] w-[18px] shrink-0 fill-ink text-white" aria-hidden="true" />
                {f}
              </li>
          )}
          </ul>
        }
        <button type="button" onClick={onExplore} className="btn-primary mt-5 px-5 py-2 text-[13px]">
          Explore More Features <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <figure className="relative overflow-hidden rounded-xl">
        <img src={images.riderVideo} alt={`Rider on the ${product.name} on a mountain trail`} className="aspect-[16/9] w-full object-cover" />
        <button
          type="button"
          onClick={() => toast('Product video coming soon.')}
          aria-label="Play product video"
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink/90 text-white ring-4 ring-white transition-transform duration-150 ease-snappy hover:scale-105 active:scale-95">
          
          <PlayIcon className="ml-1 h-7 w-7 fill-white" />
        </button>
      </figure>

      {specs.length > 0 &&
      <div className="rounded-xl border border-line bg-surface/60 p-5">
          <h3 className="font-display text-xl font-semibold">Technical Specifications</h3>
          <dl className="mt-4 space-y-3.5 text-sm">
            {specs.map((s) =>
          <div key={s.id} className="flex items-center gap-3">
                <SpecIcon icon={specIcon(s.key)} className="h-[18px] w-[18px] shrink-0" />
                <dt className="flex-1">{s.key}</dt>
                <dd className="text-right font-medium">{s.value}</dd>
              </div>
          )}
          </dl>
        </div>
      }
    </div>);

}