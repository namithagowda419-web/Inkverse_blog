import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../types';
import api from '../services/api';
import { Layers, ArrowRight } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/categories')
      .then((res) => {
        if (res.data.success) setCategories(res.data.categories);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-brand-700 dark:text-brand-300 mx-auto mb-4 border border-purple-200 dark:border-purple-800">
          <Layers className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight mb-3">
          Publication Channels
        </h1>
        <p className="text-base font-serif text-slate-500">
          Browse through specialized knowledge domains and editorial topics on InkVerse.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-brand-glow transition duration-500 grid grid-cols-1 sm:grid-cols-12"
            >
              <div className="sm:col-span-5 h-48 sm:h-auto overflow-hidden relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-widest block mb-2">
                    {cat.postCount || 0} Articles Published
                  </span>
                  <h2 className="text-2xl font-bold font-sans text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition mb-3">
                    {cat.name}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 font-serif text-sm line-clamp-3 leading-relaxed mb-4">
                    {cat.description || 'Discover articles, deep dives, and expert commentary.'}
                  </p>
                </div>

                <Link
                  to={`/explore?category=${cat.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 group-hover:translate-x-1 transition"
                >
                  <span>Explore Channel</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
