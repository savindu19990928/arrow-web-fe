import React from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { BellIcon, HeartIcon, KeyRoundIcon, LogOutIcon, MapPinIcon, PackageIcon, UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from '../components/ui/Spinner';
import { OrdersPanel } from '../components/account/OrdersPanel';
import { WishlistPanel } from '../components/account/WishlistPanel';
import { AddressesPanel } from '../components/account/AddressesPanel';
import { NotificationsPanel } from '../components/account/NotificationsPanel';
import { ProfilePanel } from '../components/account/ProfilePanel';
import { PasswordPanel } from '../components/account/PasswordPanel';
import { OrderDetail } from '../components/account/OrderDetail';

const tabs = [
{ to: 'orders', label: 'Orders', icon: PackageIcon },
{ to: 'wishlist', label: 'Wishlist', icon: HeartIcon },
{ to: 'addresses', label: 'Addresses', icon: MapPinIcon },
{ to: 'notifications', label: 'Notifications', icon: BellIcon },
{ to: 'profile', label: 'Profile', icon: UserIcon },
{ to: 'password', label: 'Password', icon: KeyRoundIcon }];


export function Account() {
  const { user, loading, logout } = useAuth();

  if (loading) return <Spinner className="min-h-[50vh]" />;
  if (!user) return <Navigate to="/login?next=/account" replace />;

  return (
    <div className="mx-auto max-w-site px-4 py-10 md:px-6">
      <p className="text-sm text-muted">My account</p>
      <h1 className="headline mt-1 text-5xl">Hi, {user.first_name || 'rider'}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Account" className="flex gap-1 overflow-x-auto lg:flex-col">
          {tabs.map((t) =>
          <NavLink
            key={t.to}
            to={`/account/${t.to}`}
            className={({ isActive }) =>
            `flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-150 ${isActive ? 'bg-ink text-white' : 'hover:bg-surface'}`
            }>
            
              <t.icon className="h-4 w-4" aria-hidden="true" />
              {t.label}
            </NavLink>
          )}
          <button type="button" onClick={logout} className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted hover:bg-surface hover:text-ink">
            <LogOutIcon className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </nav>

        <div className="min-w-0">
          <Routes>
            <Route index element={<Navigate to="orders" replace />} />
            <Route path="orders" element={<OrdersPanel />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="wishlist" element={<WishlistPanel />} />
            <Route path="addresses" element={<AddressesPanel />} />
            <Route path="notifications" element={<NotificationsPanel />} />
            <Route path="profile" element={<ProfilePanel />} />
            <Route path="password" element={<PasswordPanel />} />
          </Routes>
        </div>
      </div>
    </div>);

}