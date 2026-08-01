import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Category } from '../types';
import { RichEditor } from '../components/RichEditor';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Save, ArrowLeft } from 'lucide-react';

export const EditBlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, blogRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/blogs`),
        ]);

        if (catsRes.data.success) {
          setCategories(catsRes.data.categories);
        }

        // Fetch target blog details
        const res = await api.get(`/blogs?author=${user?._id}`);
        const found = res.data.blogs.find((b: any) => b._id === id);
        if (found) {
          setTitle(found.title);
          setContent(found.content);
          setExcerpt(found.excerpt);
          setCoverImage(found.coverImage);
          setCategoryId(found.category?._id || '');
          setTags(found.tags ? found.tags.join(', ') : '');
        }
      } catch (err) {
        showToast('Failed to load blog details', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [id, user]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      showToast('Title and content are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.put(`/blogs/${id}`, {
        title,
        content,
        excerpt,
        coverImage,
        categoryId,
        tags: tags.split(',').map((t) => t.trim()),
      });

      if (res.data.success) {
        showToast('Article updated successfully!');
        navigate(`/blog/${res.data.blog.slug}`);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update article', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-12 text-center font-sans text-slate-500">Loading editor...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-brand-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleUpdate}
          disabled={submitting}
          className="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full shadow-brand-glow transition"
        >
          <Save className="w-4 h-4" />
          <span>Update Article</span>
        </button>
      </div>

      <div className="space-y-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-3xl sm:text-5xl font-extrabold font-sans text-slate-900 dark:text-white focus:outline-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 text-sm p-3 rounded-2xl border border-slate-200 dark:border-slate-700"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 text-sm p-3 rounded-2xl border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        <RichEditor value={content} onChange={(val) => setContent(val)} />
      </div>
    </div>
  );
};
