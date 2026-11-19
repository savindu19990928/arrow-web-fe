import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRightIcon } from 'lucide-react';

interface PageHeroProps {
  title: string;
  accent?: string;
  subtitle?: string;
  image?: string;
  crumbs?: {label: string;to?: string;}[];
}

const ease = [0.23, 1, 0.32, 1] as const;

export function PageHero({ title, accent, subtitle, image, crumbs = [] }: PageHeroProps) {
  const reduce = useReducedMotion();
  const line = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.15 : 0.3, ease, delay: reduce ? 0 : delay }
  });

  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      {image &&
      <motion.img
        src={image}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-55"
        initial={reduce ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }} />

      }
      <div className="mx-auto flex min-h-[340px] max-w-site flex-col justify-end px-4 pb-10 pt-16 md:min-h-[420px] md:px-6 md:pb-14">
        <motion.nav {...line(0)} aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/85">
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
        </motion.nav>
        <motion.h1 {...line(0.06)} className="headline mt-4 max-w-2xl text-4xl md:text-6xl">
          {title} {accent}
        </motion.h1>
        {subtitle &&
        <motion.p {...line(0.12)} className="mt-4 max-w-md text-base text-white/90 md:text-lg">
            {subtitle}
          </motion.p>
        }
      </div>
    </section>);

}