import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightIcon, ChevronDownIcon, LayoutDashboardIcon, MenuIcon, SearchIcon, ShoppingCartIcon, XIcon } from 'lucide-react';
import { navLinks } from '../../data/site';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCategories } from '../../hooks/useCatalogMeta';
import { Wordmark } from './Logo';
import { HeaderSearch } from './HeaderSearch';

const ease = [0.23, 1, 0.32, 1] as const;

export function Header() {
  const { count } = useCart();
  const { user, isStaff } = useAuth();
  const { topLevel } = useCategories();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = useLocation();

  const accessories = topLevel.find((c) => /accessor|gear|part/i.test(c.name));
  const bikeCategories = topLevel.filter((c) => c.id !== accessories?.id);
  const accessoriesTo = accessories ? `/shop?category=${accessories.slug}` : '/shop';

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setMegaOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navItem = 'flex h-full items-center gap-1 px-4 text-[15px] leading-none text-white/90 transition-colors duration-150 hover:text-white xl:px-5';

  return (
    <header className="sticky top-0 z-40 bg-black text-white">
      <div className="mx-auto flex h-14 max-w-site items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex h-full items-center gap-6 xl:gap-8">
          <Link to="/" aria-label="Arrow Ventures home" className="flex h-full items-center">
            <Wordmark inverted />
          </Link>

          <nav aria-label="Main" className="hidden h-full items-center lg:flex">
            <div className="h-full" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
              <button type="button" className={navItem} aria-expanded={megaOpen} onClick={() => setMegaOpen((v) => !v)}>
                E-Bikes
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ease-snappy ${megaOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              <AnimatePresence>
                {megaOpen &&
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6, pointerEvents: 'none' }}
                  transition={{ duration: 0.2, ease }}
                  className="absolute inset-x-0 top-full bg-white text-ink shadow-[0_24px_40px_rgba(0,0,0,0.08)]">
                  
                    <div className="mx-auto max-w-site px-6 py-8">
                      <ul className="grid grid-cols-4 gap-5">
                        {bikeCategories.slice(0, 4).map((c, i) =>
                      <motion.li key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease, delay: i * 0.04 }}>
                            <Link to={`/shop?category=${c.slug}`} className="group block">
                              <span className="block aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
                                {c.image &&
                            <img src={c.image} alt="" className="h-full w-full object-contain p-3 mix-blend-multiply transition-transform duration-300 ease-snappy group-hover:scale-[1.05]" />
                            }
                              </span>
                              <span className="mt-3 flex items-center justify-between">
                                <span className="text-base font-semibold">{c.name}</span>
                                <ArrowRightIcon className="h-4 w-4 -translate-x-1 opacity-0 transition-[opacity,transform] duration-200 ease-snappy group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                              </span>
                              {c.description && <span className="mt-0.5 line-clamp-1 block text-sm text-muted">{c.description}</span>}
                            </Link>
                          </motion.li>
                      )}
                      </ul>
                      <div className="mt-6 flex items-center justify-between border-t border-line pt-5 text-sm">
                        <span className="text-muted">Not sure which ride fits? Compare every model side by side.</span>
                        <Link to="/shop" className="inline-flex items-center gap-1.5 font-semibold text-brand hover:text-brand-hover">
                          Shop all E-Bikes <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                }
              </AnimatePresence>
            </div>
            <NavLink to={accessoriesTo} className={navItem}>
              Accessories
            </NavLink>
            {navLinks.map((link) =>
            link.children ?
            <div key={link.label} className="group relative h-full">
                  <Link to={link.to} className={navItem}>
                    {link.label}
                  </Link>
                  <div className="invisible absolute left-0 top-full translate-y-1 opacity-0 transition-[opacity,transform,visibility] duration-150 ease-snappy group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="w-56 bg-white p-2 text-ink shadow-[0_16px_32px_rgba(0,0,0,0.1)]">
                      {link.children.map((c) =>
                  <Link key={c.label} to={c.to} className="block px-3 py-2.5 text-sm hover:bg-surface">
                          {c.label}
                        </Link>
                  )}
                    </div>
                  </div>
                </div> :

            <Link key={link.label} to={link.to} className={navItem}>
                  {link.label}
                </Link>

            )}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setSearchOpen((v) => !v)} className="p-2.5 text-white/90 hover:text-white" aria-label="Search products" aria-expanded={searchOpen}>
            <SearchIcon className="h-5 w-5" />
          </button>
          {isStaff &&
          <Link to="/admin" className="hidden p-2.5 text-white/90 hover:text-white sm:block" aria-label="Admin dashboard">
              <LayoutDashboardIcon className="h-5 w-5" />
            </Link>
          }
          <Link to={user ? '/account' : '/login'} className="hidden px-3 text-[15px] text-white/90 hover:text-white md:block">
            {user ? 'My Account' : 'Sign In'}
          </Link>
          <Link to="/cart" className="relative p-2.5 text-white/90 hover:text-white" aria-label={`Cart, ${count} items`}>
            <ShoppingCartIcon className="h-[22px] w-[22px]" strokeWidth={1.6} />
            {count > 0 &&
            <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            }
          </Link>
          <button type="button" onClick={() => setMobileOpen(true)} className="p-2.5 lg:hidden" aria-label="Open menu" aria-expanded={mobileOpen}>
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>{searchOpen && <HeaderSearch onClose={() => setSearchOpen(false)} />}</AnimatePresence>

      <AnimatePresence>
        {mobileOpen &&
        <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, pointerEvents: 'none' }} transition={{ duration: 0.2 }}>
            <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
            <motion.nav
            aria-label="Mobile"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.26, ease }}
            className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-white text-ink">
            
              <div className="flex h-14 items-center justify-between bg-black px-4 text-white">
                <Wordmark inverted />
                <button type="button" onClick={() => setMobileOpen(false)} className="p-2" aria-label="Close menu">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="px-4 py-5">
                <p className="text-lg font-bold">E-Bikes</p>
                <ul className="mt-3 grid grid-cols-2 gap-3">
                  {bikeCategories.slice(0, 6).map((c) =>
                <li key={c.id}>
                      <Link to={`/shop?category=${c.slug}`} className="block rounded-2xl bg-surface p-3">
                        {c.image && <img src={c.image} alt="" className="aspect-[4/3] w-full object-contain mix-blend-multiply" />}
                        <span className="mt-1 block text-sm font-semibold leading-tight">{c.name}</span>
                      </Link>
                    </li>
                )}
                </ul>
                <Link to="/shop" className="btn-accent mt-4 w-full">
                  Shop all E-Bikes
                </Link>
              </div>
              <div className="border-t border-line px-4 py-3">
                <Link to={accessoriesTo} className="block py-3 text-base font-semibold">
                  Accessories
                </Link>
                {navLinks.map((link) =>
              <div key={link.label}>
                    <Link to={link.to} className="block py-3 text-base font-semibold">
                      {link.label}
                    </Link>
                    {link.children &&
                <div className="mb-2 border-l border-line pl-4">
                        {link.children.map((c) =>
                  <Link key={c.label} to={c.to} className="block py-2 text-sm text-muted hover:text-ink">
                            {c.label}
                          </Link>
                  )}
                      </div>
                }
                  </div>
              )}
                <Link to={user ? '/account' : '/login'} className="block py-3 text-base font-semibold">
                  {user ? 'My Account' : 'Sign In / Register'}
                </Link>
                {isStaff &&
              <Link to="/admin" className="block py-3 text-base font-semibold">
                    Admin Dashboard
                  </Link>
              }
              </div>
            </motion.nav>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}