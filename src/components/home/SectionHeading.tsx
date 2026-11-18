import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';

type SectionHeadingProps = {
  id: string;
  title: string;
  description?: string;
  action?: {label: string;to: string;};
};

/** Shared heading for home sections: stacked on mobile, title/aside split from md up. */
export function SectionHeading({ id, title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
      <h2 id={id} className="headline text-[2rem] sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {(description || action) &&
      <div className="flex flex-col gap-3 md:max-w-sm md:items-end md:text-right">
          {description && <p className="text-sm text-muted md:text-base">{description}</p>}
          {action &&
        <Link to={action.to} className="group inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ink">
              {action.label}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 ease-snappy group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
        }
        </div>
      }
    </div>);

}