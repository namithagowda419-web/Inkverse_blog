import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { DashboardStats, Blog } from '../types';
import { StatsCard } from '../components/StatsCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  FileText,
  Eye,
  Heart,
  MessageSquare,
  PenSquare,
  Trash2,
  Edit,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/analytics/dashboard');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentBlogs(res.data.recentBlogs);
      }
    } catch (err) {
      showToast('Failed to load author analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboard();
  }, [user]);

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await api.delete(`/blogs/${id}`);
      if (res.data.success) {
        showToast('Article deleted successfully');
        fetchDashboard();
      }
    } catch (err) {
      showToast('Failed to delete article', 'error');
    }
  };

  if (loading) return <div className="p-12 text-center font-sans text-slate-500">Loading Author Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
            InkVerse Author Dashboard
          </h1>
          <p className="text-sm font-serif text-slate-500">
            Performance analytics & article management for {user?.name}.
          </p>
        </div>

        <Link
          to="/write"
          className="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-brand-glow transition"
        >
          <PenSquare className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Articles" value={stats?.totalPosts || 0} icon={FileText} subtitle={`${stats?.publishedPosts || 0} Published`} />
        <StatsCard title="Total Views" value={stats?.totalViews || 0} icon={Eye} subtitle="Across all published posts" />
        <StatsCard title="Total Likes" value={stats?.totalLikes || 0} icon={Heart} subtitle="Community appreciation" />
        <StatsCard title="Total Comments" value={stats?.totalComments || 0} icon={MessageSquare} subtitle="Discussions started" />
      </div>

      {/* Recent Articles Table */}
      <div className="bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-md">
        <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white mb-6">
          Your Recent Articles
        </h3>

        {recentBlogs.length === 0 ? (
          <p className="text-sm font-serif text-slate-500 italic py-6 text-center">
            You haven't written any articles yet. Click "New Article" to publish your first story!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="text-xs uppercase font-bold text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <tr>
                  <th className="p-4 rounded-l-xl">Article</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Likes</th>
                  <th className="p-4 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentBlogs.map((b) => (
                  <tr key={b._id} className="hover:bg-purple-50/40 dark:hover:bg-purple-950/30 transition">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">
                      <Link to={`/blog/${b.slug}`} className="hover:text-brand-700 transition">
                        {b.title}
                      </Link>
                    </td>
                    <td className="p-4 font-medium text-brand-700 dark:text-brand-300">
                      {b.category?.name || 'General'}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          b.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono">{b.views}</td>
                    <td className="p-4 font-mono">{b.likesCount}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/edit/${b._id}`}
                        className="inline-block p-1.5 text-slate-500 hover:text-brand-700 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeletePost(b._id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
