import { api, asList } from '../utils/api';
import { useApi } from './useApi';
import type { AdminNotification, Paginated } from '../types/api';

/** Store-wide staff alerts from /api/admin/notifications/. */
export function useAdminNotifications() {
  const { data, loading, error, reload } = useApi(() => api<AdminNotification[] | Paginated<AdminNotification>>('/api/admin/notifications/'));
  return { items: asList(data), loading, error, reload };
}