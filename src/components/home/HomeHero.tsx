import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCarousel } from '../../hooks/useCarousel';
import { useLiveCampaign } from '../../hooks/useLiveCampaign';
import { heroSlides } from '../../data/heroSlides';

const SLIDE_MS = 6000;
const SWIPE_PX = 48;
const ease = [0.23, 1, 0.32, 1] as const;

export function HomeHero() {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const touchX = useRef<number | null>(null);
  const { index, goTo, next, prev } = useCarousel(heroSlides.length, SLIDE_MS, hovered);
  const campaign = useLiveCampaign();

  const base = heroSlides[index];
  const discount = campaign ? parseFloat(campaign.discount_percentage) : 0;
  const slide =
  index === 0 && campaign ?
  { ...base, offer: discount > 0 ? `Up to ${discount}% OFF with our ${campaign.title}` : campaign.title } :
  base;

  const line = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.28, ease, delay: reduceMotion ? 0 : delay }
  });

  return (
    <section
      className="relative isolate h-[calc(100svh-6.25rem)] max-h-[720px] min-h-[560px] overflow-hidden bg-[#d9d9d9] text-white"
      aria-roledescription="carousel"
      aria-label="Featured e-bikes"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onTouchStart={(e) => touchX.current = e.touches[0].clientX}
      onTouchCancel={() => touchX.current = null}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (dx <= -SWIPE_PX) next();
        if (dx >= SWIPE_PX) prev();
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      }}>
      
      <div className="absolute inset-0 -z-10">
        {heroSlides.map((s, i) => {
          const active = i === index;
          return (
            <motion.div
              key={s.id}
              aria-hidden={!active}
              className="absolute inset-0 overflow-hidden"
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease }}>
              
              {/* Slow cinematic push-in on the active slide, reset when it leaves. */}
              <motion.div
                className="h-full w-full"
                initial={false}
                animate={{ scale: active && !reduceMotion && !s.video ? 1.08 : 1 }}
                transition={active && !reduceMotion && !s.video ? { duration: SLIDE_MS / 1000 + 1, ease: 'linear' } : { duration: 0 }}>
                
                {s.video ?
                <video
                  src={s.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={i === 0 ? 'auto' : 'metadata'}
                  aria-label={active ? s.alt : undefined}
                  className="h-full w-full select-none object-cover"
                  style={{ objectPosition: s.focus }} /> :


                <img
                  src={s.image}
                  alt={active ? s.alt : ''}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                  className="h-full w-full select-none object-cover"
                  style={{ objectPosition: s.focus }} />

                }
              </motion.div>
            </motion.div>);

        })}
        <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
      </div>

      <div className="mx-auto flex h-full max-w-site flex-col justify-center px-5 pb-28 md:px-6 md:pb-16">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${heroSlides.length}`}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="max-w-xl">
            
            <motion.p {...line(0)} className="text-[2rem] font-light leading-tight tracking-tight sm:text-[2.6rem]">
              {slide.lead}
            </motion.p>
            <motion.h1 {...line(0.05)} className="text-[2.4rem] font-bold leading-tight tracking-tight sm:text-[2.9rem]">
              {slide.title}
            </motion.h1>
            <motion.p {...line(0.1)} className="mt-4 text-base font-light text-white/95 sm:text-lg">
              {slide.offer}
            </motion.p>
            <motion.div {...line(0.15)} className="mt-7">
              <Link to={slide.cta.to} className="btn-accent !px-6 !py-3.5 !text-[15px]">
                {slide.cta.label}
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-6 flex justify-center px-4">
        <div className="flex gap-1 rounded-full bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]" role="tablist" aria-label="Choose a bike">
          {heroSlides.map((s, i) =>
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show ${s.title}`}
            onClick={() => goTo(i)}
            className={`relative flex h-12 w-[68px] items-center justify-center rounded-full transition-colors duration-200 ease-snappy sm:h-[60px] sm:w-[88px] ${
            i === index ? 'bg-[#EDEDED]' : 'hover:bg-surface'}`
            }>
            
              <img src={s.thumb} alt="" className="h-full w-full object-contain p-1.5 mix-blend-multiply" draggable={false} />
            </button>
          )}
        </div>
      </div>
    </section>);

}