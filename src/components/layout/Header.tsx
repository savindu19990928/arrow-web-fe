import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightIcon, ChevronDownIcon, LayoutDashboardIcon, MenuIcon, SearchIcon, ShoppingBagIcon, UserIcon, XIcon } from 'lucide-react';
import { navLinks } from '../../data/site';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCategories } from '../../hooks/useCatalogMeta';
import { Logo } from './Logo';
import { HeaderSearch } from './HeaderSearch';

const ease = [0.23, 1, 0.32, 1] as const;

export function Header() {
  const { count } = useCart();
  const { user, isStaff } = useAuth();
  const { topLevel: categories } = useCategories();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setMegaOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navItem = 'flex h-full items-center gap-1 px-3 text-[15px] text-white/90 transition-colors duration-150 hover:text-white';

  return (
    <header className="sticky top-0 z-40 bg-ink text-white">
      <div className="mx-auto flex h-14 max-w-site items-center justify-between gap-4 px-4 md:h-16 md:px-6">
        <div className="flex h-full items-center gap-6">
          <Link to="/" aria-label="Arrow Ventures home">
            <Logo inverted />
          </Link>

          <nav aria-label="Main" className="hidden h-full items-center lg:flex">
            <div className="h-full" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
              <button type="button" className={navItem} aria-expanded={megaOpen} onClick={() => setMegaOpen((v) => !v)}>
                Shop
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ease-snappy ${megaOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              <AnimatePresence>
                {megaOpen &&
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4, pointerEvents: 'none' }}
                  transition={{ duration: 0.18, ease }}
                  className="absolute inset-x-0 top-full border-t border-line bg-white text-ink shadow-[0_16px_32px_rgba(0,0,0,0.08)]">
                  
                    <div className="mx-auto grid max-w-site grid-cols-[220px_1fr] gap-10 px-6 py-8">
                      <div>
                        <p className="text-2xl font-extrabold tracking-tight">Shop Arrow</p>
                        <p className="mt-2 text-sm text-muted">E-bikes, batteries, parts and riding gear — delivered islandwide.</p>
                        <Link to="/shop" className="btn-primary mt-5">
                          Shop all <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </div>
                      <ul className="grid grid-cols-4 gap-4">
                        {categories.slice(0, 8).map((c) =>
                      <li key={c.id}>
                            <Link to={`/shop?category=${c.slug}`} className="group block">
                              <span className="block aspect-[4/3] overflow-hidden rounded-xl bg-surface">
                                {c.image &&
                            <img src={c.image} alt="" className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 ease-snappy group-hover:scale-[1.04]" />
                            }
                              </span>
                              <span className="mt-2 block text-sm font-semibold">{c.name}</span>
                              {c.product_count !== undefined && <span className="text-xs text-muted">{c.product_count} products</span>}
                            </Link>
                          </li>
                      )}
                      </ul>
                    </div>
                  </motion.div>
                }
              </AnimatePresence>
            </div>
            {navLinks.map((link) =>
            link.children ?
            <div key={link.label} className="group relative h-full">
                  <NavLink to={link.to} className={navItem}>
                    {link.label}
                    <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                  </NavLink>
                  <div className="invisible absolute left-0 top-full pt-0 opacity-0 transition-[opacity,visibility] duration-150 ease-snappy group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div className="w-56 rounded-b-xl bg-white p-2 text-ink shadow-lg">
                      {link.children.map((c) =>
                  <Link key={c.label} to={c.to} className="block rounded-lg px-3 py-2 text-sm hover:bg-surface">
                          {c.label}
                        </Link>
                  )}
                    </div>
                  </div>
                </div> :

            <NavLink key={link.label} to={link.to} className={navItem}>
                  {link.label}
                </NavLink>

            )}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setSearchOpen((v) => !v)} className="rounded-full p-2.5 text-white/90 hover:text-white" aria-label="Search products" aria-expanded={searchOpen}>
            <SearchIcon className="h-5 w-5" />
          </button>
          {isStaff &&
          <Link to="/admin" className="hidden rounded-full p-2.5 text-white/90 hover:text-white sm:block" aria-label="Admin dashboard">
              <LayoutDashboardIcon className="h-5 w-5" />
            </Link>
          }
          <Link to={user ? '/account' : '/login'} className="hidden items-center gap-2 px-2.5 text-[15px] text-white/90 hover:text-white md:flex">
            {user ? 'My Account' : 'Sign In'}
          </Link>
          <Link to={user ? '/account' : '/login'} className="rounded-full p-2.5 text-white/90 hover:text-white md:hidden" aria-label={user ? 'My account' : 'Sign in'}>
            <UserIcon className="h-5 w-5" />
          </Link>
          <Link to="/cart" className="relative rounded-full p-2.5 text-white/90 hover:text-white" aria-label={`Cart, ${count} items`}>
            <ShoppingBagIcon className="h-[22px] w-[22px]" />
            {count > 0 &&
            <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            }
          </Link>
          <button type="button" onClick={() => setMobileOpen(true)} className="rounded-full p-2.5 lg:hidden" aria-label="Open menu" aria-expanded={mobileOpen}>
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>{searchOpen && <HeaderSearch onClose={() => setSearchOpen(false)} />}</AnimatePresence>

      <AnimatePresence>
        {mobileOpen &&
        <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, pointerEvents: 'none' }} transition={{ duration: 0.2 }}>
            <button type="button" className="absolute inset-0 bg-ink/50" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
            <motion.nav
            aria-label="Mobile"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.26, ease }}
            className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-white text-ink">
            
              <div className="flex h-14 items-center justify-between border-b border-line px-4">
                <Logo compact />
                <button type="button" onClick={() => setMobileOpen(false)} className="rounded-full p-2 hover:bg-surface" aria-label="Close menu">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="px-4 py-5">
                <p className="text-xs font-semibold text-muted">Shop</p>
                <ul className="mt-3 grid grid-cols-2 gap-3">
                  {categories.slice(0, 8).map((c) =>
                <li key={c.id}>
                      <Link to={`/shop?category=${c.slug}`} className="block rounded-xl bg-surface p-3">
                        {c.image && <img src={c.image} alt="" className="aspect-[4/3] w-full object-contain mix-blend-multiply" />}
                        <span className="mt-1 block text-sm font-semibold leading-tight">{c.name}</span>
                      </Link>
                    </li>
                )}
                </ul>
                <Link to="/shop" className="btn-primary mt-4 w-full">
                  Shop all products
                </Link>
              </div>
              <div className="border-t border-line px-4 py-4">
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