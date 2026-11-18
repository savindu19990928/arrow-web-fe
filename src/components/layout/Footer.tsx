import React from 'react';
import { Link } from 'react-router-dom';
import { MailIcon, MessageCircleIcon, PhoneIcon } from 'lucide-react';
import { contactInfo, socialLinks } from '../../data/site';
import { useCategories } from '../../hooks/useCatalogMeta';
import { Logo } from './Logo';
import { SocialIcon } from './SocialIcon';

const supportLinks = [
{ label: 'Track Order', to: '/track-order' },
{ label: 'Maintenance & Repairs', to: '/maintenance' },
{ label: 'Warranty', to: '/warranty' },
{ label: 'FAQs', to: '/contact#faq' },
{ label: 'Contact Us', to: '/contact' }];


const companyLinks = [
{ label: 'About Arrow Ventures', to: '/about' },
{ label: 'Refund Policy', to: '/refund-policy' },
{ label: 'Privacy Policy', to: '/privacy-policy' },
{ label: 'Terms & Conditions', to: '/terms-and-conditions' }];


export function Footer() {
  const { topLevel } = useCategories();

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-site px-4 pb-8 pt-14 md:px-6 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo inverted />
            <p className="mt-6 max-w-xs text-2xl font-bold leading-snug tracking-tight">Electric rides, built for Sri Lankan roads.</p>
            <ul className="mt-6 space-y-2.5 text-sm text-white/75">
              <li>
                <a href={contactInfo.phoneHref} className="flex items-center gap-2.5 hover:text-white">
                  <PhoneIcon className="h-4 w-4" aria-hidden="true" /> {contactInfo.phone}
                </a>
              </li>
              <li>
                <a href={contactInfo.whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-white">
                  <MessageCircleIcon className="h-4 w-4" aria-hidden="true" /> WhatsApp us
                </a>
              </li>
              <li>
                <a href={contactInfo.emailHref} className="flex items-center gap-2.5 hover:text-white">
                  <MailIcon className="h-4 w-4" aria-hidden="true" /> {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-3">
            <nav aria-label="Shop">
              <h2 className="text-sm font-semibold">Shop</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-white/70">
                {topLevel.slice(0, 6).map((c) =>
                <li key={c.id}>
                    <Link to={`/shop?category=${c.slug}`} className="transition-colors duration-150 hover:text-white">
                      {c.name}
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/shop" className="transition-colors duration-150 hover:text-white">
                    All products
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Support">
              <h2 className="text-sm font-semibold">Support</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-white/70">
                {supportLinks.map((l) =>
                <li key={l.label}>
                    <Link to={l.to} className="transition-colors duration-150 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            <nav aria-label="Company">
              <h2 className="text-sm font-semibold">Company</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-white/70">
                {companyLinks.map((l) =>
                <li key={l.label}>
                    <Link to={l.to} className="transition-colors duration-150 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/15 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {socialLinks.map((s) =>
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="text-white/80 transition-colors duration-150 hover:text-white">
                <SocialIcon name={s.icon} className="h-5 w-5" />
              </a>
            )}
          </div>
          <p>© {new Date().getFullYear()} Arrow Ventures (Pvt) Ltd. All rights reserved.</p>
          <p>
            Made by{' '}
            <a href="https://www.devrious.lk" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline-offset-4 hover:underline">
              Devrious
            </a>
          </p>
        </div>
      </div>
    </footer>);

}