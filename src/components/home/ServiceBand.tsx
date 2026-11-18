import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { images } from '../../data/site';

const serviceLinks = [
{ label: 'Book a service', text: 'Pick a date — we’ll confirm within a day.', to: '/maintenance' },
{ label: 'Check your warranty', text: 'Coverage terms and how to claim.', to: '/warranty' },
{ label: 'Track an order', text: 'Live delivery status, no account needed.', to: '/track-order' }];


export function ServiceBand() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white" aria-labelledby="service-heading">
      <img src={images.hillCountry} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 -z-10 bg-ink/60 md:bg-ink/45" aria-hidden="true" />

      <div className="mx-auto grid min-h-[560px] max-w-site content-end gap-10 px-4 py-14 md:min-h-[600px] md:px-6 md:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
        <div className="max-w-xl">
          <p className="text-base font-light text-white/85 md:text-2xl">From Colombo to Nuwara Eliya</p>
          <h2 id="service-heading" className="headline mt-2 text-[2.4rem] sm:text-5xl md:text-6xl">
            Cared for, islandwide.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/85 md:text-base">
            Book a service, check your warranty or track a delivery — our Sri Lankan team keeps you riding.
          </p>
        </div>

        <ul className="border-b border-white/20">
          {serviceLinks.map((s) =>
          <li key={s.to} className="border-t border-white/20">
              <Link to={s.to} className="group flex items-center justify-between gap-4 py-4 md:py-5">
                <span>
                  <span className="block text-base font-semibold md:text-lg">{s.label}</span>
                  <span className="mt-0.5 block text-sm text-white/70">{s.text}</span>
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 transition-colors duration-150 ease-snappy group-hover:border-white group-hover:bg-white group-hover:text-ink">
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </section>);

}