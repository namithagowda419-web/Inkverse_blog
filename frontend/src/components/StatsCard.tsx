import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  subtitle?: string;
  trend?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, subtitle }) => {
  return (
    <div className="bg-surface-cardLight dark:bg-surface-cardDark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-brand-glow transition duration-300 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider font-bold text-brand-600 dark:text-brand-400 mb-1 font-sans">
          {title}
        </p>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/80 flex items-center justify-center text-brand-700 dark:text-brand-300 border border-purple-100 dark:border-purple-800 shadow-sm shrink-0">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
