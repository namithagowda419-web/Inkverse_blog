import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md w-full bg-surface-cardLight dark:bg-surface-cardDark p-8 sm:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-700 text-white flex items-center justify-center mx-auto shadow-brand-glow text-2xl font-bold">
          404
        </div>
        <h1 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm font-serif text-slate-500 leading-relaxed">
          The page or publication route you are looking for has been moved or doesn't exist on InkVerse.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-brand-glow transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};
