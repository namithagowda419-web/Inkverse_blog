import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { InkVerseLogo } from '../components/InkVerseLogo';
import { LogIn, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        showToast(`Welcome back, ${res.data.user.name}!`);
        navigate('/dashboard');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: demoEmail, password: 'password123' });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        showToast(`Signed in as ${res.data.user.name}`);
        navigate('/dashboard');
      }
    } catch (err: any) {
      showToast('Demo login error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-surface-cardLight dark:bg-surface-cardDark p-8 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <InkVerseLogo size="lg" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs font-serif text-slate-500">Sign in to your InkVerse account</p>
        </div>

        {/* Quick Demo Sign In Buttons */}
        <div className="p-4 bg-purple-50/60 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 block text-center">
            ⚡ Quick Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('admin@inkverse.com')}
              className="text-xs bg-brand-700 hover:bg-brand-800 text-white font-medium py-2 rounded-xl transition"
            >
              Demo Admin
            </button>
            <button
              onClick={() => handleDemoLogin('marcus@inkverse.com')}
              className="text-xs bg-brand-800 hover:bg-brand-900 text-white font-medium py-2 rounded-xl transition"
            >
              Demo Author
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-sans focus:outline-none focus:border-brand-600"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-brand-600 hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-sans focus:outline-none focus:border-brand-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-brand-glow transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 font-serif">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-700 font-semibold hover:underline font-sans">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};
