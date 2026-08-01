import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { InkVerseLogo } from './InkVerseLogo';
import {
  Search,
  PenSquare,
  Sun,
  Moon,
  User as UserIcon,
  LayoutDashboard,
  Bookmark,
  LogOut,
  Shield,
  Menu,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <RouterLink to="/" className="flex items-center gap-3 group shrink-0">
          <InkVerseLogo size="md" />
          <div>
            <span className="text-xl font-bold font-sans tracking-tight text-slate-900 dark:text-white">
              Ink<span className="text-brand-600 dark:text-brand-400">Verse</span>
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-medium">
              Publishing Platform
            </span>
          </div>
        </RouterLink>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-md relative"
        >
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search articles, topics, or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-cardLight dark:bg-surface-cardDark text-sm pl-10 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-600 dark:focus:border-brand-400 transition shadow-sm"
          />
        </form>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-medium text-sm">
          <RouterLink
            to="/"
            className={`px-4 py-2 rounded-full transition ${
              isActive('/')
                ? 'bg-purple-50 dark:bg-purple-950/60 text-brand-700 dark:text-brand-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300'
            }`}
          >
            Home
          </RouterLink>

          <RouterLink
            to="/explore"
            className={`px-4 py-2 rounded-full transition ${
              isActive('/explore')
                ? 'bg-purple-50 dark:bg-purple-950/60 text-brand-700 dark:text-brand-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300'
            }`}
          >
            Explore
          </RouterLink>

          <RouterLink
            to="/categories"
            className={`px-4 py-2 rounded-full transition ${
              isActive('/categories')
                ? 'bg-purple-50 dark:bg-purple-950/60 text-brand-700 dark:text-brand-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300'
            }`}
          >
            Categories
          </RouterLink>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Write Button */}
          <RouterLink
            to="/write"
            className="hidden sm:flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-brand-glow hover:shadow-brand-hover transition duration-300"
          >
            <PenSquare className="w-4 h-4" />
            <span>Write</span>
          </RouterLink>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 transition"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-brand-700" />}
          </button>

          {/* User Account / Auth Buttons */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full border-2 border-brand-600/40 hover:border-brand-600 transition"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-3 w-56 bg-surface-cardLight dark:bg-surface-cardDark rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-brand-600 dark:text-brand-400 truncate">@{user.username}</p>
                  </div>

                  <RouterLink
                    to={`/profile/${user.username}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800 transition"
                  >
                    <UserIcon className="w-4 h-4 text-brand-600" />
                    <span>My Profile</span>
                  </RouterLink>

                  <RouterLink
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800 transition"
                  >
                    <LayoutDashboard className="w-4 h-4 text-brand-600" />
                    <span>Author Dashboard</span>
                  </RouterLink>

                  <RouterLink
                    to="/bookmarks"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800 transition"
                  >
                    <Bookmark className="w-4 h-4 text-brand-600" />
                    <span>Bookmarks</span>
                  </RouterLink>

                  {user.role === 'admin' && (
                    <RouterLink
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 font-medium hover:bg-amber-50 dark:hover:bg-amber-950/30 transition"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Portal</span>
                    </RouterLink>
                  )}

                  <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <RouterLink
                to="/login"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-300 px-3 py-2"
              >
                Sign In
              </RouterLink>
              <RouterLink
                to="/register"
                className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-brand-glow transition"
              >
                Get Started
              </RouterLink>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark px-4 py-4 space-y-3">
          <RouterLink
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-800 dark:text-slate-200 font-medium"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/explore"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-800 dark:text-slate-200 font-medium"
          >
            Explore
          </RouterLink>
          <RouterLink
            to="/categories"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-800 dark:text-slate-200 font-medium"
          >
            Categories
          </RouterLink>
          <RouterLink
            to="/write"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-brand-700 dark:text-brand-400 font-semibold"
          >
            <PenSquare className="w-4 h-4" />
            <span>Write Article</span>
          </RouterLink>
        </div>
      )}
    </header>
  );
};
