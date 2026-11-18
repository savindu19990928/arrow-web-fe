import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangleIcon, ArrowRightIcon, BatteryChargingIcon, CheckIcon, ClockIcon, PhoneIcon, ShieldCheckIcon, WrenchIcon } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { ServiceBookingForm } from '../components/maintenance/ServiceBookingForm';
import { batteryCareTips, commonRepairs, maintenanceSchedule, serviceSteps, warningSigns } from '../data/maintenance';
import { contactInfo, images } from '../data/site';

const sections = [
{ id: 'repairs', label: 'Repairs' },
{ id: 'care', label: 'Care Guide' },
{ id: 'process', label: 'How It Works' },
{ id: 'book', label: 'Book a Service' }];


export function Maintenance() {
  return (
    <>
      <PageHero
        title="Maintenance"
        accent="& Repairs"
        subtitle="Keep your e-cycle running like day one — expert servicing and honest repairs."
        image={images.workshop}
        crumbs={[{ label: 'Maintenance & Repairs' }]} />
      

      <nav aria-label="On this page" className="sticky top-[72px] z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="no-scrollbar mx-auto flex max-w-site items-center gap-1 overflow-x-auto px-4 py-2 md:px-6">
          {sections.map((s) =>
          <a
            key={s.id}
            href={`#${s.id}`}
            className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-150 hover:bg-surface">
            
              {s.label}
            </a>
          )}
          <a href="#book" className="btn-accent ml-auto hidden px-4 py-2 text-[13px] md:inline-flex">
            Book a Service <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </nav>

      {/* Repairs */}
      <section id="repairs" className="mx-auto max-w-site scroll-mt-36 px-4 py-14 md:px-6 md:py-16" aria-labelledby="rp-h">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-start">
          <div>
            <p className="eyebrow">Repairs</p>
            <h2 id="rp-h" className="headline mt-2 text-4xl md:text-5xl">We Fix It Right</h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-700">
              From punctures to motor faults, we diagnose and repair all Arrow e-cycles and most other brands. You'll always get a quote before we start work.
            </p>

            <div className="mt-8 rounded-2xl bg-surface p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <WrenchIcon className="h-4 w-4 text-brand" aria-hidden="true" />
                Bring it in if you notice
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm text-ink-700">
                {warningSigns.map((w) =>
                <li key={w} className="flex items-start gap-2.5">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    {w}
                  </li>
                )}
              </ul>
            </div>

            <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-sale/20 bg-sale/5 p-3.5 text-xs leading-relaxed text-ink-700">
              <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-sale" aria-hidden="true" />
              <span>
                Don't ride if you suspect a fault with the brakes, frame, steering, wheels, motor, battery or wiring. Call{' '}
                <a href={contactInfo.phoneHref} className="font-semibold text-ink underline underline-offset-2">{contactInfo.phone}</a>.
              </span>
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="flex items-center justify-between gap-4 bg-ink px-5 py-4 text-white">
              <h3 className="font-display text-lg font-semibold">Common repairs</h3>
              <span className="text-xs text-white/70">Labour estimates</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] text-sm">
                <caption className="sr-only">Common repairs, typical turnaround and starting price</caption>
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
                    <th scope="col" className="px-5 py-3 font-semibold">Repair</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Turnaround</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">From</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {commonRepairs.map((r) =>
                  <tr key={r.issue}>
                      <td className="px-5 py-3.5 font-medium">{r.issue}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-ink-700">
                          <ClockIcon className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                          {r.turnaround}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right font-semibold">{r.from}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="border-t border-line bg-surface/60 px-5 py-3 text-xs text-muted">
              Parts are quoted separately. Repairs covered by warranty are free of charge.
            </p>
          </div>
        </div>
      </section>

      {/* Care guide */}
      <section id="care" className="scroll-mt-36 bg-surface" aria-labelledby="cg-h">
        <div className="mx-auto max-w-site px-4 py-14 md:px-6 md:py-16">
          <p className="eyebrow">Care Guide</p>
          <h2 id="cg-h" className="headline mt-2 text-4xl md:text-5xl">Look After Your Ride</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl bg-white p-6 md:p-8">
              <h3 className="font-display text-2xl font-bold">Maintenance schedule</h3>
              <ol className="mt-6 border-l-2 border-brand/30 pl-6">
                {maintenanceSchedule.map((m) =>
                <li key={m.when} className="relative pb-6 last:pb-0">
                    <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-brand bg-white" aria-hidden="true" />
                    <p className="font-semibold">{m.when}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-700">{m.tasks}</p>
                  </li>
                )}
              </ol>
            </div>
            <div className="flex flex-col rounded-2xl bg-ink p-6 text-white md:p-8">
              <h3 className="flex items-center gap-2.5 font-display text-2xl font-bold">
                <BatteryChargingIcon className="h-6 w-6 text-brand-bright" aria-hidden="true" />
                Battery care
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-white/85">
                {batteryCareTips.map((t) =>
                <li key={t} className="flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-bright" aria-hidden="true" />
                    {t}
                  </li>
                )}
              </ul>
              <p className="mt-6 flex items-start gap-2 rounded-xl bg-white/10 p-3.5 text-xs leading-relaxed text-white/90">
                <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                If a battery is swollen, leaking, hot or smells unusual, stop using and charging it and contact us immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="mx-auto max-w-site scroll-mt-36 px-4 py-14 md:px-6 md:py-16" aria-labelledby="pr-h">
        <p className="eyebrow">How It Works</p>
        <h2 id="pr-h" className="headline mt-2 text-4xl md:text-5xl">Service in Four Steps</h2>
        <ol className="relative mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <span className="absolute left-0 right-0 top-5 hidden h-px bg-line lg:block" aria-hidden="true" />
          {serviceSteps.map((s, i) =>
          <li key={s.title} className="relative">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand font-display text-base font-bold text-white ring-8 ring-white">
                {i + 1}
              </span>
              <p className="mt-4 font-display text-xl font-bold">{s.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{s.text}</p>
            </li>
          )}
        </ol>

        <Link
          to="/warranty"
          className="group mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand/20 bg-brand-soft p-5 transition-colors duration-150 hover:border-brand/40">
          
          <span className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white">
              <ShieldCheckIcon className="h-6 w-6 text-brand" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold">Is it covered by warranty?</span>
              <span className="block text-sm text-ink-700">Check coverage periods and how to make a claim.</span>
            </span>
          </span>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-brand">
            View warranty details
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 ease-snappy group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </Link>
      </section>

      {/* Booking */}
      <section id="book" className="scroll-mt-36 bg-ink text-white" aria-labelledby="bk-h">
        <div className="mx-auto grid max-w-site gap-10 px-4 py-14 md:px-6 md:py-16 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-brand-bright">
              Book Now <span className="h-0.5 w-11 rounded-full bg-brand-bright" aria-hidden="true" />
            </p>
            <h2 id="bk-h" className="headline mt-2 text-4xl md:text-5xl">Book a Service</h2>
            <p className="mt-4 max-w-sm leading-relaxed text-white/80">Tell us about your e-cycle and we'll confirm a time on WhatsApp.</p>
            <div className="mt-6 space-y-3 text-sm">
              <a href={contactInfo.phoneHref} className="flex items-center gap-3 text-white/90 transition-colors duration-150 hover:text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <PhoneIcon className="h-4 w-4 text-brand-bright" aria-hidden="true" />
                </span>
                {contactInfo.phone}
              </a>
              <p className="flex items-center gap-3 text-white/90">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <ClockIcon className="h-4 w-4 text-brand-bright" aria-hidden="true" />
                </span>
                {contactInfo.hours}
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 md:p-7">
            <ServiceBookingForm />
          </div>
        </div>
      </section>
    </>);

}