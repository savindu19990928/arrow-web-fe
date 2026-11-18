import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { api, asList } from '../../utils/api';
import { useApi } from '../../hooks/useApi';
import { formatDate } from '../../utils/format';
import type { Campaign, Paginated } from '../../types/api';
import { SectionHeading } from './SectionHeading';

export function CampaignBanners() {
  const { data, loading, error } = useApi(() => api<Campaign[] | Paginated<Campaign>>('/api/promotions/campaigns/'));
  const campaigns = asList(data).filter((c) => c.is_live || c.is_active);

  if (loading || error || campaigns.length === 0) return null;

  return (
    <section className="mx-auto max-w-site px-4 py-16 md:px-6 md:py-24" aria-labelledby="offers-heading">
      <SectionHeading id="offers-heading" title="Current offers" action={{ label: 'Shop all deals', to: '/shop' }} />
      <div className={`mt-8 grid gap-4 md:mt-10 md:gap-6 ${campaigns.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {campaigns.slice(0, 4).map((c) =>
        <Link key={c.id} to="/shop" className="group relative flex min-h-[280px] overflow-hidden rounded-3xl bg-ink text-white md:min-h-[340px]">
            {c.banner &&
          <img src={c.banner} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-300 ease-snappy group-hover:scale-[1.03]" loading="lazy" />
          }
            <div className="relative mt-auto w-full bg-ink/70 p-6 md:p-8">
              {parseFloat(c.discount_percentage) > 0 &&
            <p className="text-sm font-semibold text-brand-bright">Up to {parseFloat(c.discount_percentage)}% off</p>
            }
              <h3 className="mt-1 text-2xl font-extrabold tracking-tight md:text-3xl">{c.title}</h3>
              <p className="mt-2 max-w-md text-sm text-white/85">{c.description}</p>
              <p className="mt-4 flex items-center justify-between gap-4 text-xs text-white/70">
                Ends {formatDate(c.end_date)}
                <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  Shop the offer <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </span>
              </p>
            </div>
          </Link>
        )}
      </div>
    </section>);

}