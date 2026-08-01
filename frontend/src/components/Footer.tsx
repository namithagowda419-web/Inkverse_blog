import React from 'react';
import { Link } from 'react-router-dom';
import { InkVerseLogo } from './InkVerseLogo';
import { Heart, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <InkVerseLogo size="md" />
              <span className="text-xl font-bold font-sans tracking-tight text-white">
                Ink<span className="text-brand-400">Verse</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 font-serif leading-relaxed">
              A modern digital publishing platform for writers, developers, and thinkers. Built with minimal aesthetic, deep purple tones, and reading clarity.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-300 mb-4 font-sans">
              Discover
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/" className="hover:text-brand-300 transition">
                  Featured Articles
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-brand-300 transition">
                  Trending Stories
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-brand-300 transition">
                  Explore Topics
                </Link>
              </li>
              <li>
                <Link to="/write" className="hover:text-brand-300 transition">
                  Publish an Article
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-300 mb-4 font-sans">
              Top Topics
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/explore?category=technology" className="hover:text-brand-300 transition">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link to="/explore?category=design-ux" className="hover:text-brand-300 transition">
                  UI/UX Design & Craft
                </Link>
              </li>
              <li>
                <Link to="/explore?category=productivity" className="hover:text-brand-300 transition">
                  Deep Work & Flow
                </Link>
              </li>
              <li>
                <Link to="/explore?category=architecture" className="hover:text-brand-300 transition">
                  System Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-300 font-sans">
              Newsletter
            </h4>
            <p className="text-xs text-slate-400 font-serif">
              Subscribe to get curated weekly reads delivered directly to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-slate-900 text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-700 hover:bg-brand-600 text-white text-xs uppercase tracking-wider font-semibold py-2.5 rounded-xl transition shadow-brand-glow"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 InkVerse Publishing Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-brand-300 font-medium">
              Crafted with <Heart className="w-3.5 h-3.5 text-purple-400 fill-purple-400 inline" /> for thinkers & writers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
