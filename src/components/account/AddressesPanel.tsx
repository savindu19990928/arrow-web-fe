import React, { useState } from 'react';
import { MapPinIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../utils/api';
import { errorMessage } from '../../utils/apiError';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import type { Address } from '../../types/api';

const blank = { recipient_name: '', phone_number: '', address_line1: '', address_line2: '', city: '', state_or_province: '', postal_code: '', country: 'Sri Lanka', delivery_notes: '', is_default: false };
type Form = typeof blank;

export function AddressesPanel() {
  const { data, loading, error, reload } = useApi(() => api<Address[] | {results: Address[];}>('/api/addresses/'));
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<Form>(blank);
  const [busy, setBusy] = useState(false);
  const addresses = Array.isArray(data) ? data : data?.results ?? [];

  const startNew = () => {
    setForm(blank);
    setEditingId('new');
  };

  const startEdit = (a: Address) => {
    setForm({
      recipient_name: a.recipient_name,
      phone_number: a.phone_number,
      address_line1: a.address_line1,
      address_line2: a.address_line2 ?? '',
      city: a.city,
      state_or_province: a.state_or_province ?? '',
      postal_code: a.postal_code,
      country: a.country,
      delivery_notes: a.delivery_notes ?? '',
      is_default: a.is_default
    });
    setEditingId(a.id);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editingId === 'new') await api('/api/addresses/', { method: 'POST', body: form });else
      await api(`/api/addresses/${editingId}/`, { method: 'PATCH', body: form });
      toast.success(editingId === 'new' ? 'Address saved' : 'Address updated');
      setEditingId(null);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const makeDefault = async (id: number) => {
    try {
      await api(`/api/addresses/${id}/set-default/`, { method: 'POST' });
      toast.success('Default address updated');
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const removeAddress = async (a: Address) => {
    if (!window.confirm(`Delete the address for ${a.recipient_name}?`)) return;
    try {
      await api(`/api/addresses/${a.id}/`, { method: 'DELETE' });
      toast('Address deleted');
      if (editingId === a.id) setEditingId(null);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const input = (k: keyof Form, label: string, required = false, wide = false) =>
  <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={`ad-${k}`} className="label">{label}{required && ' *'}</label>
      <input id={`ad-${k}`} className="input" required={required} value={String(form[k])} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
    </div>;


  return (
    <section aria-labelledby="ad-h">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="ad-h" className="text-2xl font-bold tracking-tight">Saved addresses</h2>
        {editingId === null &&
        <button type="button" className="btn-outline" onClick={startNew}>
            <PlusIcon className="h-4 w-4" aria-hidden="true" /> Add address
          </button>
        }
      </div>

      {editingId !== null &&
      <form onSubmit={save} className="mt-5 grid gap-4 rounded-3xl border border-line p-5 sm:grid-cols-2 md:p-6">
          <h3 className="font-semibold sm:col-span-2">{editingId === 'new' ? 'New address' : 'Edit address'}</h3>
          {input('recipient_name', 'Recipient name', true)}
          {input('phone_number', 'Phone', true)}
          {input('address_line1', 'Address line 1', true, true)}
          {input('address_line2', 'Address line 2', false, true)}
          {input('city', 'City', true)}
          {input('state_or_province', 'Province')}
          {input('postal_code', 'Postal code', true)}
          {input('country', 'Country', true)}
          {input('delivery_notes', 'Delivery notes', false, true)}
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" className="h-4 w-4 accent-ink" checked={form.is_default} onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))} />
            Set as default delivery address
          </label>
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save address'}</button>
            <button type="button" className="btn-outline" onClick={() => setEditingId(null)}>Cancel</button>
          </div>
        </form>
      }

      <div className="mt-5">
        {loading ?
        <Spinner /> :
        error ?
        <ErrorState message={error} onRetry={reload} /> :
        addresses.length === 0 && editingId === null ?
        <EmptyState icon={MapPinIcon} title="No saved addresses" text="Save an address for faster checkout." /> :

        <ul className="grid gap-4 sm:grid-cols-2">
            {addresses.map((a) =>
          <li key={a.id} className={`flex flex-col rounded-3xl p-5 text-sm ${a.is_default ? 'border-2 border-ink' : 'border border-line'}`}>
                <p className="font-semibold">
                  {a.recipient_name}
                  {a.is_default && <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-white">Default</span>}
                </p>
                <p className="mt-1 text-muted">{a.address_line1}{a.address_line2 ? `, ${a.address_line2}` : ''}</p>
                <p className="text-muted">{a.city}{a.state_or_province ? `, ${a.state_or_province}` : ''} {a.postal_code}</p>
                <p className="text-muted">{a.phone_number}</p>
                <div className="mt-auto flex flex-wrap items-center gap-4 pt-4 text-xs font-semibold">
                  {!a.is_default &&
              <button type="button" onClick={() => makeDefault(a.id)} className="underline underline-offset-2">Set as default</button>
              }
                  <button type="button" onClick={() => startEdit(a)} className="flex items-center gap-1 underline underline-offset-2">
                    <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                  </button>
                  <button type="button" onClick={() => removeAddress(a)} className="flex items-center gap-1 text-sale underline underline-offset-2">
                    <Trash2Icon className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                  </button>
                </div>
              </li>
          )}
          </ul>
        }
      </div>
    </section>);

}