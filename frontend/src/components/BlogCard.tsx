import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Blog } from '../types';
import { Heart, Bookmark, Clock, Eye } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Card3DTilt } from './Card3DTilt';

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, featured = false }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [likesCount, setLikesCount] = useState(blog.likesCount);
  const [isLiked, setIsLiked] = useState(!!blog.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(!!blog.isBookmarked);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in to like articles', 'info');
      return;
    }

    try {
      const res = await api.post(`/blogs/${blog._id}/like`);
      if (res.data.success) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
      }
    } catch (err) {
      showToast('Failed to toggle like', 'error');
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in to save bookmarks', 'info');
      return;
    }

    try {
      const res = await api.post(`/blogs/${blog._id}/bookmark`);
      if (res.data.success) {
        setIsBookmarked(res.data.isBookmarked);
        showToast(res.data.isBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks');
      }
    } catch (err) {
      showToast('Failed to bookmark', 'error');
    }
  };

  if (featured) {
    return (
      <Card3DTilt className="mb-10">
        <div className="group relative rounded-3xl overflow-hidden bg-surface-cardLight dark:bg-surface-cardDark border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-brand-glow transition-all duration-500 grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 h-72 lg:h-auto overflow-hidden relative">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent lg:hidden" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-brand-700 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Featured Article
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs font-medium text-brand-600 dark:text-brand-400 mb-3">
                <span className="bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                  {blog.category?.name || 'General'}
                </span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {blog.readTime} min read
                </span>
              </div>

              <Link to={`/blog/${blog.slug}`}>
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition leading-tight mb-3">
                  {blog.title}
                </h2>
              </Link>

              <p className="text-slate-600 dark:text-slate-300 font-serif text-sm line-clamp-3 leading-relaxed mb-6">
                {blog.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link to={`/profile/${blog.author?.username}`} className="flex items-center gap-3 group/author">
                <img
                  src={blog.author?.avatar}
                  alt={blog.author?.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-600/30"
                />
                <div>
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white group-hover/author:text-brand-600 dark:group-hover/author:text-brand-400 transition">
                    {blog.author?.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                    isLiked
                      ? 'bg-purple-100 dark:bg-purple-900/60 text-brand-700 dark:text-brand-300'
                      : 'text-slate-500 hover:text-brand-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-brand-700 text-brand-700' : ''}`} />
                  <span>{likesCount}</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`p-1.5 rounded-full transition ${
                    isBookmarked
                      ? 'text-brand-700 dark:text-brand-300 bg-purple-50 dark:bg-purple-950/60'
                      : 'text-slate-500 hover:text-brand-600'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-brand-700' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card3DTilt>
    );
  }

  return (
    <Card3DTilt className="h-full">
      <div className="group h-full bg-surface-cardLight dark:bg-surface-cardDark rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-md hover:shadow-brand-glow transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="h-48 overflow-hidden relative">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <span className="bg-surface-cardLight/95 dark:bg-surface-cardDark/95 backdrop-blur-md text-brand-700 dark:text-brand-300 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider border border-purple-100 dark:border-purple-900/40">
                {blog.category?.name || 'General'}
              </span>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              <span>{blog.readTime} min read</span>
              <span>•</span>
              <Eye className="w-3.5 h-3.5" />
              <span>{blog.views} views</span>
            </div>

            <Link to={`/blog/${blog.slug}`}>
              <h3 className="text-lg font-bold font-sans text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition line-clamp-2 leading-snug mb-2">
                {blog.title}
              </h3>
            </Link>

            <p className="text-slate-600 dark:text-slate-300 font-serif text-xs line-clamp-2 leading-relaxed mb-4">
              {blog.excerpt}
            </p>
          </div>
        </div>

        <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60">
          <Link to={`/profile/${blog.author?.username}`} className="flex items-center gap-2.5">
            <img
              src={blog.author?.avatar}
              alt={blog.author?.name}
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[110px]">
              {blog.author?.name}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition ${
                isLiked
                  ? 'bg-purple-100 dark:bg-purple-950 text-brand-700 dark:text-brand-300'
                  : 'text-slate-500 hover:text-brand-600'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-brand-700 text-brand-700' : ''}`} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`p-1 rounded-full transition ${
                isBookmarked ? 'text-brand-700 dark:text-brand-300' : 'text-slate-400 hover:text-brand-600'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-brand-700' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </Card3DTilt>
  );
};
