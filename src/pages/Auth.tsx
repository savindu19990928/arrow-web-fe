import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { errorMessage } from '../utils/apiError';
import { images } from '../data/site';
import { LogoMark } from '../components/layout/Logo';

export function Auth({ mode }: {mode: 'login' | 'register';}) {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') ?? '/account';
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', password_confirm: '', first_name: '', last_name: '', phone_number: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (user) return <Navigate to={next} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && form.password !== form.password_confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const u = mode === 'login' ? await login(form.email, form.password) : await register(form);
      toast.success(mode === 'login' ? `Welcome back, ${u.first_name || 'rider'}!` : 'Your account is ready.');
      navigate(u.role !== 'CUSTOMER' && next === '/account' ? '/admin' : next, { replace: true });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-108px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <img src={images.commuter} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <LogoMark inverted className="h-14 w-14" />
          <p className="headline mt-6 text-5xl">Ride smarter.<br />Live greener.</p>
          <p className="mt-3 max-w-sm text-white/85">Track orders, save addresses and keep your wishlist in one place.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="headline text-5xl">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
          <p className="mt-2 text-sm text-muted">
            {mode === 'login' ? 'New to Arrow Ventures? ' : 'Already have an account? '}
            <Link to={`${mode === 'login' ? '/register' : '/login'}${params.toString() ? `?${params}` : ''}`} className="font-semibold text-ink underline underline-offset-2">
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </Link>
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === 'register' &&
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="fn" className="label">First name</label>
                  <input id="fn" className="input" required autoComplete="given-name" value={form.first_name} onChange={set('first_name')} />
                </div>
                <div>
                  <label htmlFor="ln" className="label">Last name</label>
                  <input id="ln" className="input" required autoComplete="family-name" value={form.last_name} onChange={set('last_name')} />
                </div>
              </div>
            }
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input id="email" type="email" className="input" required autoComplete="email" value={form.email} onChange={set('email')} />
            </div>
            {mode === 'register' &&
            <div>
                <label htmlFor="phone" className="label">Phone number</label>
                <input id="phone" type="tel" className="input" required autoComplete="tel" placeholder="+94 7X XXX XXXX" value={form.phone_number} onChange={set('phone_number')} />
              </div>
            }
            <div>
              <label htmlFor="pw" className="label">Password</label>
              <input id="pw" type="password" className="input" required minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={form.password} onChange={set('password')} />
            </div>
            {mode === 'register' &&
            <div>
                <label htmlFor="pw2" className="label">Confirm password</label>
                <input id="pw2" type="password" className="input" required minLength={8} autoComplete="new-password" value={form.password_confirm} onChange={set('password_confirm')} />
              </div>
            }
            <button type="submit" className="btn-primary w-full" disabled={busy}>
              {busy && <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
            {mode === 'register' &&
            <p className="text-xs text-muted">
                By creating an account you agree to our <Link to="/terms-and-conditions" className="underline">Terms</Link> and <Link to="/privacy-policy" className="underline">Privacy Policy</Link>.
              </p>
            }
          </form>

        </div>
      </div>
    </div>);

}