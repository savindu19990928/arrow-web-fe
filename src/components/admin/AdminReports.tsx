import React, { useState } from 'react';
import { DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { api, downloadReportCsv } from '../../utils/api';
import { errorMessage } from '../../utils/apiError';
import { humanize } from '../../utils/format';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import type { ReportPayload, ReportValue } from '../../types/api';

const reports = [
{ slug: 'product-sales', label: 'Product Sales' },
{ slug: 'orders', label: 'Orders' },
{ slug: 'payments', label: 'Payments' },
{ slug: 'income', label: 'Income' },
{ slug: 'inventory', label: 'Inventory / Stock' },
{ slug: 'customer-purchases', label: 'Customer Purchases' },
{ slug: 'discounts-promotions', label: 'Discounts & Promotions' },
{ slug: 'cancellations-refunds', label: 'Cancellations & Refunds' }];


const MONEY = /revenue|amount|total|volume|sales|spent|discount|income|fee/i;

function cell(key: string, value: ReportValue): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number' || typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value) && MONEY.test(key)) {
    const n = Number(value);
    return MONEY.test(key) ? `Rs. ${n.toLocaleString('en-LK', { maximumFractionDigits: 2 })}` : n.toLocaleString();
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}



export function AdminReports() {
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = `${today.slice(0, 8)}01`;
  const [slug, setSlug] = useState('product-sales');
  const [range, setRange] = useState({ start_date: monthStart, end_date: today });
  const { data, loading, error, reload } = useApi(() => api<ReportPayload>(`/api/admin/reports/${slug}/`, { query: range }), [slug, range.start_date, range.end_date]);

  const tables = data ? Object.entries(data).filter(([, v]) => Array.isArray(v)) as [string, Record<string, ReportValue>[]][] : [];

  const exportCsv = async () => {
    try {
      await downloadReportCsv(slug, range);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="rp-type" className="label">Report</label>
          <select id="rp-type" className="input" value={slug} onChange={(e) => setSlug(e.target.value)}>
            {reports.map((r) => <option key={r.slug} value={r.slug}>{r.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="rp-from" className="label">From</label>
          <input id="rp-from" type="date" className="input" value={range.start_date} max={range.end_date} onChange={(e) => setRange((r) => ({ ...r, start_date: e.target.value }))} />
        </div>
        <div>
          <label htmlFor="rp-to" className="label">To</label>
          <input id="rp-to" type="date" className="input" value={range.end_date} min={range.start_date} onChange={(e) => setRange((r) => ({ ...r, end_date: e.target.value }))} />
        </div>
        <button type="button" onClick={exportCsv} className="btn-outline" disabled={!data}>
          <DownloadIcon className="h-4 w-4" aria-hidden="true" /> Export CSV
        </button>
      </div>

      <div className="mt-8">
        {loading ?
        <Spinner label="Generating report…" /> :
        error || !data ?
        <ErrorState message={error ?? 'No data.'} onRetry={reload} /> :

        <div className="space-y-10">
            <h2 className="headline text-3xl">{data.report ?? humanize(slug)}</h2>
            {data.summary &&
          <dl className="grid gap-x-10 gap-y-6 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(data.summary).map(([k, v], i) =>
            <div key={k} className={i === 0 ? 'lg:col-span-1' : ''}>
                    <dt className="text-xs text-muted">{humanize(k)}</dt>
                    <dd className={`mt-1 font-display font-bold ${i === 0 ? 'text-3xl' : 'text-2xl'}`}>{cell(k, v)}</dd>
                  </div>
            )}
              </dl>
          }
            {tables.map(([name, rows]) =>
          <section key={name}>
                <h3 className="font-semibold">{humanize(name)}</h3>
                {rows.length === 0 ?
            <p className="mt-3 text-sm text-muted">No records in this period.</p> :

            <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead>
                        <tr className="border-b border-ink text-left">
                          {Object.keys(rows[0]).map((k) => <th key={k} scope="col" className="py-2.5 pr-4 font-semibold">{humanize(k.replace(/__/g, ' '))}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {rows.map((r, i) =>
                  <tr key={i}>
                            {Object.entries(r).map(([k, v]) => <td key={k} className="py-2.5 pr-4">{cell(k, v)}</td>)}
                          </tr>
                  )}
                      </tbody>
                    </table>
                  </div>
            }
              </section>
          )}
          </div>
        }
      </div>
    </div>);

}