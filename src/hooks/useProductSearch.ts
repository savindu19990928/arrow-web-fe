import { useEffect, useRef, useState } from 'react';
import { api, asList } from '../utils/api';
import type { Paginated, ProductSummary } from '../types/api';

const MIN_CHARS = 2;
const DEBOUNCE_MS = 220;

/** Live product search that updates as the user types. Stale responses are discarded. */
export function useProductSearch(query: string, pageSize = 6) {
  const [results, setResults] = useState<ProductSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const requestId = useRef(0);
  const term = query.trim();
  const ready = term.length >= MIN_CHARS;

  useEffect(() => {
    const id = ++requestId.current;
    if (!ready) {
      setResults([]);
      setTotal(0);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    const t = window.setTimeout(() => {
      api<Paginated<ProductSummary> | ProductSummary[]>('/api/catalog/products/', { query: { search: term, page_size: pageSize } }).
      then((data) => {
        if (id !== requestId.current) return;
        const list = asList(data);
        setResults(list.slice(0, pageSize));
        setTotal(Array.isArray(data) ? list.length : data.count ?? list.length);
        setError(null);
      }).
      catch((e: unknown) => {
        if (id !== requestId.current) return;
        setError(e instanceof Error ? e.message : 'Search is unavailable right now.');
        setResults([]);
      }).
      finally(() => {
        if (id === requestId.current) setLoading(false);
      });
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [term, ready, pageSize, nonce]);

  return { term, ready, results, total, loading, error, retry: () => setNonce((n) => n + 1) };
}