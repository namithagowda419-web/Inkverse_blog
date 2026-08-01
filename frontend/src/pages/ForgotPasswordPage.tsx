import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { showToast } = useNotification();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSent(true);
        showToast('Password reset link sent to your email');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error requesting reset', 'error');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-surface-cardLight dark:bg-surface-cardDark p-8 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl space-y-6">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-brand-700">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-700 flex items-center justify-center text-white mx-auto shadow-brand-glow">
            <KeyRound className="w-6 h-6 text-brand-200" />
          </div>
          <h2 className="text-2xl font-extrabold font-sans text-slate-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-xs font-serif text-slate-500">
            Enter your account email to receive reset instructions.
          </p>
        </div>

        {sent ? (
          <div className="p-4 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300 rounded-2xl text-xs font-serif text-center space-y-3">
            <p>Password reset instructions have been dispatched to <strong>{email}</strong>.</p>
            <Link to="/reset-password" className="block text-brand-700 font-bold underline font-sans">
              Proceed to Reset Password Page
            </Link>
          </div>
        ) : (
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
                  className="w-full bg-slate-50 dark:bg-slate-900 pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-brand-glow transition"
            >
              Send Reset Instructions
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
