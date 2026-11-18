import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangleIcon, ArrowRightIcon, BellIcon, LandmarkIcon, XCircleIcon, BoxIcon } from "lucide-react";
import { api } from "../../utils/api";
import { formatDate, formatLKR } from "../../utils/format";
import { useApi } from "../../hooks/useApi";
import { useAdminNotifications } from "../../hooks/useAdminNotifications";
import { Spinner } from "../ui/Spinner";
import { ErrorState } from "../ui/ErrorState";
import { DashboardSummary } from "../../types/api";
const alertIcons: Record<string, BoxIcon> = {
  BANK_PAYMENT_PENDING: LandmarkIcon,
  LOW_STOCK: AlertTriangleIcon,
  CANCELLATION_REQUEST: XCircleIcon
};
export function AdminOverview() {
  const {
    data,
    loading,
    error,
    reload
  } = useApi(() => api<DashboardSummary>('/api/admin/reports/dashboard-summary/'));
  const alerts = useAdminNotifications();
  if (loading) return <Spinner />;
  if (error || !data) return <ErrorState message={error ?? 'Could not load summary.'} onRetry={reload} />;
  const actions = [{
    label: 'Active orders',
    value: data.active_orders_count,
    to: '/admin/orders',
    hint: 'Awaiting fulfilment'
  }, {
    label: 'Bank slips to verify',
    value: data.pending_bank_verifications_count,
    to: '/admin/verifications',
    hint: 'Pending verification'
  }, {
    label: 'Low stock alerts',
    value: data.low_stock_alerts_count,
    to: '/admin/inventory',
    hint: 'At or below threshold'
  }];
  return <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-3xl bg-ink p-6 text-white md:p-8" aria-label="Revenue">
          <p className="text-sm text-white/75">Month-to-date revenue</p>
          <p className="headline mt-2 text-4xl md:text-6xl">{formatLKR(data.month_to_date_revenue)}</p>
          <p className="mt-6 text-sm text-white/75">Today</p>
          <p className="text-2xl font-semibold">{formatLKR(data.today_revenue)}</p>
          <Link to="/admin/reports" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-white/90">
            Open reports <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </section>
        <section aria-label="Needs attention">
          <h2 className="text-sm font-semibold text-muted">Needs attention</h2>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {actions.map((a) => <li key={a.label}>
                <Link to={a.to} className="flex items-center justify-between gap-4 px-1 py-5 hover:bg-surface/60">
                  <div>
                    <p className="font-semibold">{a.label}</p>
                    <p className="text-xs text-muted">{a.hint}</p>
                  </div>
                  <span className="flex items-center gap-3">
                    <span className={`text-3xl font-extrabold ${a.value > 0 ? 'text-ink' : 'text-muted'}`}>{a.value}</span>
                    <ArrowRightIcon className="h-4 w-4 text-muted" aria-hidden="true" />
                  </span>
                </Link>
              </li>)}
          </ul>
        </section>
      </div>

      <section aria-labelledby="alerts-h">
        <h2 id="alerts-h" className="text-xl font-bold">Store alerts</h2>
        {alerts.loading ? <Spinner /> : alerts.error ? <ErrorState message={alerts.error} onRetry={alerts.reload} /> : alerts.items.length === 0 ? <p className="mt-3 text-sm text-muted">No alerts right now.</p> : <ul className="mt-3 divide-y divide-line border-y border-line">
            {alerts.items.slice(0, 10).map((a) => {
          const Icon = alertIcons[a.notification_type] ?? BellIcon;
          return <li key={a.id} className="flex items-start gap-3 py-4">
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${a.is_read ? 'text-muted' : 'text-ink'}`} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${a.is_read ? 'font-medium' : 'font-semibold'}`}>{a.title}</p>
                    <p className="text-sm text-muted">{a.message}</p>
                  </div>
                  <p className="shrink-0 text-xs text-muted">{formatDate(a.created_at, true)}</p>
                </li>;
        })}
          </ul>}
      </section>
    </div>;
}