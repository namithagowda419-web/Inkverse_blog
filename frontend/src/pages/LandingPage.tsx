import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Blog, Category } from '../types';
import { BlogCard } from '../components/BlogCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { Card3DTilt } from '../components/Card3DTilt';
import { InkVerseLogo } from '../components/InkVerseLogo';
import api from '../services/api';
import { ArrowRight, Feather, BookOpen, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, catsRes] = await Promise.all([
          api.get('/blogs?limit=6'),
          api.get('/categories'),
        ]);
        if (blogsRes.data.success) {
          setFeaturedBlogs(blogsRes.data.blogs);
        }
        if (catsRes.data.success) {
          setCategories(catsRes.data.categories);
        }
      } catch (err) {
        console.error('Failed to load landing data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-20 relative overflow-hidden">
      {/* Background Subtle Floating Depth Orbs */}
      <motion.div
        animate={{ y: [0, -25, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-600/30 to-brand-400/20 blur-3xl pointer-events-none -z-10"
      />
      <motion.div
        animate={{ y: [0, 25, 0], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-60 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-brand-700/20 to-indigo-500/20 blur-3xl pointer-events-none -z-10"
      />

      {/* Hero Banner Section with 3D Float Visual */}
      <section className="relative pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-950/80 text-brand-700 dark:text-brand-300 border border-purple-200 dark:border-purple-800 text-xs font-bold uppercase tracking-widest shadow-sm"
            >
              <Feather className="w-4 h-4 text-brand-600" />
              <span>Next-Generation Publishing Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-6xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight leading-none"
            >
              Where Great Minds Write <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-700 via-brand-600 to-purple-400 bg-clip-text text-transparent">
                With Minimal Depth.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto lg:mx-0 text-lg sm:text-xl font-serif text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              A modern, high-craft publication platform for writers, developers, and thinkers. Discover immersive stories with rich markdown editing and depth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                to="/explore"
                className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-8 py-4 rounded-full shadow-brand-glow hover:shadow-brand-hover transition text-base flex items-center gap-3 active:scale-95"
              >
                <span>Explore Articles</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/write"
                className="bg-surface-cardLight dark:bg-surface-cardDark text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-brand-600 font-semibold px-8 py-4 rounded-full transition text-base active:scale-95"
              >
                Start Writing
              </Link>
            </motion.div>
          </div>

          {/* Floating 3D Graphic Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <Card3DTilt className="w-full max-w-md">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative bg-surface-cardLight dark:bg-surface-cardDark p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <InkVerseLogo size="sm" />
                    <div>
                      <span className="block text-sm font-bold text-slate-900 dark:text-white">InkVerse Craft</span>
                      <span className="text-[10px] text-slate-400 font-serif">Published 2 mins ago</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-brand-700 dark:text-brand-300 text-xs font-bold">
                    Featured
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="h-4 bg-brand-700/20 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-5/6" />
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-xs text-brand-900 dark:text-brand-200 font-serif italic">
                  "Thoughtful publishing with zero distraction."
                </div>
              </motion.div>
            </Card3DTilt>
          </div>
        </div>
      </section>

      {/* Highlights Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900 dark:text-white">
              Editor's Choice & Latest Stories
            </h2>
            <p className="text-sm font-serif text-slate-500">Handpicked articles curated for quality.</p>
          </div>
          <Link to="/explore" className="text-sm font-bold text-brand-700 dark:text-brand-300 hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="space-y-8">
            {featuredBlogs.length > 0 && <BlogCard blog={featuredBlogs[0]} featured={true} />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBlogs.slice(1, 4).map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Categories Spotlight Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-bold font-sans text-slate-900 dark:text-white mb-3">
            Explore Topics
          </h2>
          <p className="text-sm font-serif text-slate-500">
            Dive into specialized channels written by industry leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Card3DTilt key={cat._id} className="h-64">
              <Link
                to={`/explore?category=${cat.slug}`}
                className="group relative block h-full rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-brand-glow transition duration-500"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-6 flex flex-col justify-end">
                  <span className="text-xs text-brand-300 font-bold uppercase tracking-wider mb-1">
                    {cat.postCount || 0} Articles
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-200 transition">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </Card3DTilt>
          ))}
        </div>
      </section>
    </div>
  );
};
