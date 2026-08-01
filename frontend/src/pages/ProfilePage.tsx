import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { User, Blog } from '../types';
import { BlogCard } from '../components/BlogCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { UserCheck, UserPlus, Edit3, FileText } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, updateUser } = useAuth();
  const { showToast } = useNotification();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Blog[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/profile/${username}`);
      if (res.data.success) {
        setProfileUser(res.data.user);
        setPosts(res.data.posts);
        setIsFollowing(res.data.isFollowing);
        setEditName(res.data.user.name);
        setEditBio(res.data.user.bio || '');
        setEditAvatar(res.data.user.avatar || '');
      }
    } catch (err) {
      showToast('User profile not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      showToast('Please sign in to follow users', 'info');
      return;
    }

    try {
      const res = await api.post(`/users/follow/${profileUser?._id}`);
      if (res.data.success) {
        setIsFollowing(res.data.isFollowing);
        setProfileUser((prev) =>
          prev ? { ...prev, followersCount: res.data.followersCount } : null
        );
      }
    } catch (err) {
      showToast('Failed to update follow status', 'error');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile', {
        name: editName,
        bio: editBio,
        avatar: editAvatar,
      });

      if (res.data.success) {
        showToast('Profile updated!');
        setProfileUser(res.data.user);
        updateUser(res.data.user);
        setIsEditModalOpen(false);
      }
    } catch (err) {
      showToast('Failed to update profile', 'error');
    }
  };

  if (loading) return <div className="p-12 text-center font-sans text-slate-500">Loading Profile...</div>;
  if (!profileUser) return <div className="p-12 text-center font-sans text-slate-500">User not found</div>;

  const isSelf = currentUser?._id === profileUser._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Banner Card */}
      <div className="bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-xl flex flex-col md:flex-row items-center gap-8">
        <img
          src={profileUser.avatar}
          alt={profileUser.name}
          className="w-32 h-32 rounded-full object-cover ring-4 ring-brand-700/30 shrink-0"
        />

        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <h1 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
              {profileUser.name}
            </h1>
            <span className="bg-purple-50 dark:bg-purple-950/80 text-brand-700 dark:text-brand-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-purple-200 dark:border-purple-800">
              @{profileUser.username}
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-300 font-serif text-sm max-w-xl leading-relaxed">
            {profileUser.bio || 'Passionate author on InkVerse Publishing Platform.'}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-6 text-sm font-semibold text-slate-700 dark:text-slate-300 pt-2">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">{posts.length}</span> Articles
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">{profileUser.followersCount || 0}</span> Followers
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">{profileUser.followingCount || 0}</span> Following
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="shrink-0">
          {isSelf ? (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-full border border-slate-200 dark:border-slate-700 transition"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={handleFollowToggle}
              className={`flex items-center gap-2 font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition ${
                isFollowing
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  : 'bg-brand-700 hover:bg-brand-800 text-white shadow-brand-glow'
              }`}
            >
              {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{isFollowing ? 'Following' : 'Follow Author'}</span>
            </button>
          )}
        </div>
      </div>

      {/* User Articles Feed */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-sans text-slate-900 dark:text-white">
          Published Articles ({posts.length})
        </h2>

        {posts.length === 0 ? (
          <div className="p-12 text-center bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-slate-100 dark:border-slate-800">
            <FileText className="w-10 h-10 text-brand-500 mx-auto mb-3" />
            <p className="text-sm font-serif text-slate-500">No articles published by this author yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-cardLight dark:bg-surface-cardDark max-w-md w-full p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-serif"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-brand-700 text-white text-xs font-semibold uppercase tracking-wider shadow-brand-glow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
