import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, MapPinIcon, PauseIcon, PlayIcon } from 'lucide-react';
import { api, asList } from '../../utils/api';
import { useApi } from '../../hooks/useApi';
import { useCarousel } from '../../hooks/useCarousel';
import { heroSlides } from '../../data/heroSlides';
import type { Campaign, Paginated } from '../../types/api';

const SLIDE_MS = 7000;
const SWIPE_PX = 48;
const ease = [0.23, 1, 0.32, 1] as const;

export function HomeHero() {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const paused = hovered || userPaused;
  const { index, progress, goTo, next, prev } = useCarousel(heroSlides.length, SLIDE_MS, paused);

  const { data: campaignData } = useApi(() => api<Campaign[] | Paginated<Campaign>>('/api/promotions/campaigns/'));
  const campaign = asList(campaignData).find((c) => c.is_live) ?? null;

  const base = heroSlides[index];
  const slide = index === 0 && campaign ? { ...base, title: campaign.title, text: campaign.description || base.text } : base;

  return (
    <section
      className="relative isolate flex h-[calc(100svh-3.5rem)] max-h-[860px] min-h-[560px] flex-col overflow-hidden bg-ink text-white md:h-[calc(100svh-4rem)] md:max-h-[800px] md:min-h-[620px]"
      aria-roledescription="carousel"
      aria-label="Arrow on Sri Lankan roads"
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
      
      {/* Images — all stacked and always mounted (preloads them and can never desync) */}
      <div className="absolute inset-0 -z-10">
        {heroSlides.map((s, i) =>
        <motion.div
          key={s.id}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease }}
          aria-hidden={i !== index}>
          
            <img
            src={s.image}
            alt={i === index ? s.alt : ''}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            className="h-full w-full select-none object-cover"
            style={{ objectPosition: s.focus }} />
          
          </motion.div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-ink/50 sm:bg-ink/40 lg:bg-ink/30" aria-hidden="true" />
      </div>

      {/* Copy — keyed remount with entrance only; no exit wait that could stall on rapid changes */}
      <div className="mx-auto flex w-full max-w-site flex-1 flex-col justify-end px-5 pb-6 pt-16 sm:px-6 md:justify-center md:pb-0">
        <motion.div
          key={slide.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${heroSlides.length}`}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.24, ease }}
          className="max-w-[34rem] lg:max-w-[40rem]">
          
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md sm:text-sm">
              <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {slide.location}
            </p>
            <h1 className="headline mt-4 text-[2.1rem] min-[400px]:text-[2.6rem] sm:text-6xl lg:text-7xl">{slide.title}</h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/85 sm:text-lg">{slide.text}</p>
            <div className="mt-7 flex flex-col gap-3 min-[400px]:flex-row sm:mt-9">
              <Link to={slide.cta.to} className="btn-accent">
                {slide.cta.label}
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
              to="/shop"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border-[1.5px] border-white/70 px-[1.4rem] py-[0.75rem] text-sm font-semibold text-white transition-colors duration-150 ease-snappy hover:bg-white hover:text-ink">
              
                Shop all
              </Link>
            </div>
          </motion.div>
      </div>

      {/* Controls */}
      <div className="w-full pb-5 sm:pb-8">
        <div className="mx-auto flex max-w-site items-end gap-4 px-5 sm:gap-6 sm:px-6">
          <div className="grid flex-1 grid-cols-4 gap-2 md:max-w-2xl md:gap-5" role="tablist" aria-label="Choose a scene">
            {heroSlides.map((s, i) =>
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${s.label}`}
              onClick={() => goTo(i)}
              className="group py-3 text-left">
              
                <span
                className={`mb-2.5 hidden truncate text-xs font-semibold transition-colors duration-150 md:block ${
                i === index ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`
                }>
                
                  {s.label}
                </span>
                <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/25">
                  <ProgressFill key={`${s.id}-${index}`} active={i === index} done={i < index} progress={progress} />
                </span>
              </button>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setUserPaused((v) => !v)}
              className={controlBtn}
              aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}>
              
              {userPaused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
            </button>
            <button type="button" onClick={prev} className={`${controlBtn} hidden md:flex`} aria-label="Previous scene">
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button type="button" onClick={next} className={`${controlBtn} hidden md:flex`} aria-label="Next scene">
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>);

}

const controlBtn =
'flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-colors duration-150 ease-snappy hover:bg-white hover:text-ink md:h-11 md:w-11';

function ProgressFill({ active, done, progress }: {active: boolean;done: boolean;progress: MotionValue<number>;}) {
  const scaleX = useTransform(progress, (v) => active ? v : done ? 1 : 0);
  return <motion.span className="absolute inset-0 origin-left rounded-full bg-white" style={{ scaleX }} />;
}