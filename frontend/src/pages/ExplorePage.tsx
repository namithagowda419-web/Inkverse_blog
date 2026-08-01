import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Blog, Category } from '../types';
import { BlogCard } from '../components/BlogCard';
import { SkeletonCard } from '../components/SkeletonCard';
import api from '../services/api';
import { Search, Filter, BookOpen } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [query, setQuery] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('latest');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    try {
      let url = `/blogs?sort=${sort}&limit=12`;
      if (query) url += `&search=${encodeURIComponent(query)}`;
      if (category) url += `&category=${category}`;

      const res = await api.get(url);
      if (res.data.success) {
        setBlogs(res.data.blogs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/categories').then((res) => {
      if (res.data.success) setCategories(res.data.categories);
    });
  }, []);

  useEffect(() => {
    fetchResults();
  }, [category, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search: query, category });
    fetchResults();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Hero Header */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-300 mb-2 block">
            Explore & Discover
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-sans mb-6 leading-tight">
            Find Insightful Stories That Matter.
          </h1>

          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by keywords, tags, or topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md text-white text-base pl-12 pr-28 py-3.5 rounded-2xl border border-white/20 placeholder-slate-300 focus:outline-none focus:border-brand-300 transition"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-brand-700 hover:bg-brand-600 text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition shadow-md"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-surface-cardLight dark:bg-surface-cardDark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-brand-700 dark:text-brand-300" />
          <span className="text-xs font-bold uppercase text-slate-500">Category:</span>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSearchParams({ search: query, category: e.target.value });
            }}
            className="bg-slate-50 dark:bg-slate-900 text-sm p-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none text-slate-800 dark:text-slate-200"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold uppercase text-slate-500">Sort By:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 text-sm p-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none text-slate-800 dark:text-slate-200"
          >
            <option value="latest">Most Recent</option>
            <option value="popular">Most Viewed</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : blogs.length === 0 ? (
        <div className="p-12 text-center bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-slate-100 dark:border-slate-800">
          <BookOpen className="w-10 h-10 text-brand-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Matching Stories Found</h3>
          <p className="text-sm font-serif text-slate-500">Try broadening your search keywords or clear your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};
