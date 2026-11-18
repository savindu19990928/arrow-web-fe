import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValue } from 'framer-motion';

/**
 * Auto-advancing carousel. `progress` (0–1) is a motion value so the timer never re-renders the tree.
 * Runs its own rAF loop that reads `paused` from a ref (never stale), clamps frame deltas so a
 * backgrounded tab can't skip slides, and resets the clock whenever the tab becomes visible again.
 */
export function useCarousel(count: number, duration: number, paused: boolean) {
  const [index, setIndex] = useState(0);
  const progress = useMotionValue(0);
  const pausedRef = useRef(paused);
  const indexRef = useRef(0);

  pausedRef.current = paused;
  indexRef.current = index;

  useEffect(() => {
    if (count < 2) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = Math.min(now - last, 100);
      last = now;
      if (!pausedRef.current && !document.hidden) {
        const next = progress.get() + delta / duration;
        if (next >= 1) {
          progress.set(0);
          setIndex((i) => (i + 1) % count);
        } else {
          progress.set(next);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisible = () => {
      last = performance.now();
    };

    raf = requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [count, duration, progress]);

  const goTo = useCallback(
    (i: number) => {
      if (count < 1) return;
      progress.set(0);
      setIndex((i % count + count) % count);
    },
    [count, progress]
  );

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  return { index, progress, goTo, next, prev };
}