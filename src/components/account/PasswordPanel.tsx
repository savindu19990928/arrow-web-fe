import React, { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../utils/api';
import { errorMessage } from '../../utils/apiError';

export function PasswordPanel() {
  const [form, setForm] = useState({ old_password: '', new_password: '', new_password_confirm: '' });
  const [busy, setBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.new_password !== form.new_password_confirm) {
      toast.error('New passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const res = await api<{message: string;}>('/api/auth/change-password/', { method: 'POST', body: form });
      toast.success(res.message);
      setForm({ old_password: '', new_password: '', new_password_confirm: '' });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const fields: {k: keyof typeof form;label: string;auto: string;}[] = [
  { k: 'old_password', label: 'Current password', auto: 'current-password' },
  { k: 'new_password', label: 'New password', auto: 'new-password' },
  { k: 'new_password_confirm', label: 'Confirm new password', auto: 'new-password' }];


  return (
    <section aria-labelledby="pw-h">
      <h2 id="pw-h" className="font-display text-2xl font-semibold">Change password</h2>
      <form onSubmit={save} className="mt-6 max-w-sm space-y-4">
        {fields.map((f) =>
        <div key={f.k}>
            <label htmlFor={`pw-${f.k}`} className="label">{f.label}</label>
            <input id={`pw-${f.k}`} type="password" className="input" required minLength={f.k === 'old_password' ? 1 : 8} autoComplete={f.auto} value={form[f.k]} onChange={(e) => setForm((s) => ({ ...s, [f.k]: e.target.value }))} />
          </div>
        )}
        <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</button>
      </form>
    </section>);

}