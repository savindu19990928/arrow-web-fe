import { useEffect, useState } from 'react';
import { api, asList } from '../utils/api';
import type { Campaign, Paginated } from '../types/api';

let cached: Promise<Campaign | null> | null = null;

function load(): Promise<Campaign | null> {
  if (!cached) {
    cached = api<Campaign[] | Paginated<Campaign>>('/api/promotions/campaigns/').
    then((d) => asList(d).find((c) => c.is_live) ?? null).
    catch(() => {
      cached = null;
      return null;
    });
  }
  return cached;
}

/** The currently live promotion (shared by the announcement bar and hero, fetched once). */
export function useLiveCampaign() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  useEffect(() => {
    let alive = true;
    load().then((c) => alive && setCampaign(c));
    return () => {
      alive = false;
    };
  }, []);
  return campaign;
}