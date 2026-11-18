import React, { useEffect, useRef, useState } from 'react';
import { AlertCircleIcon, Loader2Icon, ScanIcon } from 'lucide-react';
import type { Viewer3D } from '../../types/api';

const SCRIPT_SRC = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';

function useModelViewerReady(): boolean {
  const [ready, setReady] = useState(() => typeof customElements !== 'undefined' && Boolean(customElements.get('model-viewer')));

  useEffect(() => {
    if (ready) return;
    if (!document.querySelector('script[data-model-viewer]')) {
      const s = document.createElement('script');
      s.type = 'module';
      s.src = SCRIPT_SRC;
      s.dataset.modelViewer = 'true';
      document.head.appendChild(s);
    }
    let cancelled = false;
    customElements.whenDefined('model-viewer').then(() => !cancelled && setReady(true));
    return () => {
      cancelled = true;
    };
  }, [ready]);

  return ready;
}

interface ModelViewerProps {
  config: Viewer3D;
  label: string;
}

/** Google <model-viewer> wrapper — rotate, zoom, auto-rotate and AR quick-look for .glb/.gltf models served from GCS. */
export function ModelViewer({ config, label }: ModelViewerProps) {
  const ready = useModelViewerReady();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const viewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [config.model_3d_file]);

  useEffect(() => {
    const el = viewerRef.current;
    if (!ready || !el) return;
    const onLoad = () => setLoaded(true);
    const onError = () => setFailed(true);
    el.addEventListener('load', onLoad);
    el.addEventListener('error', onError);
    return () => {
      el.removeEventListener('load', onLoad);
      el.removeEventListener('error', onError);
    };
  }, [ready, config.model_3d_file]);

  if (!config.model_3d_file) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted">
        <AlertCircleIcon className="h-6 w-6" aria-hidden="true" />
        The 3D model for this product isn't available right now.
      </div>);

  }

  const attrs: Record<string, unknown> = {
    src: config.model_3d_file,
    alt: `3D model of ${label}`,
    'camera-controls': '',
    'touch-action': 'pan-y',
    'shadow-intensity': '1',
    exposure: '1',
    'environment-image': config.environment_preset || 'neutral',
    ar: '',
    'ar-modes': 'webxr scene-viewer quick-look',
    style: { width: '100%', height: '100%', backgroundColor: '#F5F5F5', '--poster-color': '#F5F5F5' },
    ref: viewerRef
  };
  if (config.model_3d_poster) attrs.poster = config.model_3d_poster;
  if (config.camera_orbit) attrs['camera-orbit'] = config.camera_orbit;
  if (config.field_of_view) attrs['field-of-view'] = config.field_of_view;
  if (config.auto_rotate !== false) attrs['auto-rotate'] = '';
  if (config.allow_zoom === false) attrs['disable-zoom'] = '';

  return (
    <div className="relative h-full w-full">
      {ready &&
      React.createElement(
        'model-viewer',
        attrs,
        <button
          key="ar"
          slot="ar-button"
          type="button"
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
          
            <ScanIcon className="h-4 w-4" aria-hidden="true" /> View in your space
          </button>
      )}
      {(!ready || !loaded && !failed) &&
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-ink-700 shadow-sm">
            <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading 3D model…
          </span>
        </div>
      }
      {failed &&
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface p-6 text-center text-sm text-muted">
          <AlertCircleIcon className="h-6 w-6" aria-hidden="true" />
          We couldn't load the 3D model. Try the photos instead.
        </div>
      }
    </div>);

}