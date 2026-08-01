import React, { useState, useEffect } from 'react';
import type { User, Blog, AdminStats } from '../types';
import { StatsCard } from '../components/StatsCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Shield, Users, FileText, MessageSquare, Trash2, Layers } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [postsList, setPostsList] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, postsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/posts'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsersList(usersRes.data.users);
      if (postsRes.data.success) setPostsList(postsRes.data.posts);
    } catch (err) {
      showToast('Error loading admin portal data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user and all their posts?')) return;
    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        showToast('User deleted');
        fetchAdminData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error deleting user', 'error');
    }
  };

  const handleDeletePostAdmin = async (id: string) => {
    if (!window.confirm('Delete this article as inappropriate content?')) return;
    try {
      const res = await api.delete(`/admin/posts/${id}`);
      if (res.data.success) {
        showToast('Inappropriate post removed');
        fetchAdminData();
      }
    } catch (err) {
      showToast('Error removing post', 'error');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-slate-100 dark:border-slate-800 text-red-600 font-bold">
        Access Denied. Administrator privileges required.
      </div>
    );
  }

  if (loading) return <div className="p-12 text-center font-sans text-slate-500">Loading Admin Control Portal...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white flex items-center justify-center shadow-brand-glow">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white">
            InkVerse Admin Portal
          </h1>
          <p className="text-sm font-serif text-slate-500">
            Platform governance, user management, and content moderation.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Platform Users" value={stats?.totalUsers || 0} icon={Users} />
        <StatsCard title="Total Published Blogs" value={stats?.totalPublished || 0} icon={FileText} />
        <StatsCard title="Total Comments" value={stats?.totalComments || 0} icon={MessageSquare} />
        <StatsCard title="Categories" value={stats?.totalCategories || 0} icon={Layers} />
      </div>

      {/* Management Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 font-bold text-sm">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-4 px-6 border-b-2 transition ${
            activeTab === 'users'
              ? 'border-brand-700 text-brand-700 dark:text-brand-300'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Manage Users ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-4 px-6 border-b-2 transition ${
            activeTab === 'posts'
              ? 'border-brand-700 text-brand-700 dark:text-brand-300'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Manage Articles ({postsList.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'users' ? (
        <div className="bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-md overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="text-xs uppercase font-bold text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <tr>
                <th className="p-4 rounded-l-xl">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {usersList.map((u) => (
                <tr key={u._id}>
                  <td className="p-4 flex items-center gap-3 font-semibold text-slate-900 dark:text-white">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="block">{u.name}</span>
                      <span className="text-xs text-brand-600 font-normal">@{u.username}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-md overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="text-xs uppercase font-bold text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <tr>
                <th className="p-4 rounded-l-xl">Article Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Category</th>
                <th className="p-4 rounded-r-xl text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {postsList.map((p) => (
                <tr key={p._id}>
                  <td className="p-4 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                    {p.title}
                  </td>
                  <td className="p-4 font-medium">{p.author?.name}</td>
                  <td className="p-4 text-brand-700 dark:text-brand-300">{p.category?.name}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeletePostAdmin(p._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Remove Inappropriate Content"
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
  );
};
