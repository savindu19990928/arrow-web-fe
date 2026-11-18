import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BoxIcon, ChevronLeftIcon, ChevronRightIcon, HandIcon, ImageIcon, MaximizeIcon } from 'lucide-react';
import { api } from '../../utils/api';
import { ModelViewer } from './ModelViewer';
import type { ProductDetail, Viewer3D } from '../../types/api';

interface ProductGalleryProps {
  product: ProductDetail;
  mode: 'photos' | '3d';
  onModeChange: (m: 'photos' | '3d') => void;
}

export function ProductGallery({ product, mode, onModeChange }: ProductGalleryProps) {
  const images = [...(product.images ?? [])].sort((a, b) => a.display_order - b.display_order);
  const [active, setActive] = useState(0);
  const [viewer, setViewer] = useState<Viewer3D | null>(product.viewer_3d);
  const stageRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const can3d = product.has_3d_model;

  // Keep the active index valid if the image list shrinks.
  useEffect(() => {
    if (active > 0 && active >= images.length) setActive(0);
  }, [active, images.length]);

  // Keep the active thumbnail in view.
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft - strip.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2;
    strip.scrollTo({ left, behavior: 'smooth' });
  }, [active]);

  useEffect(() => {
    setActive(0);
    setViewer(product.viewer_3d);
  }, [product.slug, product.viewer_3d]);

  useEffect(() => {
    if (mode !== '3d' || !can3d) return;
    let cancelled = false;
    api<Viewer3D>(`/api/catalog/products/${product.slug}/3d-model/`).
    then((v) => !cancelled && setViewer(v)).
    catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [mode, can3d, product.slug]);

  const current = images[active] ?? { image: product.primary_image ?? '', alt_text: product.name };
  const viewerConfig = useMemo<Viewer3D>(
    () => viewer ?? { id: product.id, name: product.name, has_3d_model: true, model_3d_file: null },
    [viewer, product.id, product.name]
  );

  const showImage = (i: number) => {
    setActive((i + images.length) % Math.max(images.length, 1));
    onModeChange('photos');
  };

  const scrollThumbs = (dir: number) => {
    if (images.length) showImage(active + dir);
  };

  const fullscreen = () => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();else
    el.requestFullscreen?.().catch(() => undefined);
  };

  return (
    <div>
      <div
        ref={stageRef}
        className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface sm:aspect-[3/2]"
        onTouchStart={(e) => {
          if (mode === 'photos') touchX.current = e.touches[0].clientX;
        }}
        onTouchCancel={() => touchX.current = null}
        onTouchEnd={(e) => {
          if (touchX.current === null || images.length < 2) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (dx <= -40) showImage(active + 1);
          if (dx >= 40) showImage(active - 1);
        }}>
        
        <AnimatePresence initial={false}>
          {mode === '3d' && can3d ?
          <motion.div key="3d" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <ModelViewer config={viewerConfig} label={product.name} />
            </motion.div> :

          <motion.img
            key={current.image}
            src={current.image}
            alt={current.alt_text}
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-contain mix-blend-multiply"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }} />

          }
        </AnimatePresence>

        {can3d &&
        <button
          type="button"
          onClick={() => onModeChange(mode === '3d' ? 'photos' : '3d')}
          className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-ink/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors duration-150 hover:bg-ink">
          
            {mode === '3d' ? <ImageIcon className="h-4 w-4" aria-hidden="true" /> : <BoxIcon className="h-4 w-4" aria-hidden="true" />}
            {mode === '3d' ? 'View Photos' : 'View in 3D'}
          </button>
        }
        <button
          type="button"
          onClick={fullscreen}
          aria-label="View fullscreen"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/75 text-white backdrop-blur transition-colors duration-150 hover:bg-ink">
          
          <MaximizeIcon className="h-4 w-4" />
        </button>
        {mode === '3d' && can3d &&
        <p className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 text-xs font-medium text-ink-700">
            <span className="h-px w-10 bg-ink/40" aria-hidden="true" />
            <HandIcon className="h-4 w-4" aria-hidden="true" />
            Drag to rotate
            <span className="h-px w-10 bg-ink/40" aria-hidden="true" />
          </p>
        }
      </div>

      {images.length > 0 &&
      <div className="mt-4 flex items-center gap-2">
          <button type="button" onClick={() => scrollThumbs(-1)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface transition-colors duration-150 hover:bg-line" aria-label="Previous image">
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <div ref={thumbsRef} className="no-scrollbar flex flex-1 gap-3 overflow-x-auto" role="tablist" aria-label="Product images">
            {images.map((img, i) =>
          <button
            key={img.id}
            type="button"
            role="tab"
            aria-selected={mode === 'photos' && active === i}
            onClick={() => showImage(i)}
            className={`h-14 w-[68px] shrink-0 sm:h-[72px] sm:w-[88px] overflow-hidden rounded-lg border-2 bg-surface transition-colors duration-150 ${
            mode === 'photos' && active === i ? 'border-ink' : 'border-transparent hover:border-line'}`
            }>
            
                <img src={img.image} alt={img.alt_text} className="h-full w-full object-contain mix-blend-multiply" />
              </button>
          )}
          </div>
          <button type="button" onClick={() => scrollThumbs(1)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface transition-colors duration-150 hover:bg-line" aria-label="Next image">
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      }
    </div>);

}