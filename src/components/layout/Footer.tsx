import React from 'react';
import { Link } from 'react-router-dom';
import { MailIcon, MessageCircleIcon, PhoneIcon } from 'lucide-react';
import { contactInfo, socialLinks } from '../../data/site';
import { useCategories } from '../../hooks/useCatalogMeta';
import { Wordmark } from './Logo';
import { SocialIcon } from './SocialIcon';

const supportLinks = [
{ label: 'Track Order', to: '/track-order' },
{ label: 'Book a Service', to: '/maintenance' },
{ label: 'Warranty', to: '/warranty' },
{ label: 'FAQs', to: '/contact#faq' },
{ label: 'Contact Us', to: '/contact' }];


const companyLinks = [
{ label: 'About Arrow', to: '/about' },
{ label: 'Reviews', to: '/#reviews' },
{ label: 'Find a Store', to: '/contact' },
{ label: '3D Showroom', to: '/shop?has_3d_model=true' }];


const legalLinks = [
{ label: 'Refund Policy', to: '/refund-policy' },
{ label: 'Privacy Policy', to: '/privacy-policy' },
{ label: 'Terms & Conditions', to: '/terms-and-conditions' }];


const payments = ['Koko', 'Mintpay', 'Bank Transfer'];

export function Footer() {
  const { topLevel } = useCategories();

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-site px-4 pb-8 pt-14 md:px-6 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Wordmark inverted className="!text-2xl" />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/60">
              Lightweight, beautifully simple electric bikes — made for Sri Lankan roads and delivered to your door.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={contactInfo.whatsappHref} target="_blank" rel="noreferrer" className="btn-accent">
                <MessageCircleIcon className="h-4 w-4" aria-hidden="true" /> Chat with a rider expert
              </a>
            </div>
            <ul className="mt-7 space-y-2.5 text-sm text-white/60">
              <li>
                <a href={contactInfo.phoneHref} className="inline-flex items-center gap-2.5 hover:text-white">
                  <PhoneIcon className="h-4 w-4" aria-hidden="true" /> {contactInfo.phone}
                </a>
              </li>
              <li>
                <a href={contactInfo.emailHref} className="inline-flex items-center gap-2.5 hover:text-white">
                  <MailIcon className="h-4 w-4" aria-hidden="true" /> {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterColumn title="E-Bikes" links={[...topLevel.slice(0, 5).map((c) => ({ label: c.name, to: `/shop?category=${c.slug}` })), { label: 'Shop All', to: '/shop' }]} />
            <FooterColumn title="Support" links={supportLinks} />
            <FooterColumn title="About" links={companyLinks} />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/15 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            {socialLinks.map((s) =>
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="text-white/70 transition-colors duration-150 hover:text-white">
                <SocialIcon name={s.icon} className="h-5 w-5" />
              </a>
            )}
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {payments.map((p) =>
            <li key={p} className="rounded-md border border-white/20 px-2.5 py-1 text-xs font-medium text-white/80">
                {p}
              </li>
            )}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Arrow Ventures (Pvt) Ltd. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) =>
            <li key={l.label}>
                <Link to={l.to} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            )}
            <li>
              Made by{' '}
              <a href="https://www.devrious.lk" target="_blank" rel="noopener noreferrer" className="font-semibold text-white/80 hover:text-white">
                Devrious
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>);

}

function FooterColumn({ title, links }: {title: string;links: {label: string;to: string;}[];}) {
  return (
    <nav aria-label={title}>
      <h2 className="text-base font-semibold">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm text-white/60">
        {links.map((l) =>
        <li key={l.label}>
            <Link to={l.to} className="transition-colors duration-150 hover:text-white">
              {l.label}
            </Link>
          </li>
        )}
      </ul>
    </nav>);

}