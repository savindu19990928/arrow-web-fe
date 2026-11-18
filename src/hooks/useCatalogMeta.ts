import { useEffect, useState } from 'react';
import { api, asList } from '../utils/api';
import { errorMessage } from '../utils/apiError';
import type { Brand, Category, Paginated } from '../types/api';

interface MetaState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

const cache = new Map<string, Promise<unknown[]>>();

function load<T>(path: string): Promise<T[]> {
  if (!cache.has(path)) {
    const p = api<T[] | Paginated<T>>(path, { query: { page_size: 100 } }).then((d) => asList(d));
    p.catch(() => cache.delete(path));
    cache.set(path, p as Promise<unknown[]>);
  }
  return cache.get(path) as Promise<T[]>;
}

function useMeta<T>(path: string): MetaState<T> & {reload: () => void;} {
  const [state, setState] = useState<MetaState<T>>({ items: [], loading: true, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    load<T>(path).
    then((items) => !cancelled && setState({ items, loading: false, error: null })).
    catch((e) => !cancelled && setState({ items: [], loading: false, error: errorMessage(e) }));
    return () => {
      cancelled = true;
    };
  }, [path, tick]);

  return { ...state, reload: () => setTick((t) => t + 1) };
}

/** Active categories from /api/catalog/categories/, ordered by display_order. */
export function useCategories() {
  const meta = useMeta<Category>('/api/catalog/categories/');
  const items = meta.items.
  filter((c) => c.is_active !== false).
  sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  return { ...meta, items, topLevel: items.filter((c) => !c.parent) };
}

/** Active brands from /api/catalog/brands/. */
export function useBrands() {
  const meta = useMeta<Brand>('/api/catalog/brands/');
  return { ...meta, items: meta.items.filter((b) => b.is_active !== false) };
}