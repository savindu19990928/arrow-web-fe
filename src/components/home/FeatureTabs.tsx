import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { useCarousel } from '../../hooks/useCarousel';
import { homeFeatures } from '../../data/homeFeatures';
import { Reveal } from '../ui/Reveal';

const ease = [0.23, 1, 0.32, 1] as const;

export function FeatureTabs() {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const { index, progress, goTo } = useCarousel(homeFeatures.length, 6000, hovered);

  return (
    <section className="bg-white py-16 md:py-24" aria-labelledby="features-heading">
      <div className="mx-auto max-w-site px-4 md:px-6">
        <Reveal>
          <h2 id="features-heading" className="text-[2.1rem] font-bold leading-tight tracking-tight md:text-[2.6rem]">
            Why Ride Arrow
          </h2>
          <p className="mt-2 max-w-xl text-base font-light text-muted md:text-[17px]">Thoughtful engineering that disappears the moment you start pedalling.</p>
        </Reveal>

        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.3, ease }}
          className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[1.5fr_1fr] lg:gap-14"
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
          onPointerLeave={() => setHovered(false)}>
          
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-surface">
            {homeFeatures.map((f, i) =>
            <motion.img
              key={f.id}
              src={f.image}
              alt={i === index ? f.alt : ''}
              aria-hidden={i !== index}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              initial={false}
              animate={{ opacity: i === index ? 1 : 0, scale: i === index || reduceMotion ? 1 : 1.04 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease }} />

            )}
          </div>

          <ul className="flex flex-col justify-center" role="tablist" aria-label="Arrow features">
            {homeFeatures.map((f, i) => {
              const active = i === index;
              return (
                <li key={f.id} className="border-b border-line last:border-b-0">
                  <button type="button" role="tab" aria-selected={active} onClick={() => goTo(i)} className="w-full py-5 text-left">
                    <span className={`block text-xl font-semibold transition-colors duration-200 md:text-2xl ${active ? 'text-ink' : 'text-ink/35 hover:text-ink/60'}`}>
                      {f.title}
                    </span>
                    <AnimatePresence initial={false}>
                      {active &&
                      <motion.span
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.25, ease }}
                        className="block overflow-hidden">
                        
                          <span className="block pt-2 text-[15px] font-light leading-relaxed text-muted">{f.text}</span>
                          <span className="mt-4 block h-0.5 overflow-hidden rounded-full bg-line">
                            <Progress progress={progress} />
                          </span>
                        </motion.span>
                      }
                    </AnimatePresence>
                  </button>
                </li>);

            })}
          </ul>
        </motion.div>
      </div>
    </section>);

}

function Progress({ progress }: {progress: MotionValue<number>;}) {
  const scaleX = useTransform(progress, (v) => v);
  return <motion.span className="block h-full origin-left bg-brand" style={{ scaleX }} />;
}