import React, { useState, useEffect } from 'react';
import type { Blog } from '../types';
import { BlogCard } from '../components/BlogCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BookmarksPage: React.FC = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api
        .get('/users/bookmarks')
        .then((res) => {
          if (res.data.success) setBlogs(res.data.blogs);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Sign in Required</h2>
        <p className="text-sm font-serif text-slate-500 mb-6">Please log in to view your saved bookmarks.</p>
        <Link to="/login" className="bg-brand-700 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-full shadow-brand-glow">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-brand-700 dark:text-brand-300 border border-purple-200 dark:border-purple-800">
          <Bookmark className="w-5 h-5 fill-brand-700" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
            Reading Library
          </h1>
          <p className="text-sm font-serif text-slate-500">Your saved InkVerse articles for later reading.</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center font-sans text-slate-500">Loading saved bookmarks...</div>
      ) : blogs.length === 0 ? (
        <div className="p-12 text-center bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-slate-100 dark:border-slate-800">
          <Bookmark className="w-10 h-10 text-brand-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Bookmarks Saved</h3>
          <p className="text-sm font-serif text-slate-500">
            Bookmark articles while reading feeds to build your personal reading list.
          </p>
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
