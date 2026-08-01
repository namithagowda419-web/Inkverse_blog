import React, { useState, useEffect } from 'react';
import type { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { MessageSquare, Heart, CornerDownRight, Trash2, Edit2, Send } from 'lucide-react';

interface CommentSectionProps {
  blogId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/blogs/${blogId}/comments`);
      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch (err) {
      console.error('Failed to fetch comments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const handleAddComment = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to leave a comment', 'info');
      return;
    }

    const text = parentId ? replyText : newCommentText;
    if (!text.trim()) return;

    try {
      const res = await api.post(`/blogs/${blogId}/comments`, {
        content: text.trim(),
        parentCommentId: parentId,
      });

      if (res.data.success) {
        showToast('Comment posted successfully');
        if (parentId) {
          setReplyText('');
          setReplyParentId(null);
        } else {
          setNewCommentText('');
        }
        fetchComments();
      }
    } catch (err) {
      showToast('Failed to post comment', 'error');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      showToast('Please sign in to like comments', 'info');
      return;
    }

    try {
      const res = await api.post(`/comments/${commentId}/like`);
      if (res.data.success) {
        fetchComments();
      }
    } catch (err) {
      showToast('Failed to like comment', 'error');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await api.delete(`/comments/${commentId}`);
      if (res.data.success) {
        showToast('Comment deleted');
        fetchComments();
      }
    } catch (err) {
      showToast('Failed to delete comment', 'error');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!editText.trim()) return;

    try {
      const res = await api.put(`/comments/${commentId}`, { content: editText.trim() });
      if (res.data.success) {
        showToast('Comment updated');
        setEditingId(null);
        fetchComments();
      }
    } catch (err) {
      showToast('Failed to update comment', 'error');
    }
  };

  // Group top-level vs replies
  const topLevelComments = comments.filter((c) => !c.parentComment);
  const getReplies = (parentId: string) => comments.filter((c) => c.parentComment === parentId);

  return (
    <section className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-brand-700 dark:text-brand-300 border border-purple-200 dark:border-purple-800">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h3 className="text-2xl font-bold font-sans text-slate-900 dark:text-white">
          Responses ({comments.length})
        </h3>
      </div>

      {/* Primary New Comment Form */}
      {user ? (
        <form onSubmit={(e) => handleAddComment(e, null)} className="mb-10">
          <div className="flex items-start gap-4">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover shrink-0 mt-1" />
            <div className="flex-1">
              <textarea
                rows={3}
                placeholder="What are your thoughts on this article?"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full bg-surface-cardLight dark:bg-surface-cardDark p-4 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-600 text-sm font-sans"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full shadow-brand-glow transition flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Response</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900 text-center mb-10">
          <p className="text-sm text-purple-900 dark:text-purple-200 font-medium">
            Sign in to join the conversation and share your feedback.
          </p>
        </div>
      )}

      {/* Comment List Tree */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      ) : topLevelComments.length === 0 ? (
        <p className="text-slate-500 font-serif text-sm italic">No responses yet. Be the first to start the discussion!</p>
      ) : (
        <div className="space-y-6">
          {topLevelComments.map((comment) => (
            <div key={comment._id} className="bg-surface-cardLight dark:bg-surface-cardDark p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={comment.author?.avatar} alt={comment.author?.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                      {comment.author?.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {user && (user._id === comment.author?._id || user.role === 'admin') && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(comment._id);
                        setEditText(comment.content);
                      }}
                      className="p-1 text-slate-400 hover:text-brand-600 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Editing Form or Text */}
              {editingId === comment._id ? (
                <form onSubmit={(e) => handleEditSubmit(e, comment._id)} className="mb-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-sans focus:outline-none mb-2"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="text-xs px-3 py-1.5 rounded-lg bg-brand-700 text-white font-medium shadow-sm"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-slate-800 dark:text-slate-200 text-sm font-serif leading-relaxed mb-3">
                  {comment.content}
                </p>
              )}

              {/* Comment Actions */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                <button
                  onClick={() => handleLikeComment(comment._id)}
                  className={`flex items-center gap-1.5 hover:text-brand-700 transition ${
                    comment.likedBy?.includes(user?._id || '') ? 'text-brand-700 fill-brand-700' : ''
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{comment.likesCount || 0}</span>
                </button>

                <button
                  onClick={() => setReplyParentId(replyParentId === comment._id ? null : comment._id)}
                  className="flex items-center gap-1.5 hover:text-brand-700 transition"
                >
                  <CornerDownRight className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </div>

              {/* Reply Form */}
              {replyParentId === comment._id && (
                <form onSubmit={(e) => handleAddComment(e, comment._id)} className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Reply to ${comment.author?.name}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-900 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="bg-brand-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-brand-glow"
                    >
                      Reply
                    </button>
                  </div>
                </form>
              )}

              {/* Nested Replies */}
              {getReplies(comment._id).length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-purple-200 dark:border-purple-900 space-y-4">
                  {getReplies(comment._id).map((reply) => (
                    <div key={reply._id} className="pt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <img src={reply.author?.avatar} alt={reply.author?.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{reply.author?.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
