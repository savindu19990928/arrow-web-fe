import React from 'react';
import { BellIcon } from 'lucide-react';
import { api } from '../../utils/api';
import { formatDate } from '../../utils/format';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import type { NotificationList } from '../../types/api';

export function NotificationsPanel() {
  const { data, loading, error, reload, setData } = useApi(() => api<NotificationList>('/api/notifications/'));

  const markRead = async (id: number) => {
    if (!data) return;
    setData({ unread_count: Math.max(0, data.unread_count - 1), notifications: data.notifications.map((n) => n.id === id ? { ...n, is_read: true } : n) });
    await api(`/api/notifications/${id}/mark-read/`, { method: 'POST' }).catch(() => reload());
  };

  const markAll = async () => {
    if (!data) return;
    setData({ unread_count: 0, notifications: data.notifications.map((n) => ({ ...n, is_read: true })) });
    await api('/api/notifications/mark-all-read/', { method: 'POST' }).catch(() => reload());
  };

  return (
    <section aria-labelledby="nt-h">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="nt-h" className="text-2xl font-bold tracking-tight">
          Notifications {data && data.unread_count > 0 && <span className="ml-2 rounded-full bg-ink px-2 py-0.5 align-middle text-xs text-white">{data.unread_count} new</span>}
        </h2>
        {data && data.unread_count > 0 &&
        <button type="button" onClick={markAll} className="text-sm font-semibold underline underline-offset-4">
            Mark all as read
          </button>
        }
      </div>
      <div className="mt-5">
        {loading ?
        <Spinner /> :
        error ?
        <ErrorState message={error} onRetry={reload} /> :
        !data || data.notifications.length === 0 ?
        <EmptyState icon={BellIcon} title="You're all caught up" text="Order and payment updates will appear here." /> :

        <ul className="divide-y divide-line border-y border-line">
            {data.notifications.map((n) =>
          <li key={n.id} className="flex items-start gap-3 py-4">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.is_read ? 'bg-transparent' : 'bg-ink'}`} aria-hidden="true" />
                <div className="flex-1">
                  <p className={`text-sm ${n.is_read ? 'font-medium' : 'font-semibold'}`}>{n.title}</p>
                  <p className="text-sm text-muted">{n.message}</p>
                  <p className="mt-1 text-xs text-muted">{formatDate(n.created_at, true)}</p>
                </div>
                {!n.is_read &&
            <button type="button" onClick={() => markRead(n.id)} className="whitespace-nowrap text-xs font-semibold underline underline-offset-2">
                    Mark as read
                  </button>
            }
              </li>
          )}
          </ul>
        }
      </div>
    </section>);

}