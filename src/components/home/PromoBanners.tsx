import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { promoBanners } from '../../data/homeFeatures';
import { inViewOnce, staggerChild, staggerParent } from '../ui/Reveal';

export function PromoBanners() {
  return (
    <section className="bg-white py-16 md:py-24" aria-label="Visit and service">
      <motion.div
        className="mx-auto grid max-w-site gap-4 px-4 md:grid-cols-2 md:gap-6 md:px-6"
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={inViewOnce}>
        
        {promoBanners.map((b) =>
        <motion.div key={b.id} variants={staggerChild}>
            <Link to={b.cta.to} className="group relative isolate flex aspect-[4/3] overflow-hidden rounded-3xl text-white md:aspect-[5/4] lg:aspect-[4/3]">
              <img
              src={b.image}
              alt={b.alt}
              loading="lazy"
              className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-300 ease-snappy group-hover:scale-[1.04]" />
            
              <span className="absolute inset-0 -z-10 bg-black/35 transition-colors duration-200 ease-snappy group-hover:bg-black/45" aria-hidden="true" />
              <div className="mt-auto p-6 md:p-9">
                <h3 className="text-[1.9rem] font-bold leading-tight tracking-tight md:text-[2.3rem]">{b.title}</h3>
                <p className="mt-2 max-w-sm text-[15px] font-light text-white/90 md:text-base">{b.text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-150 ease-snappy group-hover:bg-brand group-hover:text-white">
                  {b.cta.label}
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-snappy group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>);

}