import React, { useEffect, useState } from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../utils/api';
import { errorMessage } from '../../utils/apiError';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import type { BankAccount, BankDetails } from '../../types/api';

const blank: BankAccount = { bank_name: '', account_name: '', account_number: '', branch: '', swift_code: '' };
const fields: {k: keyof BankAccount;label: string;}[] = [
{ k: 'bank_name', label: 'Bank' },
{ k: 'account_name', label: 'Account name' },
{ k: 'account_number', label: 'Account number' },
{ k: 'branch', label: 'Branch' },
{ k: 'swift_code', label: 'SWIFT' }];


export function AdminBankSettings() {
  const { user } = useAuth();
  const canEdit = user?.role === 'ADMIN';
  const { data, loading, error, reload } = useApi(() => api<BankDetails>('/api/admin/payments/bank-details/'));
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [instructions, setInstructions] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!data) return;
    setAccounts(data.bank_accounts ?? []);
    setInstructions(data.instructions ?? '');
  }, [data]);

  const update = (i: number, k: keyof BankAccount, v: string) => setAccounts((list) => list.map((a, idx) => idx === i ? { ...a, [k]: v } : a));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api('/api/admin/payments/bank-details/', { method: 'PUT', body: { bank_accounts: accounts, instructions } });
      toast.success('Bank details updated — customers see the new accounts at checkout.');
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <form onSubmit={save} className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Company bank accounts</h2>
          <p className="text-sm text-muted">{canEdit ? 'Shown to customers who pay by bank transfer.' : 'Only administrators can edit these details.'}</p>
        </div>
        {canEdit &&
        <button type="button" className="btn-outline" onClick={() => setAccounts((a) => [...a, { ...blank }])}>
            <PlusIcon className="h-4 w-4" aria-hidden="true" /> Add account
          </button>
        }
      </div>

      <div className="mt-6 space-y-4">
        {accounts.map((a, i) =>
        <fieldset key={i} className="grid gap-3 rounded-2xl border border-line p-4 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_1.2fr_1fr_0.8fr_auto]">
            <legend className="sr-only">Account {i + 1}</legend>
            {fields.map((f) =>
          <div key={f.k}>
                <label htmlFor={`bk-${i}-${f.k}`} className="label">{f.label}</label>
                <input id={`bk-${i}-${f.k}`} className="input" required disabled={!canEdit} value={a[f.k]} onChange={(e) => update(i, f.k, e.target.value)} />
              </div>
          )}
            {canEdit &&
          <button type="button" onClick={() => setAccounts((list) => list.filter((_, idx) => idx !== i))} className="self-end rounded-full p-3 text-muted hover:bg-surface hover:text-sale" aria-label={`Remove account ${i + 1}`}>
                <Trash2Icon className="h-4 w-4" />
              </button>
          }
          </fieldset>
        )}
      </div>

      <div className="mt-6">
        <label htmlFor="bk-instructions" className="label">Customer instructions</label>
        <textarea id="bk-instructions" className="input min-h-[140px]" disabled={!canEdit} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
      </div>
      {canEdit &&
      <button type="submit" className="btn-primary mt-5" disabled={busy || accounts.length === 0}>
          {busy ? 'Saving…' : 'Save bank details'}
        </button>
      }
    </form>);

}