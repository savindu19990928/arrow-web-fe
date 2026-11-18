import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';

interface PageHeroProps {
  title: string;
  accent?: string;
  subtitle?: string;
  image?: string;
  crumbs?: {label: string;to?: string;}[];
}

export function PageHero({ title, accent, subtitle, image, crumbs = [] }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      {image && <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-55" />}
      <div className="mx-auto flex min-h-[340px] max-w-site flex-col justify-end px-4 pb-10 pt-16 md:min-h-[420px] md:px-6 md:pb-14">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/85">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          {crumbs.map((c) =>
          <React.Fragment key={c.label}>
              <ChevronRightIcon className="h-3 w-3" aria-hidden="true" />
              {c.to ?
            <Link to={c.to} className="hover:text-white">
                  {c.label}
                </Link> :

            <span aria-current="page">{c.label}</span>
            }
            </React.Fragment>
          )}
        </nav>
        <h1 className="headline mt-4 max-w-2xl text-4xl md:text-6xl">
          {title} {accent}
        </h1>
        {subtitle && <p className="mt-4 max-w-md text-base text-white/90 md:text-lg">{subtitle}</p>}
      </div>
    </section>);

}