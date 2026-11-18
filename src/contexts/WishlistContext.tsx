import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { errorMessage } from '../utils/apiError';
import { useAuth } from './AuthContext';
import type { WishlistItem } from '../types/api';

interface WishlistContextValue {
  items: WishlistItem[];
  loading: boolean;
  has: (productId: number) => boolean;
  toggle: (productId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: {children: React.ReactNode;}) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      setItems(await api<WishlistItem[]>('/api/wishlist/'));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const has = useCallback((productId: number) => items.some((i) => i.product.id === productId), [items]);

  const toggle = useCallback(
    async (productId: number) => {
      if (!user) {
        toast('Sign in to save products to your wishlist', {
          action: { label: 'Sign in', onClick: () => window.location.href = '/login' }
        });
        return;
      }
      try {
        const res = await api<{added: boolean;message: string;}>('/api/wishlist/', {
          method: 'POST',
          body: { product_id: productId }
        });
        toast.success(res.message);
        await refresh();
      } catch (err) {
        toast.error(errorMessage(err));
      }
    },
    [user, refresh]
  );

  const value = useMemo(() => ({ items, loading, has, toggle, refresh }), [items, loading, has, toggle, refresh]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}