import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { InkVerseLogo } from '../components/InkVerseLogo';
import { UserPlus, Mail, Lock, User as UserIcon } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !name || !email || !password) {
      showToast('Please complete all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', { username, name, email, password });
      if (res.data.success) {
        register(res.data.token, res.data.user);
        showToast('Registration successful! Welcome to InkVerse.');
        navigate('/dashboard');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-surface-cardLight dark:bg-surface-cardDark p-8 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <InkVerseLogo size="lg" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-xs font-serif text-slate-500">Join our InkVerse publishing community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Eleanor Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-sans focus:outline-none focus:border-brand-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Username
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="eleanor_vance"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-sans focus:outline-none focus:border-brand-600"
              />
            </div>
          </div>

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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                placeholder="Minimum 6 characters"
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
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 font-serif">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-700 font-semibold hover:underline font-sans">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
