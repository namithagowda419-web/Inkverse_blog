import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Blog } from '../types';
import { CommentSection } from '../components/CommentSection';
import { BlogCard } from '../components/BlogCard';
import { simpleMarkdownParser } from '../components/RichEditor';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Heart,
  Bookmark,
  Share2,
  Clock,
  Eye,
  ArrowLeft,
  Edit,
  Trash2,
  Check,
  UserPlus,
  UserCheck,
} from 'lucide-react';

export const BlogDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [recommended, setRecommended] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchBlogDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/blogs/${slug}`);
      if (res.data.success) {
        setBlog(res.data.blog);
        setRecommended(res.data.recommended || []);
        setIsLiked(!!res.data.blog.isLiked);
        setLikesCount(res.data.blog.likesCount);
        setIsBookmarked(!!res.data.blog.isBookmarked);
      }
    } catch (err) {
      showToast('Failed to load article', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
  }, [slug]);

  const handleLike = async () => {
    if (!user) {
      showToast('Please sign in to like this post', 'info');
      return;
    }

    try {
      const res = await api.post(`/blogs/${blog?._id}/like`);
      if (res.data.success) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
      }
    } catch (err) {
      showToast('Error liking post', 'error');
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      showToast('Please sign in to bookmark articles', 'info');
      return;
    }

    try {
      const res = await api.post(`/blogs/${blog?._id}/bookmark`);
      if (res.data.success) {
        setIsBookmarked(res.data.isBookmarked);
        showToast(res.data.isBookmarked ? 'Article bookmarked' : 'Removed bookmark');
      }
    } catch (err) {
      showToast('Error bookmarking', 'error');
    }
  };

  const handleFollowAuthor = async () => {
    if (!user) {
      showToast('Please sign in to follow authors', 'info');
      return;
    }

    try {
      const res = await api.post(`/users/follow/${blog?.author?._id}`);
      if (res.data.success) {
        setIsFollowing(res.data.isFollowing);
        showToast(res.data.isFollowing ? `Following ${blog?.author?.name}` : `Unfollowed ${blog?.author?.name}`);
      }
    } catch (err) {
      showToast('Cannot follow this user', 'error');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Article URL copied to clipboard');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await api.delete(`/blogs/${blog?._id}`);
      if (res.data.success) {
        showToast('Article deleted successfully');
        navigate('/');
      }
    } catch (err) {
      showToast('Failed to delete article', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
        <Link to="/" className="text-brand-700 font-semibold underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen pb-20">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-brand-700 to-accent z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Header Info & Hero Image */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-brand-700 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Category Pill & Reading Info */}
        <div className="flex items-center gap-3 text-xs font-semibold text-brand-700 dark:text-brand-300 mb-4">
          <span className="bg-purple-50 dark:bg-purple-950/60 px-3.5 py-1 rounded-full border border-purple-200 dark:border-purple-800 uppercase tracking-wider">
            {blog.category?.name}
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            {blog.readTime} min read
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-500">
            <Eye className="w-3.5 h-3.5" />
            {blog.views} views
          </span>
        </div>

        {/* Article Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Author Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-800 mb-8">
          <div className="flex items-center gap-4">
            <Link to={`/profile/${blog.author?.username}`}>
              <img
                src={blog.author?.avatar}
                alt={blog.author?.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-600/30"
              />
            </Link>
            <div>
              <Link
                to={`/profile/${blog.author?.username}`}
                className="text-base font-bold text-slate-900 dark:text-white hover:text-brand-700 transition block"
              >
                {blog.author?.name}
              </Link>
              <p className="text-xs text-slate-500 font-serif">
                Published on{' '}
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            {user && user._id !== blog.author?._id && (
              <button
                onClick={handleFollowAuthor}
                className={`ml-2 text-xs font-semibold px-4 py-1.5 rounded-full transition flex items-center gap-1.5 ${
                  isFollowing
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                    : 'bg-brand-700 text-white shadow-sm hover:bg-brand-800'
                }`}
              >
                {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
              </button>
            )}
          </div>

          {/* Owner Edit / Delete */}
          {user && (user._id === blog.author?._id || user.role === 'admin') && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit/${blog._id}`}
                className="p-2 rounded-xl text-slate-600 hover:text-brand-700 hover:bg-purple-50 transition"
                title="Edit Article"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition"
                title="Delete Article"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Hero Cover Image */}
        <div className="rounded-3xl overflow-hidden shadow-2xl mb-12 max-h-[500px]">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        <div
          className="prose-inkverse"
          dangerouslySetInnerHTML={{ __html: simpleMarkdownParser(blog.content) }}
        />

        {/* Article Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 my-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            {blog.tags.map((tag) => (
              <Link
                key={tag}
                to={`/explore?search=${tag}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border border-purple-100 dark:border-purple-900 hover:border-brand-500 transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Social Floating / Bottom Interaction Bar */}
        <div className="flex items-center justify-between p-6 bg-surface-cardLight dark:bg-surface-cardDark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg my-10">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition ${
                isLiked
                  ? 'bg-brand-700 text-white shadow-brand-glow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
              <span>{likesCount} Likes</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`p-2.5 rounded-full border transition ${
                isBookmarked
                  ? 'bg-purple-50 dark:bg-purple-950 text-brand-700 dark:text-brand-300 border-purple-200'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-brand-700'
              }`}
              title="Bookmark Article"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-brand-700' : ''}`} />
            </button>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-brand-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied' : 'Share Article'}</span>
          </button>
        </div>

        {/* Comments Section */}
        <CommentSection blogId={blog._id} />
      </main>

      {/* Recommended Reads */}
      {recommended.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold font-sans text-slate-900 dark:text-white mb-8">
            Recommended Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommended.map((rec) => (
              <BlogCard key={rec._id} blog={rec} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
