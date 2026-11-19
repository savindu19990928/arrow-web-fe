import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

const ease = [0.23, 1, 0.32, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'li';
};

/** Fades + lifts content in once when it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 24, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = as === 'li' ? motion.li : motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduce ? 0.15 : 0.3, ease, delay: reduce ? 0 : delay }}>
      
      {children}
    </Comp>);

}

/** Parent/child variants for staggered grids: children fade up 50ms apart. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } }
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease } }
};

export const inViewOnce = { once: true, margin: '-60px' } as const;