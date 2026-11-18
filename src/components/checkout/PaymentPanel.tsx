import React, { useEffect, useState } from 'react';
import { CheckIcon, CopyIcon, ExternalLinkIcon, Loader2Icon, UploadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../utils/api';
import { errorMessage } from '../../utils/apiError';
import { formatLKR } from '../../utils/format';
import type { BankDetails, PaymentInit, PaymentMethod } from '../../types/api';

interface PaymentPanelProps {
  orderNumber: string;
  method: PaymentMethod;
  amount: string;
  onPaid?: () => void;
}

type Stage = 'idle' | 'starting' | 'simulate' | 'paid' | 'failed' | 'slip-sent';

export function PaymentPanel({ orderNumber, method, amount, onPaid }: PaymentPanelProps) {
  const [stage, setStage] = useState<Stage>('idle');
  const [init, setInit] = useState<PaymentInit | null>(null);
  const [bank, setBank] = useState<BankDetails | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [slip, setSlip] = useState({ reference: '', date: new Date().toISOString().slice(0, 10), bankName: '', file: null as File | null });
  const [sending, setSending] = useState(false);
  const provider = method === 'KOKO' ? 'Koko' : method === 'MINTPAY' ? 'Mintpay' : 'Bank transfer';

  useEffect(() => {
    if (method !== 'BANK_TRANSFER') return;
    api<BankDetails>('/api/payments/bank-details/').then(setBank).catch(() => toast.error('Could not load bank details.'));
  }, [method]);

  const startGateway = async () => {
    setStage('starting');
    try {
      const res = await api<PaymentInit>('/api/payments/initiate/', { method: 'POST', body: { order_number: orderNumber, payment_method: method } });
      setInit(res);
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
        return;
      }
      setStage('simulate');
    } catch (err) {
      toast.error(errorMessage(err));
      setStage('failed');
    }
  };

  const copy = async (text: string) => {
    await navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  const submitSlip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slip.file) {
      toast.error('Please attach your deposit slip.');
      return;
    }
    setSending(true);
    const form = new FormData();
    form.append('order_number', orderNumber);
    form.append('customer_bank_reference', slip.reference);
    form.append('deposit_date', slip.date);
    form.append('bank_name', slip.bankName);
    form.append('bank_slip_image', slip.file);
    try {
      const res = await api<{message: string;}>('/api/payments/bank-transfer/submit-slip/', { method: 'POST', form });
      toast.success(res.message);
      setStage('slip-sent');
      onPaid?.();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSending(false);
    }
  };

  if (stage === 'paid') {
    return (
      <div className="rounded-2xl border border-eco/30 bg-emerald-50 p-6">
        <p className="flex items-center gap-2 font-semibold text-emerald-900"><CheckIcon className="h-5 w-5" aria-hidden="true" />Payment successful</p>
        <p className="mt-1 text-sm text-emerald-900/80">Your {provider} payment was received and your order is confirmed. We've sent a confirmation to your account.</p>
      </div>);

  }

  if (stage === 'slip-sent') {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6">
        <p className="flex items-center gap-2 font-semibold"><CheckIcon className="h-5 w-5 text-eco" aria-hidden="true" />Slip received</p>
        <p className="mt-1 text-sm text-muted">Our team will verify your transfer shortly. Your order is confirmed as soon as the payment is approved.</p>
      </div>);

  }

  if (method === 'BANK_TRANSFER') {
    return (
      <section className="rounded-2xl border border-line p-6" aria-labelledby="bank-h">
        <h2 id="bank-h" className="font-display text-2xl font-semibold">Complete your bank transfer</h2>
        <p className="mt-1 text-sm text-muted">
          Transfer exactly <strong className="text-ink">{formatLKR(amount)}</strong> and use <strong className="font-mono text-ink">{orderNumber}</strong> as the reference.
        </p>
        {!bank ?
        <p className="mt-4 flex items-center gap-2 text-sm text-muted"><Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />Loading bank details…</p> :

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {bank.bank_accounts.map((b) =>
          <div key={b.account_number} className="rounded-xl bg-surface p-4 text-sm">
                <p className="font-semibold">{b.bank_name}</p>
                <p className="text-muted">{b.account_name} · {b.branch}</p>
                <button type="button" onClick={() => copy(b.account_number)} className="mt-2 flex items-center gap-2 font-mono text-base font-semibold">
                  {b.account_number}
                  {copied === b.account_number ? <CheckIcon className="h-4 w-4 text-eco" aria-label="Copied" /> : <CopyIcon className="h-4 w-4 text-muted" aria-label="Copy account number" />}
                </button>
                <p className="text-xs text-muted">SWIFT {b.swift_code}</p>
              </div>
          )}
          </div>
        }

        <form onSubmit={submitSlip} className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
          <h3 className="font-semibold sm:col-span-3">Upload your deposit slip</h3>
          <div>
            <label htmlFor="slip-ref" className="label">Bank reference *</label>
            <input id="slip-ref" className="input" required value={slip.reference} onChange={(e) => setSlip((s) => ({ ...s, reference: e.target.value }))} placeholder="TXN-8871239" />
          </div>
          <div>
            <label htmlFor="slip-date" className="label">Deposit date *</label>
            <input id="slip-date" type="date" className="input" required value={slip.date} onChange={(e) => setSlip((s) => ({ ...s, date: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="slip-bank" className="label">Your bank</label>
            <input id="slip-bank" className="input" value={slip.bankName} onChange={(e) => setSlip((s) => ({ ...s, bankName: e.target.value }))} placeholder="Commercial Bank" />
          </div>
          <label htmlFor="slip-file" className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line p-4 text-sm hover:border-ink sm:col-span-3">
            <UploadIcon className="h-5 w-5" aria-hidden="true" />
            <span className="flex-1">{slip.file ? slip.file.name : 'Choose slip image or PDF (.jpg, .png, .pdf)'}</span>
            <input id="slip-file" type="file" accept=".jpg,.jpeg,.png,.pdf" className="sr-only" onChange={(e) => setSlip((s) => ({ ...s, file: e.target.files?.[0] ?? null }))} />
          </label>
          <button type="submit" className="btn-primary sm:col-span-3 sm:w-fit" disabled={sending}>
            {sending ? 'Submitting…' : 'Submit slip for verification'}
          </button>
        </form>
      </section>);

  }

  return (
    <section className="rounded-2xl border border-line p-6" aria-labelledby="gw-h">
      <h2 id="gw-h" className="font-display text-2xl font-semibold">Pay with {provider}</h2>
      <p className="mt-1 text-sm text-muted">
        {method === 'MINTPAY' ? 'Split' : 'Pay'} <strong className="text-ink">{formatLKR(amount)}</strong>
        {method === 'MINTPAY' ? ` into 3 instalments of ${formatLKR(parseFloat(amount) / 3)}.` : ' in easy instalments with Koko.'}
      </p>
      {stage === 'failed' && <p className="mt-3 text-sm font-medium text-sale">The payment didn't go through. You can try again.</p>}

      {stage === 'simulate' && init ?
      <div className="mt-5 rounded-xl bg-surface p-4">
          <p className="text-sm text-ink-700">{init.message}</p>
          <p className="mt-2 text-xs text-muted">
            Your order is confirmed automatically once {provider} notifies us of the payment. You can follow it from Track Order.
          </p>
          <button type="button" className="btn-outline mt-4" onClick={startGateway}>Try again</button>
        </div> :

      <button type="button" className="btn-primary mt-5" onClick={startGateway} disabled={stage === 'starting'}>
          {stage === 'starting' ? <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />}
          Continue to {provider}
        </button>
      }
    </section>);

}