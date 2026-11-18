import React, { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../utils/api';
import { errorMessage } from '../../utils/apiError';
import { formatDate } from '../../utils/format';
import { useAuth } from '../../contexts/AuthContext';
import type { User } from '../../types/api';

export function ProfilePanel() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ first_name: user?.first_name ?? '', last_name: user?.last_name ?? '', phone_number: user?.phone_number ?? '' });
  const [busy, setBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      setUser(await api<User>('/api/auth/profile/', { method: 'PATCH', body: form }));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="pf-h">
      <h2 id="pf-h" className="font-display text-2xl font-semibold">Profile</h2>
      <p className="mt-1 text-sm text-muted">{user?.email} · Member since {formatDate(user?.created_at)}</p>
      <form onSubmit={save} className="mt-6 grid max-w-xl gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pf-fn" className="label">First name</label>
          <input id="pf-fn" className="input" value={form.first_name} onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))} />
        </div>
        <div>
          <label htmlFor="pf-ln" className="label">Last name</label>
          <input id="pf-ln" className="input" value={form.last_name} onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="pf-ph" className="label">Phone number</label>
          <input id="pf-ph" type="tel" className="input" value={form.phone_number} onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))} />
        </div>
        <button type="submit" className="btn-primary w-fit" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
      </form>
    </section>);

}