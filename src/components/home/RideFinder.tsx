import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from 'lucide-react';
import { rideStyles } from '../../data/rideStyles';
import { SectionHeading } from './SectionHeading';

export function RideFinder() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="ride-heading">
      <div className="mx-auto max-w-site px-4 md:px-6">
        <SectionHeading id="ride-heading" title="Find your ride" description="Tell us how you ride — we’ll show you the bikes built for it." />
      </div>

      <ul className="no-scrollbar mx-auto mt-8 flex max-w-site snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mt-10 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-6">
        {rideStyles.map((r) =>
        <li key={r.id} className="w-[78%] shrink-0 snap-start sm:w-[46%] md:w-auto">
            <Link to={r.to} className="group flex h-full flex-col">
              <span className="relative block overflow-hidden rounded-3xl bg-surface">
                <img
                src={r.image}
                alt={r.alt}
                className="aspect-[4/5] w-full object-cover transition-transform duration-300 ease-snappy group-hover:scale-[1.03]"
                loading="lazy" />
              
                <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink transition-colors duration-150 ease-snappy group-hover:bg-brand group-hover:text-white">
                  <ArrowUpRightIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              </span>
              <span className="mt-4 block px-1 text-lg font-bold tracking-tight md:text-xl">{r.title}</span>
              <span className="mt-1 block px-1 text-sm text-muted">{r.text}</span>
            </Link>
          </li>
        )}
      </ul>
    </section>);

}