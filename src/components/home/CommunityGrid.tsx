import React from 'react';
import { motion } from 'framer-motion';
import { communityPosts } from '../../data/homeFeatures';
import { socialLinks } from '../../data/site';
import { SocialIcon } from '../layout/SocialIcon';
import { Reveal, inViewOnce, staggerChild, staggerParent } from '../ui/Reveal';

export function CommunityGrid() {
  const instagram = socialLinks.find((s) => s.icon === 'instagram')?.href ?? 'https://instagram.com';

  return (
    <section className="bg-white pb-16 md:pb-24" aria-labelledby="community-heading">
      <div className="mx-auto max-w-site px-4 md:px-6">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="community-heading" className="text-[2.1rem] font-bold leading-tight tracking-tight md:text-[2.6rem]">
              #RideArrow
            </h2>
            <p className="mt-2 text-base font-light text-muted md:text-[17px]">Tag your ride for a chance to be featured.</p>
          </div>
          <a href={instagram} target="_blank" rel="noreferrer" className="btn-outline self-start md:self-auto">
            <SocialIcon name="instagram" className="h-4 w-4" /> Follow us
          </a>
        </Reveal>
      </div>

      <motion.ul
        className="mt-10 grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6"
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={inViewOnce}>
        
        {communityPosts.map((p) =>
        <motion.li key={p.id} variants={staggerChild}>
            <a href={instagram} target="_blank" rel="noreferrer" className="group relative block aspect-square overflow-hidden" aria-label={`${p.alt}, shared by ${p.handle}`}>
              <img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 ease-snappy group-hover:scale-[1.06]" />
              <span className="absolute inset-0 flex items-end bg-black/0 p-3 text-sm font-medium text-white opacity-0 transition-[opacity,background-color] duration-200 ease-snappy group-hover:bg-black/30 group-hover:opacity-100">
                <span className="translate-y-2 transition-transform duration-200 ease-snappy group-hover:translate-y-0">{p.handle}</span>
              </span>
            </a>
          </motion.li>
        )}
      </motion.ul>
    </section>);

}