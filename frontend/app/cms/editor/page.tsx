'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../config/AuthContext';
import styles from './page.module.css';

type BlockType = 'text' | 'image' | 'mcq' | 'code' | '3d-link';

interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  metadata?: Record<string, string>;
}

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  text: '\uD83D\uDCDD Text',
  image: '\uD83D\uDDBC\uFE0F Image',
  mcq: '\u2753 MCQ Question',
  code: '\uD83D\uDCBB Code',
  '3d-link': '\uD83D\uDD79\uFE0F 3D Link',
};

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export default function CMSEditorPage() {
  const { token, user } = useAuth();

  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function addBlock(type: BlockType) {
    setBlocks(prev => [...prev, { id: generateId(), type, content: '', metadata: {} }]);
  }

  function updateBlock(id: string, content: string) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
  }

  function removeBlock(id: string) {
    setBlocks(prev => prev.filter(b => b.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setErrorMsg('Title is required'); setStatus('error'); return; }
    setStatus('saving');
    setErrorMsg('');
    try {
      const payload = { title, subjectCode, difficulty, blocks };
      const res = await fetch('/api/v1/cms/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      setStatus('success');
      setTitle(''); setSubjectCode(''); setBlocks([]);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save lesson');
    }
  }

  if (!user) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Access Denied</h1>
          <p className={styles.subtitle}>You must be logged in to access the CMS editor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>✏️ Lesson Editor</h1>
        <p className={styles.subtitle}>Create or edit curriculum lesson content for the Mediverse platform.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="lesson-title">Lesson Title *</label>
          <input
            id="lesson-title"
            className={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Cardiac Action Potential — Phase 0-4 Mechanisms"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="subject-code">Subject Code</label>
          <input
            id="subject-code"
            className={styles.input}
            value={subjectCode}
            onChange={e => setSubjectCode(e.target.value)}
            placeholder="e.g., PHYS-CARD-101"
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            className={styles.select}
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className={styles.blocksSection}>
          <div className={styles.blocksSectionTitle}>Content Blocks</div>
          <div className={styles.addBlockBar}>
            {(Object.keys(BLOCK_TYPE_LABELS) as BlockType[]).map(type => (
              <button
                key={type}
                type="button"
                className={styles.addBlockBtn}
                onClick={() => addBlock(type)}
              >
                + {BLOCK_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
          <div className={styles.blockList}>
            {blocks.map(block => (
              <div key={block.id} className={styles.block}>
                <div className={styles.blockHeader}>
                  <span className={styles.blockType}>{BLOCK_TYPE_LABELS[block.type]}</span>
                  <button type="button" className={styles.removeBtn} onClick={() => removeBlock(block.id)} aria-label="Remove block">×</button>
                </div>
                <textarea
                  className={styles.textarea}
                  value={block.content}
                  onChange={e => updateBlock(block.id, e.target.value)}
                  placeholder={block.type === 'text' ? 'Enter text content (Markdown supported)...' :
                               block.type === 'mcq' ? 'Q: Question text\nA: Option A\nB: Option B\nC: Option C\nD: Option D\nANSWER: A\nEXPLANATION: Why A is correct' :
                               block.type === 'code' ? 'Enter code snippet here...' :
                               block.type === '3d-link' ? '/simulators/cardiac-cycle' :
                               'Image URL or description'}
                  rows={block.type === 'mcq' ? 7 : 4}
                />
              </div>
            ))}
            {blocks.length === 0 && (
              <p style={{ color: '#475569', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>
                No content blocks yet. Add one above to start building your lesson.
              </p>
            )}
          </div>
        </div>

        {status === 'success' && <div className={styles.success}>✅ Lesson saved successfully! It is now pending review in the CMS queue.</div>}
        {status === 'error' && <div className={styles.error}>❌ {errorMsg}</div>}

        <div className={styles.actionBar}>
          <button type="submit" className={styles.submitBtn} disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving...' : 'Submit for Review'}
          </button>
          <Link href="/cms" className={styles.cancelBtn}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
