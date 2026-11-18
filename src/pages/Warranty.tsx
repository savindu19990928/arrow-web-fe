import React from 'react';
import { Link } from 'react-router-dom';
import { XIcon } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { claimSteps, warrantyCoverage, warrantyExclusions } from '../data/maintenance';
import { contactInfo, images } from '../data/site';

export function Warranty() {
  return (
    <>
      <PageHero
        title="Warranty"
        accent="& Claims"
        subtitle="Clear coverage on every product, and a simple way to claim."
        image={images.workshop}
        crumbs={[{ label: 'Warranty' }]} />
      

      <section className="mx-auto max-w-site px-4 py-14 md:px-6" aria-labelledby="wr-h">
        <p className="eyebrow">Coverage</p>
        <h2 id="wr-h" className="headline mt-2 text-4xl md:text-5xl">What's Covered</h2>
        <p className="mt-3 max-w-2xl text-ink-700">
          Every product shows its warranty on the product page, and it's recorded on your invoice at the time of purchase. Typical coverage for Arrow e-cycles:
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <caption className="sr-only">Warranty coverage by component</caption>
            <thead>
              <tr className="border-b border-ink text-left">
                <th scope="col" className="py-3 font-semibold">Component</th>
                <th scope="col" className="py-3 font-semibold">Coverage</th>
                <th scope="col" className="py-3 font-semibold">What's covered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {warrantyCoverage.map((w) =>
              <tr key={w.component}>
                  <th scope="row" className="py-3.5 text-left font-semibold">{w.component}</th>
                  <td className="py-3.5 font-display text-lg font-bold text-brand">{w.period}</td>
                  <td className="py-3.5 text-ink-700">{w.notes}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-surface" aria-label="Exclusions and claims">
        <div className="mx-auto grid max-w-site gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-display text-2xl font-bold">Not covered</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-700">
              {warrantyExclusions.map((x) =>
              <li key={x} className="flex items-start gap-2">
                  <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  {x}
                </li>
              )}
            </ul>
            <p className="mt-4 text-xs text-muted">Exclusions apply only to the extent permitted by law and don't affect your statutory consumer rights.</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">How to make a claim</h2>
            <ol className="mt-5 grid gap-6 sm:grid-cols-2">
              {claimSteps.map((s, i) =>
              <li key={s.title} className="flex gap-4">
                  <span className="headline text-4xl text-brand" aria-hidden="true">{i + 1}</span>
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="mt-1 text-sm text-ink-700">{s.text}</p>
                  </div>
                </li>
              )}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={contactInfo.whatsappHref} target="_blank" rel="noreferrer" className="btn-primary">Start a claim on WhatsApp</a>
              <Link to="/maintenance#book" className="btn-outline">Book an inspection</Link>
              <Link to="/refund-policy#warranty" className="btn-outline">Read warranty policy</Link>
            </div>
          </div>
        </div>
      </section>
    </>);

}