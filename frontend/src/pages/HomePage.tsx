import React, { useState, useEffect } from 'react';
import type { Blog, Category } from '../types';
import { BlogCard } from '../components/BlogCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { CategoryPills } from '../components/CategoryPills';
import api from '../services/api';
import { Search, Flame, Clock, FileText, Tag } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState<'latest' | 'trending'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let url = `/blogs?sort=${activeTab}&limit=12`;
      if (selectedCategory) url += `&category=${selectedCategory}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await api.get(url);
      if (res.data.success) {
        setBlogs(res.data.blogs);
      }
    } catch (err) {
      console.error('Failed to fetch home blogs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) setCategories(res.data.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory, activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
            Reader Feed
          </h1>
          <p className="text-sm font-serif text-slate-500">Discover articles, insight, and discussion on InkVerse.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-surface-cardLight dark:bg-surface-cardDark p-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => setActiveTab('latest')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition ${
              activeTab === 'latest'
                ? 'bg-brand-700 text-white shadow-brand-glow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Latest</span>
          </button>

          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition ${
              activeTab === 'trending'
                ? 'bg-brand-700 text-white shadow-brand-glow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Trending</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <CategoryPills
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => setSelectedCategory(slug)}
      />

      {/* Main Grid & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Posts Grid */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-12 text-center bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-slate-100 dark:border-slate-800">
              <FileText className="w-10 h-10 text-brand-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Articles Found</h3>
              <p className="text-sm font-serif text-slate-500">Try adjusting your category filter or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Quick Search */}
          <div className="bg-surface-cardLight dark:bg-surface-cardDark p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-4 font-sans flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Search Stories</span>
            </h3>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Keywords or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 text-sm p-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-600"
              />
            </form>
          </div>

          {/* Popular Tags Widget */}
          <div className="bg-surface-cardLight dark:bg-surface-cardDark p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-4 font-sans flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>Popular Tags</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Design', 'UX', 'NodeJS', 'MongoDB', 'Architecture', 'Productivity', 'DeepWork', 'Frontend', 'TypeScript'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    fetchBlogs();
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 border border-purple-100 dark:border-purple-900 hover:border-brand-500 transition"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
