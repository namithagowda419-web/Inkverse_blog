import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category } from '../types';
import { RichEditor } from '../components/RichEditor';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Image as ImageIcon, Send, Save, ArrowLeft } from 'lucide-react';

export const WriteBlogPage: React.FC = () => {
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
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      showToast('Please sign in to write articles', 'info');
      navigate('/login');
      return;
    }

    api.get('/categories').then((res) => {
      if (res.data.success && res.data.categories.length > 0) {
        setCategories(res.data.categories);
        setCategoryId(res.data.categories[0]._id);
      }
    });
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      showToast('Uploading cover image...', 'info');
      const res = await api.post('/blogs/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setCoverImage(res.data.url);
        showToast('Cover image uploaded!');
      }
    } catch (err) {
      showToast('Failed to upload image', 'error');
    }
  };

  const handleSubmit = async (status: 'published' | 'draft') => {
    if (!title.trim() || !content.trim() || !categoryId) {
      showToast('Please fill in title, content and select a category', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/blogs', {
        title,
        content,
        excerpt,
        coverImage,
        categoryId,
        tags: tags.split(',').map((t) => t.trim()),
        status,
        isFeatured,
      });

      if (res.data.success) {
        showToast(status === 'published' ? 'Article published successfully!' : 'Saved to drafts!');
        navigate(`/blog/${res.data.blog.slug}`);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create article', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-brand-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={submitting}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => handleSubmit('published')}
            disabled={submitting}
            className="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full shadow-brand-glow transition"
          >
            <Send className="w-4 h-4" />
            <span>Publish Now</span>
          </button>
        </div>
      </div>

      {/* Form Area */}
      <div className="space-y-6">
        {/* Title Input */}
        <input
          type="text"
          placeholder="Article Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-3xl sm:text-5xl font-extrabold font-sans text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none tracking-tight"
        />

        {/* Cover Image Selector */}
        <div className="p-6 bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          {coverImage ? (
            <div className="relative rounded-2xl overflow-hidden max-h-72">
              <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
              <button
                onClick={() => setCoverImage('')}
                className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <ImageIcon className="w-10 h-10 text-brand-600 mx-auto" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Upload Cover Image
                </p>
                <p className="text-xs text-slate-400 font-serif">Supported: JPG, PNG, WEBP (Max 5MB)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="cover-upload-input"
              />
              <label
                htmlFor="cover-upload-input"
                className="inline-block bg-purple-50 dark:bg-purple-950/60 text-brand-700 dark:text-brand-300 font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full border border-purple-200 dark:border-purple-800 cursor-pointer hover:bg-purple-100 transition"
              >
                Choose File
              </label>
            </>
          )}
        </div>

        {/* Metadata Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 text-sm p-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none text-slate-900 dark:text-white"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Design, Architecture, AI"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 text-sm p-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Short Excerpt (Optional)
            </label>
            <input
              type="text"
              placeholder="Brief summary to entice readers on feeds..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 text-sm p-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none text-slate-900 dark:text-white font-serif"
            />
          </div>
        </div>

        {/* Markdown Rich Editor */}
        <RichEditor value={content} onChange={(val) => setContent(val)} />
      </div>
    </div>
  );
};
