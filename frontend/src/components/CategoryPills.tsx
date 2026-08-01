import React from 'react';
import type { Category } from '../types';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory('')}
        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
          selectedCategory === ''
            ? 'bg-brand-700 text-white shadow-brand-glow scale-105'
            : 'bg-surface-cardLight dark:bg-surface-cardDark text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-600'
        }`}
      >
        ✨ All Topics
      </button>

      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onSelectCategory(cat.slug)}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
            selectedCategory === cat.slug
              ? 'bg-brand-700 text-white shadow-brand-glow scale-105'
              : 'bg-surface-cardLight dark:bg-surface-cardDark text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-600'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};
