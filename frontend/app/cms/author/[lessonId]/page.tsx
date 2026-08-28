'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../config/AuthContext';
import ContentBlockEditor from '../../../../components/cms/ContentBlockEditor';

interface ContentBlock {
  id: string;
  blockType: string;
  contentPayload: string;
  sortOrder: number;
}

export default function LessonAuthorPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingBlock, setEditingBlock] = useState<Partial<ContentBlock> | null>(null);
  const [showNewEditor, setShowNewEditor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !lessonId) return;
    Promise.all([
      fetch(`/api/v1/cms/lessons/${lessonId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`/api/v1/cms/lessons/${lessonId}/blocks`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => []),
    ]).then(([lessonData, blocksData]) => {
      setLesson(lessonData);
      setBlocks(Array.isArray(blocksData) ? blocksData.sort((a, b) => a.sortOrder - b.sortOrder) : []);
    }).finally(() => setLoading(false));
  }, [token, lessonId]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleSaveBlock = async (block: Partial<ContentBlock>) => {
    if (!token) return;
    setSaving(true);
    try {
      if (block.id) {
        // Update existing
        const res = await fetch(`/api/v1/cms/lessons/${lessonId}/blocks/${block.id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ blockType: block.blockType, contentPayload: block.contentPayload, sortOrder: block.sortOrder }),
        });
        if (res.ok) {
          const updated = await res.json();
          setBlocks(prev => prev.map(b => b.id === block.id ? updated : b).sort((a, b) => a.sortOrder - b.sortOrder));
          showToast('Block updated');
        }
      } else {
        // Create new
        const res = await fetch(`/api/v1/cms/lessons/${lessonId}/blocks`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ blockType: block.blockType, contentPayload: block.contentPayload, sortOrder: block.sortOrder }),
        });
        if (res.ok) {
          const created = await res.json();
          setBlocks(prev => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder));
          showToast('Block created');
        }
      }
    } finally {
      setSaving(false);
      setEditingBlock(null);
      setShowNewEditor(false);
    }
  };

  const handleDelete = async (blockId: string) => {
    if (!token || !confirm('Delete this block?')) return;
    await fetch(`/api/v1/cms/lessons/${lessonId}/blocks/${blockId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    showToast('Block deleted');
  };

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const newBlocks = [...blocks];
    const target = idx + dir;
    if (target < 0 || target >= newBlocks.length) return;
    [newBlocks[idx], newBlocks[target]] = [newBlocks[target], newBlocks[idx]];
    setBlocks(newBlocks.map((b, i) => ({ ...b, sortOrder: i + 1 })));
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">Loading lesson...</div>;

  const BLOCK_ICONS: Record<string, string> = { TEXT: '📝', QUIZ: '❓', FLASHCARD: '🃏', DIAGRAM: '📊', FORMULA: '🧮', CALLOUT: '💎' };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, background: '#1e3a5f', border: '1px solid rgba(59,130,246,0.4)', borderRadius: '0.75rem', padding: '0.75rem 1.25rem', color: '#93c5fd', fontSize: '0.8rem', fontWeight: 700 }}>{toast}</div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/cms" className="text-xs text-slate-400 hover:text-slate-200 transition">← CMS Queue</Link>
          <span className="text-slate-700">/</span>
          <span className="text-xs text-slate-400">Author</span>
        </div>

        <header className="mb-8">
          <div className="text-blue-400 text-xs font-bold tracking-wider uppercase mb-1">Content Block Editor</div>
          <h1 className="text-2xl font-black text-white mb-1">{lesson?.title ?? lessonId}</h1>
          <p className="text-slate-500 text-xs">{blocks.length} content blocks • Drag to reorder</p>
        </header>

        {/* Block list */}
        <div className="space-y-3 mb-6">
          {blocks.map((block, idx) => (
            <div key={block.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition"
            >
              {editingBlock?.id === block.id ? (
                <ContentBlockEditor
                  block={editingBlock}
                  lessonId={lessonId}
                  onSave={handleSaveBlock}
                  onCancel={() => setEditingBlock(null)}
                />
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg shrink-0">{BLOCK_ICONS[block.blockType] ?? '📄'}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{block.blockType} · Sort #{block.sortOrder}</div>
                      <p className="text-sm text-slate-300 truncate">{block.contentPayload?.slice(0, 100)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => moveBlock(idx, -1)} disabled={idx === 0}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition disabled:opacity-30" title="Move up">↑</button>
                    <button type="button" onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition disabled:opacity-30" title="Move down">↓</button>
                    <button type="button" onClick={() => setEditingBlock(block)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-400 hover:bg-blue-950/40 border border-transparent hover:border-blue-800/50 transition">Edit</button>
                    <button type="button" onClick={() => handleDelete(block.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {blocks.length === 0 && !showNewEditor && (
            <div className="text-center py-12 text-slate-500 text-sm">
              <span className="text-3xl block mb-3">📭</span>
              No content blocks yet. Add your first block below.
            </div>
          )}
        </div>

        {/* New block editor */}
        {showNewEditor ? (
          <ContentBlockEditor
            lessonId={lessonId}
            block={{ sortOrder: blocks.length + 1 }}
            onSave={handleSaveBlock}
            onCancel={() => setShowNewEditor(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowNewEditor(true)}
            className="w-full py-3 border-2 border-dashed border-slate-700 hover:border-blue-600/50 rounded-xl text-slate-400 hover:text-blue-400 text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span> Add Content Block
          </button>
        )}
      </div>
    </div>
  );
}
