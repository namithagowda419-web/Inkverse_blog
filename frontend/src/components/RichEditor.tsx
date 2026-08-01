import React, { useState } from 'react';
import { Bold, Italic, Heading1, Heading2, List, Quote, Code, Image as ImageIcon, Eye, Edit3 } from 'lucide-react';

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export const RichEditor: React.FC<RichEditorProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('blog-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-surface-cardLight dark:bg-surface-cardDark shadow-sm">
      {/* Editor Header & Formatting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            type="button"
            onClick={() => insertMarkdown('**', '**')}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('*', '*')}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />
          <button
            type="button"
            onClick={() => insertMarkdown('# ', '')}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('## ', '')}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />
          <button
            type="button"
            onClick={() => insertMarkdown('- ', '')}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('> ', '')}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('```javascript\n', '\n```')}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('![Image description](', ')')}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Insert Image Markdown"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Write / Preview Tab Switcher */}
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'write'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'preview'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Content Body */}
      {activeTab === 'write' ? (
        <textarea
          id="blog-content-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tell your story... Use Markdown formatting (# Header, **bold**, > quotes, code blocks)"
          rows={16}
          className="w-full p-5 bg-transparent text-slate-900 dark:text-slate-100 font-serif leading-relaxed focus:outline-none resize-y min-h-[350px]"
        />
      ) : (
        <div className="p-6 prose-inkverse min-h-[350px]">
          {value.trim() ? (
            <div dangerouslySetInnerHTML={{ __html: simpleMarkdownParser(value) }} />
          ) : (
            <p className="text-slate-400 italic font-sans text-sm">Nothing to preview yet. Switch back to Write mode.</p>
          )}
        </div>
      )}
    </div>
  );
};

// Lightweight markdown HTML converter for live preview
export function simpleMarkdownParser(md: string): string {
  if (!md) return '';
  let html = md
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' class='text-brand-700 underline'>$1</a>")
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/`(.*?)`/gim, '<code>$1</code>')
    .replace(/\n$/gim, '<br />');

  return html;
}
