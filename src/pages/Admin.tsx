import React from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { BarChart3Icon, BoxesIcon, CreditCardIcon, LandmarkIcon, LayoutDashboardIcon, PackageIcon, ReceiptIcon, UndoIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from '../components/ui/Spinner';
import { AdminOverview } from '../components/admin/AdminOverview';
import { AdminOrders } from '../components/admin/AdminOrders';
import { AdminVerifications } from '../components/admin/AdminVerifications';
import { AdminPayments } from '../components/admin/AdminPayments';
import { AdminCancellations } from '../components/admin/AdminCancellations';
import { AdminInventory } from '../components/admin/AdminInventory';
import { AdminReports } from '../components/admin/AdminReports';
import { AdminBankSettings } from '../components/admin/AdminBankSettings';

const tabs = [
{ to: '', label: 'Overview', icon: LayoutDashboardIcon },
{ to: 'orders', label: 'Orders', icon: PackageIcon },
{ to: 'verifications', label: 'Bank Verifications', icon: ReceiptIcon },
{ to: 'payments', label: 'Payments', icon: CreditCardIcon },
{ to: 'cancellations', label: 'Cancellations', icon: UndoIcon },
{ to: 'inventory', label: 'Inventory', icon: BoxesIcon },
{ to: 'reports', label: 'Reports', icon: BarChart3Icon },
{ to: 'bank-details', label: 'Bank Details', icon: LandmarkIcon }];


export function Admin() {
  const { user, loading, isStaff } = useAuth();
  if (loading) return <Spinner className="min-h-[50vh]" />;
  if (!user) return <Navigate to="/login?next=/admin" replace />;
  if (!isStaff) return <Navigate to="/account" replace />;

  return (
    <div className="mx-auto max-w-site px-4 py-8 md:px-6 md:py-12">
      <p className="text-sm text-muted">Store management</p>
      <h1 className="headline mt-1 text-4xl md:text-5xl">Admin Dashboard</h1>
      <nav aria-label="Admin" className="no-scrollbar -mx-4 mt-6 flex gap-1 overflow-x-auto border-b border-line px-4 md:mx-0 md:px-0">
        {tabs.map((t) =>
        <NavLink
          key={t.label}
          to={`/admin/${t.to}`}
          end={t.to === ''}
          className={({ isActive }) =>
          `-mb-px flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors duration-150 ${isActive ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`
          }>
          
            <t.icon className="h-4 w-4" aria-hidden="true" />
            {t.label}
          </NavLink>
        )}
      </nav>
      <div className="mt-8">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="verifications" element={<AdminVerifications />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="cancellations" element={<AdminCancellations />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="bank-details" element={<AdminBankSettings />} />
        </Routes>
      </div>
    </div>);

}