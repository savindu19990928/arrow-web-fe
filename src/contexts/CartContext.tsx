import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { errorMessage } from '../utils/apiError';
import type { Cart } from '../types/api';

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  count: number;
  refresh: () => Promise<void>;
  add: (productId: number, variantId: number | null, quantity: number, name?: string) => Promise<boolean>;
  update: (itemId: number, quantity: number) => Promise<void>;
  remove: (itemId: number) => Promise<void>;
  clear: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: {children: React.ReactNode;}) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setCart(await api<Cart>('/api/cart/'));
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onAuth = () => refresh();
    window.addEventListener('av:auth-changed', onAuth);
    window.addEventListener('av:cart-changed', onAuth);
    return () => {
      window.removeEventListener('av:auth-changed', onAuth);
      window.removeEventListener('av:cart-changed', onAuth);
    };
  }, [refresh]);

  const add = useCallback(async (productId: number, variantId: number | null, quantity: number, name?: string) => {
    try {
      const next = await api<Cart>('/api/cart/', {
        method: 'POST',
        body: { product_id: productId, variant_id: variantId, quantity }
      });
      setCart(next);
      toast.success(name ? `${name} added to cart` : 'Added to cart', {
        action: { label: 'View cart', onClick: () => window.location.href = '/cart' }
      });
      return true;
    } catch (err) {
      toast.error(errorMessage(err));
      return false;
    }
  }, []);

  const update = useCallback(async (itemId: number, quantity: number) => {
    try {
      const next = await api<Cart>(`/api/cart/items/${itemId}/`, { method: 'PATCH', body: { quantity } });
      await refreshIfPartial(next, setCart);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }, []);

  const remove = useCallback(async (itemId: number) => {
    try {
      const next = await api<Cart>(`/api/cart/items/${itemId}/`, { method: 'DELETE' });
      await refreshIfPartial(next, setCart);
      toast('Item removed from cart');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }, []);

  const clear = useCallback(async () => {
    try {
      await api('/api/cart/', { method: 'DELETE' });
      await refresh();
      toast('Your cart is now empty');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }, [refresh]);

  const value = useMemo<CartContextValue>(
    () => ({ cart, loading, count: cart?.total_items_count ?? 0, refresh, add, update, remove, clear }),
    [cart, loading, refresh, add, update, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// PATCH/DELETE responses may return a slimmed-down cart; re-fetch the full cart when item details are missing.
async function refreshIfPartial(next: Cart, set: (c: Cart) => void) {
  const complete = next.items.every((i) => i.product_name !== undefined);
  if (complete) {
    set(next);
    return;
  }
  set(await api<Cart>('/api/cart/'));
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}