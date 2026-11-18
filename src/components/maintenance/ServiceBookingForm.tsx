import React, { useState } from 'react';
import { SendIcon } from 'lucide-react';
import { serviceTypes } from '../../data/maintenance';
import { contactInfo } from '../../data/site';

const fields = [
{ k: 'name', label: 'Your name', type: 'text', required: true },
{ k: 'phone', label: 'Phone', type: 'tel', required: true },
{ k: 'bike', label: 'E-cycle model', type: 'text', required: true },
{ k: 'date', label: 'Preferred date', type: 'date', required: false }] as
const;

export function ServiceBookingForm() {
  const [booking, setBooking] = useState({ name: '', phone: '', bike: '', service: serviceTypes[0], date: '', notes: '' });

  const book = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hi Arrow Ventures, I'd like to book a service.\nName: ${booking.name}\nPhone: ${booking.phone}\nE-cycle: ${booking.bike}\nService: ${booking.service}\nPreferred date: ${booking.date || 'Flexible'}\nNotes: ${booking.notes || '-'}`;
    window.open(`${contactInfo.whatsappHref}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  };

  return (
    <form onSubmit={book} className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) =>
      <div key={f.k}>
          <label htmlFor={`bk-${f.k}`} className="mb-1.5 block text-xs font-semibold text-white/85">
            {f.label}
            {f.required && ' *'}
          </label>
          <input
          id={`bk-${f.k}`}
          type={f.type}
          required={f.required}
          className="input"
          value={booking[f.k]}
          onChange={(e) => setBooking((b) => ({ ...b, [f.k]: e.target.value }))} />
        
        </div>
      )}
      <div className="sm:col-span-2">
        <label htmlFor="bk-service" className="mb-1.5 block text-xs font-semibold text-white/85">Service</label>
        <select id="bk-service" className="input" value={booking.service} onChange={(e) => setBooking((b) => ({ ...b, service: e.target.value }))}>
          {serviceTypes.map((t) =>
          <option key={t}>{t}</option>
          )}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="bk-notes" className="mb-1.5 block text-xs font-semibold text-white/85">What's going on?</label>
        <textarea
          id="bk-notes"
          className="input min-h-[90px]"
          placeholder="e.g. brakes squeal, display shows E21, range dropped…"
          value={booking.notes}
          onChange={(e) => setBooking((b) => ({ ...b, notes: e.target.value }))} />
        
      </div>
      <button type="submit" className="btn-accent w-fit">
        <SendIcon className="h-4 w-4" aria-hidden="true" />
        Send booking request
      </button>
    </form>);

}