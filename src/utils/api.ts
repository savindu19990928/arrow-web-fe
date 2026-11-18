import { ApiError } from './apiError';
import type { Paginated } from '../types/api';

/** Live Arrow Ventures backend (see FRONTEND_DEVELOPER_PROMPT §6). */
export const API_BASE_URL = 'https://arrowapi-813344430767.asia-southeast1.run.app';

const KEYS = {
  access: 'av_access',
  refresh: 'av_refresh',
  guest: 'arrow_guest_token'
};

type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  form?: FormData;
  query?: Record<string, QueryValue>;
}

export const tokens = {
  get access(): string | null {
    return localStorage.getItem(KEYS.access);
  },
  get refresh(): string | null {
    return localStorage.getItem(KEYS.refresh);
  },
  set(access: string, refresh?: string) {
    localStorage.setItem(KEYS.access, access);
    if (refresh) localStorage.setItem(KEYS.refresh, refresh);
  },
  clear() {
    localStorage.removeItem(KEYS.access);
    localStorage.removeItem(KEYS.refresh);
  }
};

export function getGuestToken(): string {
  let token = localStorage.getItem(KEYS.guest);
  if (!token) {
    token =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto ?
    crypto.randomUUID() :
    `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
    localStorage.setItem(KEYS.guest, token);
  }
  return token;
}

export function resetGuestToken() {
  localStorage.removeItem(KEYS.guest);
}

function buildQuery(query?: Record<string, QueryValue>): URLSearchParams {
  const params = new URLSearchParams();
  if (!query) return params;
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return params;
}

function headers(isForm: boolean): HeadersInit {
  const h: Record<string, string> = { Accept: 'application/json' };
  if (!isForm) h['Content-Type'] = 'application/json';
  const access = tokens.access;
  if (access) h.Authorization = `Bearer ${access}`;
  h['X-Guest-Token'] = getGuestToken();
  return h;
}

async function send(path: string, opts: RequestOptions, params: URLSearchParams): Promise<Response> {
  const qs = params.toString();
  try {
    return await fetch(`${API_BASE_URL}${path}${qs ? `?${qs}` : ''}`, {
      method: opts.method ?? 'GET',
      headers: headers(Boolean(opts.form)),
      body: opts.form ?? (opts.body !== undefined ? JSON.stringify(opts.body) : undefined)
    });
  } catch {
    throw new ApiError(0, "We couldn't reach the Arrow Ventures store. Check your connection and try again.");
  }
}

let refreshing: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const refresh = tokens.refresh;
  if (!refresh) return false;
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ refresh })
        });
        if (!res.ok) return false;
        const data = (await res.json()) as {access?: string;data?: {access?: string;};};
        const access = data.access ?? data.data?.access;
        if (!access) return false;
        tokens.set(access);
        return true;
      } catch {
        return false;
      } finally {
        setTimeout(() => refreshing = null, 0);
      }
    })();
  }
  return refreshing;
}

function firstFieldError(errors: unknown): string | undefined {
  if (!errors || typeof errors !== 'object') return undefined;
  for (const value of Object.values(errors as Record<string, unknown>)) {
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    if (typeof value === 'string') return value;
  }
  return undefined;
}

async function parse<T>(res: Response): Promise<T> {
  if (res.status === 204) return {} as T;
  const text = await res.text();
  let data: Record<string, unknown> = {};
  if (text) {
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      if (!res.ok) throw new ApiError(res.status, `The server returned an unexpected response (${res.status}).`);
      return text as unknown as T;
    }
  }
  if (!res.ok) {
    const errors = data.errors as Record<string, string[]> | undefined ?? undefined;
    const detail =
    typeof data.detail === 'string' && data.detail ||
    typeof data.message === 'string' && data.message ||
    firstFieldError(errors) ||
    firstFieldError(data) ||
    `Request failed (${res.status})`;
    throw new ApiError(res.status, detail, errors);
  }
  return data as T;
}

export async function api<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const params = buildQuery(opts.query);
  let res = await send(path, opts, params);
  if (res.status === 401 && path !== '/api/auth/refresh/' && path !== '/api/auth/login/' && (await tryRefresh())) {
    res = await send(path, opts, params);
  }
  const issuedGuest = res.headers.get('X-Guest-Token');
  if (issuedGuest && !tokens.access && issuedGuest !== localStorage.getItem(KEYS.guest)) {
    localStorage.setItem(KEYS.guest, issuedGuest);
  }
  return parse<T>(res);
}

export function asList<T>(data: T[] | Paginated<T> | null | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results ?? [];
}

async function downloadBlob(path: string, query: Record<string, QueryValue>, filename: string, accept: string) {
  const qs = buildQuery(query).toString();
  const url = `${API_BASE_URL}${path}${qs ? `?${qs}` : ''}`;
  const doFetch = () =>
  fetch(url, {
    headers: {
      Accept: accept,
      'X-Guest-Token': getGuestToken(),
      ...(tokens.access ? { Authorization: `Bearer ${tokens.access}` } : {})
    }
  });
  let res = await doFetch().catch(() => null);
  if (res && res.status === 401 && (await tryRefresh())) res = await doFetch().catch(() => null);
  if (!res) throw new ApiError(0, "We couldn't reach the Arrow Ventures store.");
  if (!res.ok) throw new ApiError(res.status, 'Download failed. Please try again.');
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 2000);
}

export function downloadInvoice(orderId: number, orderNumber: string, contact?: string): Promise<void> {
  return downloadBlob(`/api/orders/${orderId}/invoice/`, { contact }, `Invoice_${orderNumber}.pdf`, 'application/pdf');
}

export function downloadReportCsv(slug: string, range: Record<string, string>): Promise<void> {
  return downloadBlob(
    `/api/admin/reports/${slug}/`,
    { ...range, export: 'csv' },
    `${slug}_${range.start_date ?? ''}_${range.end_date ?? ''}.csv`,
    'text/csv'
  );
}