import React from 'react';
import { Link } from 'react-router-dom';
import { policies, policiesLastUpdated } from '../data/policies';
import type { Policy as PolicyDoc, PolicyBlock } from '../data/policies';
import { PageHero } from '../components/layout/PageHero';

function RichText({ text }: {text: string;}) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
      p.startsWith('**') ?
      <strong key={i} className="font-semibold text-ink">{p.slice(2, -2)}</strong> :

      <React.Fragment key={i}>{p}</React.Fragment>

      )}
    </>);

}

function Block({ block }: {block: PolicyBlock;}) {
  if (block.type === 'p') return <p><RichText text={block.text} /></p>;
  if (block.type === 'h3') return <h3 className="pt-2 font-display text-lg font-semibold text-ink">{block.text}</h3>;
  if (block.type === 'note')
  return (
    <p className="rounded-xl border-l-4 border-ink bg-surface p-4">
        <RichText text={block.text} />
      </p>);

  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-ink-600">
      {block.items.map((i) => <li key={i}><RichText text={i} /></li>)}
    </ul>);

}

export function Policy({ slug }: {slug: PolicyDoc['slug'];}) {
  const policy = policies.find((p) => p.slug === slug)!;

  return (
    <>
      <PageHero title={policy.title} subtitle={policy.summary} crumbs={[{ label: policy.title }]} />
      <div className="mx-auto grid max-w-site gap-12 px-4 py-12 md:px-6 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">On this page</p>
          <ol className="mt-3 space-y-1.5 text-sm">
            {policy.sections.map((s, i) =>
            <li key={s.id}>
                <a href={`#${s.id}`} className="text-ink-700 hover:text-ink hover:underline">{i + 1}. {s.heading}</a>
              </li>
            )}
          </ol>
          <div className="mt-8 border-t border-line pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Other policies</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {policies.filter((p) => p.slug !== slug).map((p) =>
              <li key={p.slug}><Link to={`/${p.slug}`} className="font-medium hover:underline">{p.title}</Link></li>
              )}
            </ul>
          </div>
        </aside>

        <article className="max-w-3xl">
          <p className="text-sm text-muted">Last updated: {policiesLastUpdated} · Arrow Ventures · www.arrowventures.lk</p>
          {policy.sections.map((s, i) =>
          <section key={s.id} id={s.id} className="scroll-mt-28 border-b border-line py-8 last:border-0">
              <h2 className="font-display text-2xl font-bold">{i + 1}. {s.heading}</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink-700">
                {s.blocks.map((b, j) => <Block key={j} block={b} />)}
              </div>
            </section>
          )}
        </article>
      </div>
    </>);

}