import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, CircleCheckIcon, EyeIcon, GemIcon, HeadsetIcon, LeafIcon, ShieldCheckIcon, TruckIcon, BoxIcon } from "lucide-react";
import { PageHero } from "../components/layout/PageHero";
import { LogoMark } from "../components/layout/Logo";
import { aboutValues, images, whyChooseUs } from "../data/site";

const iconMap: Record<string, BoxIcon> = {
  leaf: LeafIcon,
  eye: EyeIcon,
  gem: GemIcon,
  shield: ShieldCheckIcon,
  headset: HeadsetIcon,
  truck: TruckIcon
};

const promises = ['Premium Quality Electric Cycles & Parts', 'Reliable After-Sales Support', 'Expert Advice & Guidance', 'Islandwide Delivery'];

export function About() {
  return (
    <>
      <PageHero title="About" accent="Us" subtitle="Driving a greener, smarter and more connected Sri Lanka." image={images.aboutHero} crumbs={[{ label: 'About Us' }]} />

      <section className="grid items-center gap-8 pt-5 md:grid-cols-2" aria-labelledby="story-h">
        <div className="relative">
          <img src={images.story} alt="Arrow Ventures fat-tire e-cycle in the city" className="slant-right h-[260px] w-full object-cover grayscale md:h-[300px]" />
          <div className="absolute inset-y-0 right-[3%] hidden w-1.5 skew-x-[-24deg] bg-white md:block" aria-hidden="true" />
        </div>
        <div className="px-4 md:pl-2 md:pr-10">
          <p className="eyebrow">Our Story</p>
          <h2 id="story-h" className="headline mt-2 text-4xl md:text-[44px]">Arrow Ventures</h2>
          <p className="mt-3 font-display text-lg font-bold italic">More than just a ride — a better way forward.</p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-700">
            Arrow Ventures was founded with a simple vision: to make clean, efficient and enjoyable transportation accessible to everyone in Sri Lanka.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-700">
            We believe in the power of electric cycles to build a greener future, reduce our carbon footprint and bring people closer to a healthier lifestyle.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-site px-4 pt-5 md:px-6" aria-label="Mission, vision and values">
        <div className="grid rounded-xl bg-surface py-4 md:grid-cols-3 md:[&>*+*]:border-l md:[&>*+*]:border-ink/20">
          {aboutValues.map((v) => {
            const Icon = iconMap[v.icon];
            return (
              <div key={v.title} className="flex flex-col items-center px-8 py-4 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold">{v.title}</h3>
                <p className="mt-2 max-w-[260px] text-[13px] leading-snug text-ink-700">{v.text}</p>
              </div>);

          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-site items-center gap-10 px-4 py-12 md:px-6 lg:grid-cols-[1fr_1.3fr]" aria-labelledby="why-h">
        <div>
          <p className="eyebrow">Why Choose Us</p>
          <h2 id="why-h" className="headline mt-2 text-4xl md:text-[44px]">
            Your Trusted
            <br />
            E-Cycle Partner
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-700">
            At Arrow Ventures, we are committed to delivering more than just products. We provide a complete e-mobility experience with quality, support and care.
          </p>
          <ul className="mt-4 space-y-1.5">
            {promises.map((p) =>
            <li key={p} className="flex items-center gap-3 text-sm">
                <CircleCheckIcon className="h-5 w-5 shrink-0 fill-ink text-white" aria-hidden="true" />
                {p}
              </li>
            )}
          </ul>
          <Link to="/shop" className="btn-primary mt-6">
            Shop with Confidence <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {whyChooseUs.map((w) => {
            const Icon = iconMap[w.icon];
            return (
              <div key={w.title} className="flex flex-col items-center rounded-lg bg-surface px-6 py-6 text-center">
                <Icon className="h-11 w-11 fill-ink text-white" strokeWidth={1.75} aria-hidden="true" />
                <h3 className="mt-3 text-[15px] font-semibold">{w.title}</h3>
                <p className="mt-1 max-w-[200px] text-xs leading-snug text-ink-700">{w.text}</p>
              </div>);

          })}
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink text-white" aria-labelledby="join-h">
        <img src={images.aboutHero} alt="" className="absolute inset-y-0 left-0 hidden h-full w-[48%] object-cover grayscale md:block slant-right" />
        <div className="relative mx-auto flex max-w-site items-center justify-end px-4 py-9 md:px-6">
          <div className="max-w-lg md:mr-40">
            <h2 id="join-h" className="headline text-3xl md:text-[34px]">Join the Arrow Ventures Family</h2>
            <p className="mt-2 text-sm text-white/90">Let's ride towards a cleaner, greener and brighter future together.</p>
            <Link
              to="/shop"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-brand-hover">
              
              Explore Our Products <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="absolute inset-y-0 right-32 hidden w-px skew-x-[-24deg] bg-white/25 lg:block" aria-hidden="true" />
          <LogoMark inverted className="absolute right-8 hidden h-24 w-24 opacity-80 lg:block" />
        </div>
      </section>
    </>);

}