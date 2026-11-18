import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheckIcon, TruckIcon, WalletIcon, WrenchIcon, BoxIcon } from "lucide-react";
import { images, whyArrow } from "../../data/site";
import { SectionHeading } from "./SectionHeading";
const icons: Record<string, BoxIcon> = {
  truck: TruckIcon,
  wallet: WalletIcon,
  shield: ShieldCheckIcon,
  wrench: WrenchIcon
};
export function WhyArrow() {
  return <section className="bg-canvas py-16 md:py-24" aria-labelledby="why-heading">
      <div className="mx-auto max-w-site px-4 md:px-6">
        <SectionHeading id="why-heading" title="Why ride Arrow" description="Everything around the bike, sorted — from first payment to first service." />

        <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div className="overflow-hidden rounded-3xl">
            <img src={images.galleFace} alt="A rider on an Arrow e-bike along Galle Face Green at sunset" className="aspect-[4/3] h-full w-full object-cover sm:aspect-[16/10] lg:aspect-auto" loading="lazy" />
          </div>

          <div className="flex flex-col">
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {whyArrow.map((item) => {
              const Icon = icons[item.icon];
              return <li key={item.title} className="border-t border-line py-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                      <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-base font-bold tracking-tight">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
                  </li>;
            })}
            </ul>
            <Link to="/about" className="btn-outline mt-4 w-full sm:w-fit lg:mt-auto">
              Our story
            </Link>
          </div>
        </div>
      </div>
    </section>;
}