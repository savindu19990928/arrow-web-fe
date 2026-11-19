import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheckIcon, TruckIcon, WalletIcon, WrenchIcon } from 'lucide-react';
import { whyArrow } from '../../data/site';
import { inViewOnce, staggerChild, staggerParent } from '../ui/Reveal';

const icons = { truck: TruckIcon, wallet: WalletIcon, shield: ShieldCheckIcon, wrench: WrenchIcon };

/** Each icon gets a small motion that matches its meaning, played once on reveal. */
const iconMotion = {
  truck: { x: [-10, 0], opacity: [0, 1] },
  wallet: { rotate: [-12, 0], opacity: [0, 1] },
  shield: { scale: [0.8, 1.08, 1], opacity: [0, 1, 1] },
  wrench: { rotate: [0, -25, 0] }
} as const;

export function BenefitsStrip() {
  const reduce = useReducedMotion();
  return (
    <section className="border-t border-line bg-white" aria-label="Why buy from Arrow">
      <motion.ul
        className="mx-auto grid max-w-site gap-8 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-4"
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={inViewOnce}>
        
        {whyArrow.map((b, i) => {
          const Icon = icons[b.icon];
          return (
            <motion.li key={b.title} variants={staggerChild} className="flex gap-4">
              <motion.span
                className="mt-0.5 shrink-0"
                whileInView={reduce ? undefined : iconMotion[b.icon]}
                viewport={inViewOnce}
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: 0.15 + i * 0.06 }}>
                
                <Icon className="h-7 w-7" strokeWidth={1.4} aria-hidden="true" />
              </motion.span>
              <div>
                <p className="text-base font-semibold">{b.title}</p>
                <p className="mt-1 text-sm font-light leading-relaxed text-muted">{b.text}</p>
              </div>
            </motion.li>);

        })}
      </motion.ul>
    </section>);

}