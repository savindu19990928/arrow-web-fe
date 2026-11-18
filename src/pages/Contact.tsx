import React, { useState } from 'react';
import { ChevronDownIcon, ClockIcon, MailIcon, MessageCircleIcon, PhoneIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHero } from '../components/layout/PageHero';
import { contactInfo, faqs, images } from '../data/site';

const topics = ['Product enquiry', 'Order & delivery', 'Payments', 'Returns & refunds', 'Warranty claim', 'Service & repair', 'Other'];

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: topics[0], message: '' });
  const [open, setOpen] = useState<number | null>(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`;
    window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(`[${form.topic}] Website enquiry`)}&body=${encodeURIComponent(body)}`;
    toast.success('Opening your email app — send the message to reach our team.');
  };

  const channels = [
  { icon: PhoneIcon, label: 'Call us', value: contactInfo.phone, href: contactInfo.phoneHref },
  { icon: MessageCircleIcon, label: 'WhatsApp', value: contactInfo.phone, href: contactInfo.whatsappHref },
  { icon: MailIcon, label: 'Email', value: contactInfo.email, href: contactInfo.emailHref },
  { icon: ClockIcon, label: 'Support hours', value: contactInfo.hours }];


  return (
    <>
      <PageHero title="Contact" accent="Us" subtitle="Questions about a ride, an order or a repair? We're here." image={images.hero} crumbs={[{ label: 'Contact' }]} />

      <div className="mx-auto grid max-w-site gap-12 px-4 py-14 md:px-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="headline text-4xl">Talk to a real rider</h2>
          <p className="mt-3 max-w-md text-ink-700">Our team can help you choose the right e-cycle, check part compatibility, or sort out anything with your order.</p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {channels.map((c) =>
            <li key={c.label} className="flex items-center gap-4 py-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white"><c.icon className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <p className="text-xs text-muted">{c.label}</p>
                  {c.href ?
                <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="font-semibold hover:underline">{c.value}</a> :

                <p className="font-semibold">{c.value}</p>
                }
                </div>
              </li>
            )}
          </ul>
        </div>

        <form onSubmit={submit} className="grid gap-4 rounded-2xl bg-surface p-6 sm:grid-cols-2 md:p-8">
          <h2 className="font-display text-2xl font-semibold sm:col-span-2">Send us a message</h2>
          <div>
            <label htmlFor="c-name" className="label">Name *</label>
            <input id="c-name" className="input" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="c-email" className="label">Email *</label>
            <input id="c-email" type="email" className="input" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="c-phone" className="label">Phone</label>
            <input id="c-phone" type="tel" className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="c-topic" className="label">Topic</label>
            <select id="c-topic" className="input" value={form.topic} onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}>
              {topics.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="c-msg" className="label">Message *</label>
            <textarea id="c-msg" className="input min-h-[140px]" required value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary w-fit">Send message</button>
        </form>
      </div>

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-28 px-4 pb-16 md:px-6" aria-labelledby="faq-h">
        <h2 id="faq-h" className="headline text-center text-4xl">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faqs.map((f, i) =>
          <div key={f.q}>
              <h3>
                <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold">
                  {f.q}
                  <ChevronDownIcon className={`h-5 w-5 shrink-0 transition-transform duration-200 ease-snappy ${open === i ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
              </h3>
              {open === i && <p className="pb-5 text-sm leading-relaxed text-ink-700">{f.a}</p>}
            </div>
          )}
        </div>
      </section>
    </>);

}