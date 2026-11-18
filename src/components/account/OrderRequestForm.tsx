import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../utils/api';
import { errorMessage } from '../../utils/apiError';
import type { Order } from '../../types/api';

interface OrderRequestFormProps {
  order: Order;
  kind: 'cancel' | 'return';
  onDone: () => void;
  onCancel: () => void;
}

const returnTypes = [
{ value: 'RETURN_AND_REFUND', label: 'Return & refund' },
{ value: 'EXCHANGE', label: 'Exchange' },
{ value: 'REFUND', label: 'Refund only' }];


export function OrderRequestForm({ order, kind, onDone, onCancel }: OrderRequestFormProps) {
  const [reason, setReason] = useState('');
  const [type, setType] = useState('RETURN_AND_REFUND');
  const [amount, setAmount] = useState(order.total_amount);
  const [bankDetails, setBankDetails] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (kind === 'cancel') {
        await api(`/api/orders/${order.id}/cancel/`, { method: 'POST', body: { reason } });
        toast.success('Cancellation requested. We will confirm shortly.');
      } else {
        await api(`/api/orders/${order.id}/return-refund/`, {
          method: 'POST',
          body: { type, refund_amount: parseFloat(amount), reason, bank_details_for_refund: bankDetails }
        });
        toast.success('Request submitted. Our team will contact you with next steps.');
      }
      onDone();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line p-6">
      <h3 className="font-display text-xl font-semibold">{kind === 'cancel' ? 'Request cancellation' : 'Request a return or refund'}</h3>
      <p className="text-sm text-muted">
        {kind === 'cancel' ?
        'Orders can be cancelled before they are packed.' :
        'Please include photos when we contact you. Lithium batteries need special return handling — do not courier them without our instructions.'}{' '}
        <Link to="/refund-policy" className="underline">Refund Policy</Link>
      </p>
      {kind === 'return' &&
      <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rq-type" className="label">Request type</label>
            <select id="rq-type" className="input" value={type} onChange={(e) => setType(e.target.value)}>
              {returnTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="rq-amt" className="label">Refund amount (Rs.)</label>
            <input id="rq-amt" className="input" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="rq-bank" className="label">Bank details for refund</label>
            <input id="rq-bank" className="input" placeholder="Bank, account number, account name" value={bankDetails} onChange={(e) => setBankDetails(e.target.value)} />
          </div>
        </div>
      }
      <div>
        <label htmlFor="rq-reason" className="label">Reason *</label>
        <textarea id="rq-reason" className="input min-h-[90px]" required value={reason} onChange={(e) => setReason(e.target.value)} />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Submitting…' : 'Submit request'}</button>
        <button type="button" className="btn-outline" onClick={onCancel}>Back</button>
      </div>
    </form>);

}