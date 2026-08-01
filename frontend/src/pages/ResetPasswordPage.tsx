import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { Lock, KeyRound } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !newPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      const res = await api.post('/auth/reset-password', { email, newPassword });
      if (res.data.success) {
        showToast('Password reset successful! Please log in.');
        navigate('/login');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error resetting password', 'error');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-surface-cardLight dark:bg-surface-cardDark p-8 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-700 flex items-center justify-center text-white mx-auto shadow-brand-glow">
            <KeyRound className="w-6 h-6 text-brand-200" />
          </div>
          <h2 className="text-2xl font-extrabold font-sans text-slate-900 dark:text-white">
            Set New Password
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Account Email
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                placeholder="New password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-brand-glow transition"
          >
            Update Password & Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
