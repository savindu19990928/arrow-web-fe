import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderComplete } from './pages/OrderComplete';
import { TrackOrder } from './pages/TrackOrder';
import { Auth } from './pages/Auth';
import { Account } from './pages/Account';
import { Admin } from './pages/Admin';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Maintenance } from './pages/Maintenance';
import { Warranty } from './pages/Warranty';
import { Policy } from './pages/Policy';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:slug" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="checkout/complete" element={<OrderComplete />} />
                <Route path="track-order" element={<TrackOrder />} />
                <Route path="login" element={<Auth mode="login" />} />
                <Route path="register" element={<Auth mode="register" />} />
                <Route path="account/*" element={<Account />} />
                <Route path="admin/*" element={<Admin />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="warranty" element={<Warranty />} />
                <Route path="refund-policy" element={<Policy slug="refund-policy" />} />
                <Route path="privacy-policy" element={<Policy slug="privacy-policy" />} />
                <Route path="terms-and-conditions" element={<Policy slug="terms-and-conditions" />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster position="bottom-right" richColors closeButton />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>);

}