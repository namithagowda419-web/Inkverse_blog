import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-surface-cardLight dark:bg-surface-cardDark rounded-2xl border border-gray-100 dark:border-surface-borderDark overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-full w-24" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-full w-12" />
        </div>
      </div>
    </div>
  );
};
